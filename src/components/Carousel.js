import React from "react"
import { Carousel } from "react-responsive-carousel"

const MyCarousel = (props) => {
  console.log(props)
  return (
    <div class="all-carousels">
      <div class="single-carousel">
        <div class="playlist-name">Top podcasts</div>
        <Carousel autoPlay showThumbs={false} infiniteLoop={true}>
          {props.podcasts.map((podcast) => (
            <div>
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
            <div>
              <img alt="" src={podcast.image} />
              <p className="legend">{podcast.name}</p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}

export default MyCarousel
