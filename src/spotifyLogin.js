import axios from "axios"
import queryString from "querystring"

const redirectUri = "http://localhost:3000"
const clientId = "5831023fb4004d61a610f092f1e612b4"
const clientSecret = "a0174569adec4c988e845ace473ae66a"

export const spotfityLogin = (setToken, setRefreshToken) => {
  const code = new URLSearchParams(window.location.search).get("code")
  if (code !== null) {
    const accessForm = queryString.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    })
    // base64 encode auth data
    const auth = btoa(`${clientId}:${clientSecret}`)
    axios
      .post("https://accounts.spotify.com/api/token", accessForm, {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: `Basic ${auth}`,
        },
      })
      .then((res) => {
        console.log(res)
        // removes 'code' query param to clean up URL
        window.history.replaceState(null, null, window.location.pathname)
        setToken(res.data.access_token)
        setRefreshToken(res.data.refresh_token)
      })
      .catch((err) => console.log(err))
  }
}

export const getNewToken = (setToken, refreshToken) => {
  const accessForm = queryString.stringify({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  })
  const auth = btoa(`${clientId}:${clientSecret}`)
  axios
    .post("https://accounts.spotify.com/api/token", accessForm, {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Basic ${auth}`,
      },
    })
    .then((res) => {
      console.log(res)
      setToken(res.data.access_token)
    })
}

export const getMyData = (token, setMySpotifyData) => {
  if (token) {
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
      .then((data) => setMySpotifyData(data))
  }
}
