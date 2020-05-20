import React from "react"
import { Carousel } from "react-responsive-carousel"

const MyCarousel = (props) => {
  //console.log(props)
  return (
    <Carousel autoPlay showThumbs={false} infiniteLoop={true}>
      {props.podcasts.map((podcast) => (
        <div class="carousel-img-big">
          <img alt="" src={podcast.image} />
          <p className="legend">{podcast.name}</p>
        </div>
      ))}
    </Carousel>
  )
}

export default MyCarousel
