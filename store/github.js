// action type
const GET_TYPE = 'GITHUB/TYPE';
const GET_LIST = 'GITHUB/LIST';

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
  type: 'javascript',
  list: [],
  category: [
    {
      text: 'JavaScript',
      value: 'javascript'
    },
    {
      text: 'Css',
      value: 'css'
    },
    {
      text: 'HTML',
      value: 'html'
    }
  ]
};

export const getGitList = (dispatch, getState, axiosInstance) => {
  const type = getState().github.type;
  return axiosInstance.post(`resources/github`, {
    category: "trending",
    period: "day",
    lang: type,
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