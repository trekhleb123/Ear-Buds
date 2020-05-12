import { createStore, applyMiddleware } from "redux"
import { createLogger } from "redux-logger"
import thunkMiddleware from "redux-thunk"
import {
  spotifyLogin,
  getNewToken,
  getMyData,
  loginHelper,
} from "../spotifyLogin"

const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN"
const SET_REFRESH_TOKEN = "SET_REFRESH_TOKEN"
const SET_SPOTIFY_CODE = "SET_SPOTIFY_CODE"
const SET_USER_DATA = "SET_USER_DATA"

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

export const setUserData = (userData) => {
  return {
    type: SET_USER_DATA,
    userData,
  }
}

export const setSpotifyCode = (code) => {
  return {
    type: SET_SPOTIFY_CODE,
    code,
  }
}

export const getAccessToken = (code) => {
  return async (dispatch) => {
    try {
      const res = await loginHelper(code)
      console.log(res)
      dispatch(setAccessToken(res.access_token))
      dispatch(setRefreshToken(res.refresh_token))
    } catch (err) {
      console.error(err)
    }
  }
}

// export const getSpotifyCode = () => {
//   return async (dispatch) => {
//     try {
//       const code = await spotifyLogin()
//       // const res = await loginHelper(code)
//       // console.log(res)
//       // dispatch(setSpotifyCode(code))
//       // dispatch(setAccessToken(res.access_token))
//       // dispatch(setRefreshToken(res.refresh_token))
//     } catch (err) {
//       console.error(err)
//     }
//   }
// }

export const getNewAccessToken = (refreshToken) => {
  return async (dispatch) => {
    try {
      const newToken = await getNewToken(refreshToken)
      dispatch(setAccessToken(newToken))
    } catch (err) {
      console.error(err)
    }
  }
}

export const getUserData = (token) => {
  return async (dispatch) => {
    try {
      const { data } = await getMyData(token)
      dispatch(setUserData(data))
    } catch (err) {
      console.error(err)
    }
  }
}

const initialState = {
  access_token: "",
  refresh_token: "",
  code: "",
  userData: {},
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCESS_TOKEN:
      return { ...state, access_token: action.access_token }
    case SET_REFRESH_TOKEN:
      return { ...state, refresh_token: action.refresh_token }
    case SET_SPOTIFY_CODE:
      return { ...state, code: action.code }
    case SET_USER_DATA:
      return { ...state, userData: action.userData }
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
