import {act} from 'react-test-renderer';
import {
  ADD,
  ADDUSER,
  REMOVEUSER,
  ADDFIREBASE,
  REMOVEFIREBASE,
  ADDEVENT,
  REMOVEEVENT,
  ADDEVENTID,
  REMOVEEVENTID,
} from '../ActionTypes';

const initialState = {
  user: {},
  firebase: {},
  event: {},
  number: 0,
  eventId: 0,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case ADDFIREBASE:
      return {
        user: state.user,
        firebase: action.payload,
      };
    case REMOVEFIREBASE:
      return {
        user: state.user,
        firebase: action.payload,
      };
    case ADDUSER:
      return {
        user: action.payload,
        firebase: state.firebase,
      };
    case REMOVEUSER:
      return {
        user: action.payload,
        firebase: state.firebase,
      };
    case ADDEVENT:
      return {
        user: state.user,
        event: action.payload,
        eventId: state.eventId,
      };
    case REMOVEEVENT:
      return {
        user: state.user,
        event: action.payload,
        eventId: state.eventId,
      };
    case ADDEVENTID:
      return {
        user: state.user,
        event: state.event,
        eventId: action.payload,
      };
    case REMOVEEVENTID:
      return {
        user: state.user,
        event: state.event,
        eventId: action.payload,
      };
    case ADD:
      return {
        number: state.number + action.payload,
      };
    default:
      return state;
  }
}

export default reducer;
