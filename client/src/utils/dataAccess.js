import { ENTRYPOINT } from '../config/entrypoint';
import { SubmissionError } from 'redux-form';
import get from 'lodash/get';
import has from 'lodash/has';
import mapValues from 'lodash/mapValues';

const MIME_TYPE = 'application/ld+json';

let token = null;
const errorHandlers = [];

/**
 * @param string|null newToken JWT token
 * Will be used for ALL fetch calls
 */
export function setToken(newToken) {
  token = newToken;
}

/**
 * @param function handler
 */
export function onFetchError(handler) {
  errorHandlers.push(handler);
}

export function fetch(id, options = {}) {
  if ('undefined' === typeof options.headers) options.headers = new Headers();

  if (token)
    options.headers.set('Authorization', 'Bearer ' + token);
  if (null === options.headers.get('Accept'))
    options.headers.set('Accept', MIME_TYPE);
  if (
    'undefined' !== options.body &&
    !(options.body instanceof FormData) &&
    null === options.headers.get('Content-Type')
  )
  options.headers.set('Content-Type', MIME_TYPE);

  return global.fetch(new URL(id, ENTRYPOINT), options).then(response => {
    if (response.ok) return response;

    return response.json().then(json => {
      errorHandlers.forEach(handler => handler(response.status, json, id, options));

      const error = json['hydra:description'] || response.statusText;
      if (!json.violations) throw Error(error);

      let errors = { _error: error };
      json.violations.map(
        violation => (errors[violation.propertyPath] = violation.message)
      );

      throw new SubmissionError(errors);
    });
  });
}

export function mercureSubscribe(url, topics) {
  topics.forEach(topic =>
    url.searchParams.append('topic', new URL(topic, ENTRYPOINT))
  );

  return new EventSource(url.toString());
}

export function normalize(data) {
  if (has(data, 'hydra:member')) {
    // Normalize items in collections
    data['hydra:member'] = data['hydra:member'].map(item => normalize(item));

    return data;
  }

  // Flatten nested documents
  return mapValues(data, value =>
    Array.isArray(value)
      ? value.map(v => get(v, '@id', v))
      : get(value, '@id', value)
  );
}

export function extractHubURL(response) {
  const linkHeader = response.headers.get('Link');
  if (!linkHeader) return null;

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/
  );

  return matches && matches[1] ? new URL(matches[1], ENTRYPOINT) : null;
}

/**
 * Build a query string portion for an url from a plain object.
 * The object may be nested.
 * Any value typeof "object" except null will be handled as a nested object.
 * (values like new String("String) or new Number(12) will not be handled correctly)
 * @param values Plain Object
 * @param prefix string
 * @returns string
 */
export function buildQuery(values, prefix) {
  let query = "";
  for (let key in values) {
    const value = values[key];
    if (value) {
      const param = prefix ? prefix + "[" + key + "]" : key;
      query += value !== null && typeof value === 'object'
        ? buildQuery(value, param)
        : "&" + param + "=" + encodeURIComponent(value);
    }
  }
  return query;
}

/**
 * Parses query string portion from uri
 * @param queryOrUri string with max 1 level of nesting
 * @returns Plain Object
 */
export function parseQuery(queryOrUri) {
  const pathAndQuery = queryOrUri.split("?");
  const params = new URLSearchParams(
    pathAndQuery.length === 1 ? pathAndQuery[0] : pathAndQuery[1]
  );
  const values = {};
  for (let [key, value] of params) {
    if (!key) continue;

    const pieces = key.split("[");
    if (pieces.length > 2) {
      throw new Error("More then 1 level of nesting");
    }
    if (pieces.length === 1) {
      values[key] = value;
    } else {
      if (values[pieces[0]] === undefined) {
        values[pieces[0]] = {};
      }
      values[pieces[0]][pieces[1].slice(0, -1)] = value;
    }
  }
  return values;
}

