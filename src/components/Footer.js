import React from "react"
import { Twitter, Facebook, Mail } from "react-social-sharing"

const Footer = (props) => {
  return (
    <div className="footer">
      <div className="social-media-text">Share on social media</div>
      <div className="footer-content">
        <div style={{ fontSize: "x-large" }}>
          <Twitter
            simple
            message={`Come listen a podcast with me! Enter room code ${props.roomCode}`}
            link="https://podcastparty-402e2.web.app"
          />
        </div>
        <div style={{ fontSize: "x-large" }}>
          <Facebook simple link="https://podcastparty-402e2.web.app" />
        </div>
        <div style={{ fontSize: "x-large" }}>
          <Mail
            simple
            subject="Group podcast listening"
            body={`Come listen a podcast with me at https://podcastparty-402e2.web.app! Enter room code ${props.roomCode}`}
          />
        </div>
      </div>
    </div>
  )
}

export default Footer
