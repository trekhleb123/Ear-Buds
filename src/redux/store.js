import { createStore, applyMiddleware } from "redux"
import { createLogger } from "redux-logger"
import thunkMiddleware from "redux-thunk"
import { spotfityLogin, getNewToken, getMyData } from "../spotifyLogin"

const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN"
const SET_REFRESH_TOKEN = "SET_REFRESH_TOKEN"
const SET_USER_NAME = "SET_USER_NAME"

export const setAccessToken = (access_token) => {
  return {
    type: SET_ACCESS_TOKEN,
    access_token,
  }
}

export const setRefreshToken = (refresh_token) => {
  return {
    type: SET_REFRESH_TOKEN,
    refresh_token,
  }
}

export const setUserName = (name) => {
  return {
    type: SET_USER_NAME,
    name,
  }
}

export const getAccessToken = () => {
  return async (dispatch) => {
    try {
      const res = await spotfityLogin()
      console.log(res)
      dispatch(setAccessToken(res.access_token))
      dispatch(setRefreshToken(res.refresh_token))
    } catch (err) {
      console.error(err)
    }
  }
}

const initialState = {
  access_token: "",
  refresh_token: "",
  name: "",
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCESS_TOKEN:
      return { ...state, access_token: state.access_token }
    case SET_REFRESH_TOKEN:
      return { ...state, refresh_token: state.refresh_token }
    default:
      return state
  }
}

const middleware = applyMiddleware(
  thunkMiddleware,
  createLogger({ collapsed: true })
)

const store = createStore(reducer, middleware)

export default store
