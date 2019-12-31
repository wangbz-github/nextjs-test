import axios from 'axios';
import { get } from 'http';

// action type
const GET_TYPE = 'GOLD/TYPE';
const GET_LIST = 'GOLD/LIST';

// action creator 
export const changeType = (type) => ({
  type: GET_TYPE,
  payload: type
});

const changeList = (list) => ({
  type: GET_LIST,
  payload: list
});


const defaultState = {
  type: 'all',
  list: [],
  category: [
    {
      text: '首页',
      value: 'all'
    },
    {
      text: '前端',
      value: 'frontend'
    },
    {
      text: '后端',
      value: 'backend'
    }
  ]
};

export const getGoldList = (dispatch, getState, axiosInstance) => {
  const type = getState().gold.type
  return axiosInstance.post(`resources/gold`, {
    category: type,
    order: "heat",
    offset: 0,
    limit: 30,
  }).then(res => {
    const { data } = res.data;
    dispatch(changeList(data));
  });
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_TYPE:
      return { ...state, type: action.payload }
    case GET_LIST:
      return { ...state, list: action.payload }
    default:
      return state;
  }
}