import React from "react"
import { withRouter } from "react-router-dom"
import { Carousel } from "react-responsive-carousel"
import { connect } from "react-redux"
import { getEpisode } from "../api/spotifyApi"
import { changeQueue } from "../firebase/firebase"
import Typography from "@material-ui/core/Typography"

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
  const carousels = [
    {
      title: "Popular Podcasts",
      data: props.podcasts,
    },
    {
      title: "Podcast Essentials",
      data: props.playlist,
    },
    {
      title: "Your Daily Picks",
      data: props.dailyPodcasts,
    },
  ]

  return (
    <div className="all-carousels">
      {carousels.map((carousel) => (
        <div className="single-carousel">
          {/* <div className="playlist-name">{carousel.title}</div> */}

          <Typography
            color="textSecondary"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {carousel.title}
          </Typography>

          <Carousel autoPlay showThumbs={false} infiniteLoop={true}>
            {carousel.data.map((podcast) => (
              <div onClick={() => onCarouselClick(podcast)}>
                <img alt="" src={podcast.image} />
                <p className="legend">{podcast.name}</p>
              </div>
            ))}
          </Carousel>
        </div>
      ))}
    </div>
  )
}

const mapToProps = (state) => ({
  token: state.access_token,
  userData: state.userData,
})

export default withRouter(connect(mapToProps)(MyCarousel))
