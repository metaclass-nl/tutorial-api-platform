import { combineReducers } from 'redux';
import getIntl from '../../utils/intlProvider';

export function retrieveError(state = null, action) {
  switch (action.type) {
    case 'HOURS_UPDATE_RETRIEVE_ERROR':
      return action.retrieveError;

    case 'HOURS_UPDATE_MERCURE_DELETED':
        const intl = getIntl();
        return intl.formatMessage({id:"employee.mercure_deleted", defaultMessage:"{label} has been deleted by another user."}, {label: action.retrieved['@id']});

    case 'HOURS_UPDATE_RESET':
      return null;

    default:
      return state;
  }
}

export function retrieveLoading(state = false, action) {
  switch (action.type) {
    case 'HOURS_UPDATE_RETRIEVE_LOADING':
      return action.retrieveLoading;

    case 'HOURS_UPDATE_RESET':
      return false;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'HOURS_UPDATE_RETRIEVE_SUCCESS':
    case 'HOURS_UPDATE_MERCURE_MESSAGE':
      return action.retrieved;

    case 'HOURS_UPDATE_RESET':
      return null;

    default:
      return state;
  }
}

export function updateError(state = null, action) {
  switch (action.type) {
    case 'HOURS_UPDATE_UPDATE_ERROR':
      return action.updateError;

    case 'HOURS_UPDATE_RESET':
      return null;

    default:
      return state;
  }
}

export function updateLoading(state = false, action) {
  switch (action.type) {
    case 'HOURS_UPDATE_UPDATE_LOADING':
      return action.updateLoading;

    case 'HOURS_UPDATE_RESET':
      return false;

    default:
      return state;
  }
}

export function updated(state = null, action) {
  switch (action.type) {
    case 'HOURS_UPDATE_UPDATE_SUCCESS':
      return action.updated;

    case 'HOURS_UPDATE_RESET':
      return null;

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'HOURS_UPDATE_MERCURE_OPEN':
      return action.eventSource;

    case 'HOURS_UPDATE_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({
  retrieveError,
  retrieveLoading,
  retrieved,
  updateError,
  updateLoading,
  updated,
  eventSource
});
