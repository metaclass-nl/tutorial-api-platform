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

export function isUserAdmin(state = null, action) {
  switch (action.type) {
    case 'LOGIN_ADMIN':
      return action.isUserAdmin;

    default:
      return state;
  }
}

export function userEmployee(state = null, action) {
  switch (action.type) {
    case 'LOGIN_EMPLOYEE':
      return action.userEmployee;

    default:
      return state;
  }
}

export default combineReducers({ token, error, isUserAdmin, userEmployee });