import {
  ADD,
  ADDUSER,
  REMOVEUSER,
  ADDEVENT,
  REMOVEEVENT,
  ADDEVENTID,
  REMOVEEVENTID,
  ADDFIREBASE,
  REMOVEFIREBASE,
} from '../ActionTypes';

export const addUser = data => {
  return {
    type: ADDUSER,
    payload: data,
  };
};

export const deleteUser = () => {
  return {
    type: REMOVEUSER,
    payload: {},
  };
};

export const addEvent = data => {
  return {
    type: ADDEVENT,
    payload: data,
  };
};

export const deleteEvent = () => {
  return {
    type: REMOVEEVENT,
    payload: {},
  };
};

export const addEventId = data => {
  return {
    type: ADDEVENTID,
    payload: data,
  };
};

export const deleteEventId = () => {
  return {
    type: REMOVEEVENTID,
    payload: 0,
  };
};

export const addFirebase = data => {
  return {
    type: ADDFIREBASE,
    payload: data,
  };
};

export const deleteFirebase = () => {
  return {
    type: REMOVEFIREBASE,
    payload: {},
  };
};

export const add = () => {
  return {
    type: ADD,
    payload: 10,
  };
};

export const incrementAsync = () => {
  return dispatch => {
    setTimeout(() => {
      dispatch(add());
    }, 5000);
  };
};
