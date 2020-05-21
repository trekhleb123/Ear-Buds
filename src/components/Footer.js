import React from "react"
import { Twitter, Facebook, Mail} from "react-social-sharing"


const Footer = (props) => {

  return (
    <div className="footer">
    <div>Share on social media</div>
      <Twitter simple message={`Come listen a podcast with me! Enter room code ${props.roomCode}`} link="https://podcastparty-402e2.web.app"  />
      <Facebook simple link="https://podcastparty-402e2.web.app"/>
      <Mail simple subject="Group podcast listening" body={`Come listen a podcast with me at https://podcastparty-402e2.web.app! Enter room code ${props.roomCode}`}/>
    </div>
  )
}

export default Footer
