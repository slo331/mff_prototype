'use strict';

import $ from 'jquery';
import 'jquery-match-height';
import 'slick-carousel';

export default class Spotlight {
  constructor($selector) {
    let $spotlight = $selector;
    let $spotlightWrap = $('.spotlight-wrap', $spotlight);
    let $spotlightCarousel = $('.spotlight-carousel', $spotlightWrap);
    let $spotlightDots = $('.spotlight-dots', $spotlight);
    let $spotlightArrows = $('.spotlight-arrows', $spotlightWrap);
    let $spotlightItem = $('.spotlight-item', $spotlightWrap);

    let $initCarousel = () => {
      $spotlightCarousel.on('init', (event, slick) => {
        $('.slick-cloned .list-title', $spotlightItem).matchHeight({
          byRow: false
        });

        $('.list-title', $spotlightItem).matchHeight({
          byRow: false
        });
      });

      $spotlightCarousel.slick({
        speed: 800,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: false,
        fade: false,
        draggable: true,
        pauseOnDotsHover: true,
        dots: true,
        arrows: true,
        mobileFirst: false,
        appendDots: $spotlightDots,
        appendArrows: $spotlightArrows,
        prevArrow: $('.prev', $spotlightArrows),
        nextArrow: $('.next', $spotlightArrows),
        responsive: [
          {
            breakpoint: 768,
            settings: {
              infinite: false,
              arrows: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              centerPadding: '40px'
            }
          }
        ]
      });
    }

    $.when($initCarousel());
    // .done(() => {
    //   $('.list-title', $spotlightItem).matchHeight({
    //     byRow: true
    //   });
    // });
  }
}
