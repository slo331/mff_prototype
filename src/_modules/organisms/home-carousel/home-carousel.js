'use strict';

import $ from 'jquery';
import 'slick-carousel';

export default class HomeCarousel {
  constructor() {
    let $carouselHome = $('.carousel-home');
    let $carousel = $('.carousel-wrap', $carouselHome);
    let $autoPlay = $carouselHome.data('auto');
    let $speed = $carouselHome.data('speed');

    $carousel.slick({
      speed: 800,
      infinite: true,
      autoplay: $autoPlay,
      autoplaySpeed: $speed,
      fade: false,
      draggable: true,
      pauseOnDotsHover: true,
      dots: true,
      arrows: true,
      mobileFirst: true,
      appendDots: $('.carousel-dots'),
      appendArrows: $('.carousel-arrows'),
      prevArrow: $('.carousel-arrows .prev'),
      nextArrow: $('.carousel-arrows .next')
    });
  }
}
