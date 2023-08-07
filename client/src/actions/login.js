import {fetch} from "../utils/dataAccess";

export function token(token) {
  return { type: 'LOGIN_TOKEN', token };
}

export function error(error) {
  return { type: 'LOGIN_ERROR', error };
}

export function admin(isUserAdmin) {
  return { type: 'LOGIN_ADMIN', isUserAdmin };
}

export function employee(userEmployee) {
  return { type: 'LOGIN_EMPLOYEE', userEmployee };
}

export function login(credentials) {
  return dispatch => {
    dispatch(error(null));

    fetch("auth", {method: 'POST', body: JSON.stringify(credentials)})
      .then(response => response.json())
      .then(retrieved => {
        dispatch(token(retrieved.token));
        discoverUserAdminRole(dispatch);
        discoverUserEmployee(dispatch);
      })
      .catch(e => {
        dispatch(error(e.message));
      });
  }
}

export function forgetToken() {
  return token(null);
}

function discoverUserAdminRole(dispatch) {
  dispatch(admin(null));

  fetch("users")
    .then(response => response.json())
    .then(retrieved => {
      if (retrieved["hydra:totalItems"] === 1) {
        return dispatch(admin(retrieved['hydra:member'][0].admin));
      }
      dispatch(admin(retrieved["hydra:totalItems"] > 1));
    })
    .catch(e => {
      dispatch(error(e.message));
    });
}

function discoverUserEmployee(dispatch) {
  dispatch(employee(null));

  fetch("employees")
    .then(response => response.json())
    .then(retrieved => {
      if (retrieved["hydra:totalItems"] === 1) {
        dispatch(employee(retrieved['hydra:member'][0]));
      }
    })
    .catch(e => {
      dispatch(error(e.message));
    });
}
