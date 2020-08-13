import { combineReducers } from 'redux';

export function token(state = null, action) {
  switch (action.type) {
    case 'LOGIN_TOKEN':
      return action.token;

    default:
      return state;
  }
}

export function error(state = null, action) {
  switch (action.type) {
    case 'LOGIN_ERROR':
      return action.error

    default:
      return state;
  }
}

export default combineReducers({ token, error });