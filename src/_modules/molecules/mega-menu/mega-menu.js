'use strict';

import $ from 'jquery';
// import { times } from 'lodash';
import enquire from 'enquire.js';
export default class MegaMenu {
  constructor(config) {
    this.config = config;
    let $siteNav = $('.nav-links');
    let $siteNavLink = $('.links', $siteNav);
    let $siteNavItems = $('.links-item', $siteNavLink);
    this.$siteNavItems = $siteNavItems;

    let $megaMenu = $('.mega-menu');
    let $megaMenuContents = $('.mega-menu__content', $megaMenu);

    this.$megaMenu = $megaMenu;
    this.$megaMenuContents = $megaMenuContents;
   
    let hoverTimeout, megaMenuLeaveTimeout;

    enquire.register(`screen and (min-width: ${this.config.breakpoints.desktop}px)`, {
			match: () => {
        $siteNavItems.map((i, ele) => {
          let $this = $(ele);
          let target = $this.data('menu');
    
          $this.on('mouseenter', () => {
            if ($('#' + target).length) {
              hoverTimeout = setTimeout(() => {
                $siteNavItems.removeClass('active');
                $this.addClass('active');
                this.openMegaMenu(target);  
              }, 200);
            } else {
              this.closeMegaMenu();
            }
          });
        });
    
        $siteNavItems.on('mouseleave', e => {
          clearTimeout(hoverTimeout);
        });
    
        $megaMenuContents.map((i, ele) => {
          let $this = $(ele);
          // let $nav = $('.mega-menu__nav', $this);
          // let $navLinks = $('li', $nav);
    
    
          $this.on('mouseenter', e => {
            clearTimeout(megaMenuLeaveTimeout);
          });
    
          $this.on('mouseleave', e => {
            megaMenuLeaveTimeout = setTimeout(() => {
              this.closeMegaMenu();
            }, 200);
          });
        });
			}
		});
  }

  openMegaMenu(target) {
    this.$megaMenu.addClass('expanded');
    this.$megaMenuContents.removeClass('active');
    
    $('#' + target).addClass('active');
    $('#' + target).fadeIn('slow');
  }

  closeMegaMenu() {
    this.$siteNavItems.removeClass('active');
    this.$megaMenu.removeClass('expanded');
    this.$megaMenuContents.removeClass('active');
  }
}
