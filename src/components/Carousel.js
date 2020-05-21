import React from "react"
import { withRouter } from "react-router-dom"
import { Carousel } from "react-responsive-carousel"
import { connect } from "react-redux"
import { getEpisode } from "../api/spotifyApi"
import { changeQueue } from "../firebase/firebase"

const MyCarousel = (props) => {
  const onCarouselClick = async (podcast) => {
    getEpisode(podcast.id, props.token).then((res) =>
      changeQueue(
        props.match.params.roomId,
        res,
        podcast.id,
        props.userData.display_name
      )
    )
  }

  return (
    <div class="all-carousels">
      <div class="single-carousel">
        <div class="playlist-name">Top podcasts</div>
        <Carousel autoPlay showThumbs={false} infiniteLoop={true}>
          {props.podcasts.map((podcast) => (
            <div onClick={() => onCarouselClick(podcast)}>
              <img alt="" src={podcast.image} />
              <p className="legend">{podcast.name}</p>
            </div>
          ))}
        </Carousel>
      </div>

      <div class="single-carousel">
        <div class="playlist-name">Selected podcasts</div>
        <Carousel autoPlay showThumbs={false} infiniteLoop={true}>
          {props.playlist.map((podcast) => (
            <div onClick={() => onCarouselClick(podcast)}>
              <img alt="" src={podcast.image} />
              <p className="legend">{podcast.name}</p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}

const mapToProps = (state) => ({
  token: state.access_token,
  userData: state.userData,
})

export default withRouter(connect(mapToProps)(MyCarousel))
