import {fetch} from "../utils/dataAccess";

export function token(token) {
  return { type: 'LOGIN_TOKEN', token };
}

export function error(error) {
  return { type: 'LOGIN_ERROR', error };
}

export function login(credentials) {
  return dispatch => {
    dispatch(error(null));

    fetch("auth", {method: 'POST', body: JSON.stringify(credentials)})
      .then(response => response.json())
      .then(retrieved => {
        dispatch(token(retrieved.token));
      })
      .catch(e => {
        dispatch(error(e.message));
      });
  }
}

export function forgetToken() {
  return token(null);
}
