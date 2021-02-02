'use strict';

import $ from 'jquery';
import enquire from 'enquire.js';

export default class SiteNav {
  constructor(config) {
    this.config = config;
    let $navLinks = $('.nav-links');
    let $linkWrap = $('.links', $navLinks);
    let $lvl1 = $('.links-item', $linkWrap);

    // Mobile menu
    let $header = $('.header-wrap');
    // let $siteSearch = $('.site-search', $header);
    let $navWrap = $('.nav-wrap');
    let $navMobile = $('.nav-mobile', $navWrap);
    let $overlay = $('.menu-overlay');
    let $navMenu = $('.nav-menu', $navMobile);
    let $mobileMenu = $('.hamburger-menu', $navMenu);
    let $mobileChildBtn = $('.btn--mobileSub', $navLinks);
    let $mobileSubChildBtn = $('.btn--mobileSubchild', $navLinks);

    enquire.register(`screen and (max-width: ${this.config.breakpoints.desktop - 1}px)`, {
			match: () => {
        $mobileMenu.on('click', () => {
          
          if(!$navLinks.hasClass('expanded')) {
            let $showMenu = () => {
              $mobileMenu.addClass('active');
              $navLinks.addClass('expanded');
              $overlay.fadeIn('slow');
              $navLinks.slideDown('slow');
            }
            
            $.when($showMenu())
            .done(() => {
              $mobileMenu.addClass('rotate');
							$navWrap.addClass('expanded');
            })
            .done(() => {
              $('body').addClass('fixed');
            });
          } else {
            let $closeMenu = () => {
              $('body').removeClass('fixed');
              $mobileMenu.removeClass('rotate');
            }

            $.when($closeMenu())
            .done(() => {
              $navWrap.removeClass('expanded');
            })
            .done(() => {
              $mobileMenu.removeClass('active');
              $navLinks.removeClass('expanded');
              $navLinks.slideUp('slow');
            })
            .done(() => {
              $overlay.removeClass('active').fadeOut('slow');
            });
          }
        });

        $mobileChildBtn.map((i,el) => {
          let $el = $(el);
          let $gparent = $el.parents('.links-item');
          let $parent = $el.parent('.item__parent');
          let $sibling = $parent.siblings('.item__sub');

          $el.on('click', e => {
            e.preventDefault();
            if(!$sibling.hasClass('expanded')) {
              $parent.addClass('active');
              $sibling.addClass('expanded')
              $sibling.slideDown('slow');
              $el.addClass('rotate');
            } else {
              $el.removeClass('rotate');
              $sibling.removeClass('expanded')
              $sibling.slideUp('slow');
              $parent.removeClass('active');
            }
          });
        });

        $mobileSubChildBtn.map((i,el) => {
          let $el = $(el);
          let $gparent = $el.parents('.sublinks-item');
          let $parent = $el.parent('.item__child');
          let $sibling = $parent.siblings('.item__subchild');

          $el.on('click', e => {
            e.preventDefault();
            if(!$sibling.hasClass('expanded')) {
              $parent.addClass('active');
              $sibling.addClass('expanded')
              $sibling.slideDown('slow');
              $el.addClass('rotate');
            } else {
              $el.removeClass('rotate');
              $sibling.removeClass('expanded')
              $sibling.slideUp('slow');
              $parent.removeClass('active');
            }
          });
        });
			}
		});
  }
}
