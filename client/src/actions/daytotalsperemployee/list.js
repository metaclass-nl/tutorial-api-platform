import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';

export function error(error) {
  return { type: 'DAYTOTALSPEREMPLOYEE_LIST_ERROR', error };
}

export function loading(loading) {
  return { type: 'DAYTOTALSPEREMPLOYEE_LIST_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'DAYTOTALSPEREMPLOYEE_LIST_SUCCESS', retrieved };
}

export function query(query) {
  return { type: 'DAYTOTALSPEREMPLOYEE_LIST_QUERY', query };
}

export function list(page = 'day_totals_per_employees') {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));

    fetch(page)
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        dispatch(loading(false));
        dispatch(success(retrieved));

        if (hubURL && retrieved['hydra:member'].length)
          dispatch(
            mercureSubscribe(
              hubURL,
              retrieved['hydra:member'].map(i => i['@id'])
            )
          );
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message));
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'DAYTOTALSPEREMPLOYEE_LIST_RESET' });
  };
}

export function mercureSubscribe(hubURL, topics) {
  return dispatch => {
    const eventSource = subscribe(hubURL, topics);
    dispatch(mercureOpen(eventSource));
    eventSource.addEventListener('message', event =>
      dispatch(mercureMessage(normalize(JSON.parse(event.data))))
    );
  };
}

export function mercureOpen(eventSource) {
  return { type: 'DAYTOTALSPEREMPLOYEE_LIST_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'DAYTOTALSPEREMPLOYEE_LIST_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'DAYTOTALSPEREMPLOYEE_LIST_MERCURE_MESSAGE', retrieved });
  };
}
