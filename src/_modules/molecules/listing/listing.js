'use strict';

import $ from 'jquery';
import dot from 'dot';
import enquire from 'enquire.js';
import 'jquery-match-height';
import moment from 'moment';
import ListFilter from "../../molecules/list-filter/list-filter";
import Pagination from "../../molecules/pagination/pagination";
import ListingBase from '../../../_scripts/listingBase.js';

export default class Listing extends ListingBase {
  constructor($selector, config) {
    super();

    let $listing = $selector;
    let $listWrap = $('.listing-wrap', $listing);
    let $list = $('.list', $listWrap);
    let $container = $('.row', $list);
    let $pagination = $('.pagination-wrap', $listing);

    this.config = config;
    this.listFilter = new ListFilter();
    this.pagination = new Pagination($pagination);

    /* 1. Setup basic config */
    this.template = $listing.siblings('script[type="text/x-dot-template"]').html();
    this.endpoint = $listWrap.data('endpoint');

    // Get all fields
    this.allFields = this.getAllFields($listing);

    // Generate parameters using fields
    this.parameters = this.getParameters(this.allFields);

    /* 2. Setup the listener (the following is available in the ListingBase, can reuse) */
    this.setupListeners(this.allFields);

    // let $filterOpt = $('.filter-options', $selector);
    
    // $filterOpt.map((i,el) => {
    //   let $el = $(el);
    //   let $checkBox = $('.checkbox', $el);
    //   let $dropDown = $('select', $el);

    //   $checkBox.map((i,el) => {
    //     let $thisCB = $(el);
  
    //     $thisCB.on('click', e => {
    //       // this.parameters = this.getParameters(this.allFields);
  
    //       this.getUrlQueries();
    //       this.getData();
    //       this.updateURL();

    //       console.log(this.parameters);
    //     });
    //   });
    // });

    this.totalPages = 1;
    this.setupPagination('page');

    /* 3. Define the callback functions */
    this.beforeGetData = () => {
      // e.g. Can show loading gif here
    };

    this.getDataCallback = (res) => {
      // e.g. Hide loading gif
      /* 4. Call this function to render the template into the DOM.
          Define {$container} where you want to insert DOM.
      */
      let $render = () => {
        this.renderTemplate(res, $container);
        this._timeFormat();
      }

      $.when($render())
      .done(() => {
        $('.list-content').matchHeight({
          byRow: false
        });

        // Partners Func
        let $partnersItem = $('.partners-item');
        let $partnersWrap = $('.partners-wrap', $partnersItem);
        let $partnerLogo = $('.partners-logo', $partnersWrap);
        let $btnClose = $('.btn--close', $partnersItem);

        $btnClose.map((i,el) => {
          let $el = $(el);
          let $parent = $el.parents('.partners-item');
          let $content = $('.partners-content', $parent);
          let $wrap = $('.partners-wrap', $parent);

          $el.on('click', e => {
            e.preventDefault();
            $content.slideUp('fast').removeClass('expanded');
            // $wrap.removeAttr('style');
            $('.partners-wrap').removeAttr('style');
          })
        })

        $partnerLogo.map((i,el) => {
          let $el = $(el);
          let $grandparent = $el.parents('.partners-item');
          let $parent = $el.parent('.partners-wrap');

          $el.on('click', e => {
            // let $content = $('.partners-content', $el);
            let $content = $el.siblings('.partners-content');
            let $wrap = $('.partners-content__wrap', $content);

            if(!$content.hasClass('expanded')) {
              enquire.register(`screen and (max-width: ${this.config.breakpoints.tablet - 1}px)`, {
                match: () => {
                  if($grandparent.data('index') % 2 === 1) {
                    let $clear = () => {
                      $('.partners-content').removeClass('expanded').slideUp('fast');
                      $('.partners-wrap').removeAttr('style');
                    }
                    
                    let $show = () => {
                      $content.slideDown('fast').addClass('expanded');
                    }
      
                    $.when($clear())
                    .done(() => {
                      setTimeout(() => {
                        $show();
                      }, 300);
                    })
                    .done(() => {
                      setTimeout(() => {
                        console.log($wrap.outerHeight());

                        $grandparent.next('.partners-item').find('.partners-wrap').css({
                          paddingBottom: $wrap.outerHeight()
                        });  
      
                        $parent.css({
                          paddingBottom: $wrap.outerHeight()
                        });

                        $('html, body').animate({
                          // scrollTop: $('header').offset().top
                          scrollTop: $el.offset().top
                        }, 400);
                      }, 300);
                    });
                  } else {
                    let $clear = () => {
                      $('.partners-content').removeClass('expanded').slideUp('fast');
                      $('.partners-wrap').removeAttr('style');
                    }
                    
                    let $show = () => {
                      $content.slideDown('fast').addClass('expanded');
                    }
      
                    $.when($clear())
                    .done(() => {
                      setTimeout(() => {
                        $show();
                      }, 300);
                    })
                    .done(() => {
                      setTimeout(() => {
                        console.log($wrap.outerHeight());

                        $parent.css({
                          paddingBottom: $wrap.outerHeight()
                        });

                        $('html, body').animate({
                          // scrollTop: $('header').offset().top
                          scrollTop: $el.offset().top
                        }, 400);
                      }, 300);
                    });
                  }
                },
                unmatch: () => {
                  $('.partners-content').slideUp('fast').removeClass('expanded')
                  $('.partners-wrap').removeAttr('style');
                }
              });

              enquire.register(`screen and (min-width: ${this.config.breakpoints.tablet}px)`, {
                match: () => {
                  let $clear = () => {
                    $('.partners-content').removeClass('expanded').slideUp('fast');
                    $('.partners-wrap').removeAttr('style');
                  }
                  
                  let $show = () => {
                    $content.slideDown('fast').addClass('expanded');
                  }
    
                  $.when($clear())
                  .done(() => {
                    setTimeout(() => {
                      $show();
                    }, 300);
                  })
                  .done(() => {
                    setTimeout(() => {
                      console.log($wrap.outerHeight());
    
                      $parent.css({
                        paddingBottom: $wrap.outerHeight()
                      });
                    }, 300);
                  });
                },
                unmatch: () => {
                  $('.partners-content').slideUp('fast').removeClass('expanded')
                  $('.partners-wrap').removeAttr('style');
                }
              });

              

              

              // let $slideUp = () => {
              //   $('.partners-wrap').removeAttr('style');
              //   $('.partners-content').removeClass('expanded').slideUp('slow');
              // }

              // let $slideDown = () => {
              //   $content.slideDown('slow').addClass('expanded');
              //   $el.css({
              //     paddingBottom: $wrap.outerHeight()
              //   });
              // }

              // $.when($slideUp())
              // .done(() => {
              //   $slideDown();
              // });
            }
          });
        });

        this.totalPages = res.noOfPages;
        this.reInitPagination('page', this.pagination, $pagination, this.parameters.page, this.totalPages);
      });
    };

    /* 5. Define callback for window history */
    window.onpopstate = (e) => {
      for (let key in e.state) {
        this.parameters[key] = e.state[key];
      }

      this.updateViews(this.allFields);

      // if ($(".search-tabs", $selector).length)
      // this.updateDropdown($(".search-tabs", $selector));

      this.reInitPagination('page', this.pagination, $pagination, this.parameters.page, this.totalPages);
      
      this.getData();
    };

    /* 6. Call first load */
    this.getData();
    this.updateURL();

    this.setSessionStorage(this.parameters);
  }

  setSessionStorage(value) {
    sessionStorage.setItem("list", JSON.stringify(value));
  }

  _timeFormat() {
		// Format Timestamp
		if($('.date').length) {
			let $timestamp = $('.date');

			$timestamp.map((i,el) => {
				let $thisTime = $(el);
				let $timeVal = $thisTime.data('time');
				let $date = moment($timeVal, "YYYY-MM-DD kk:mm:ss.SSS").format("DD MMMM YYYY");

        if($timeVal != '') {
          $thisTime.text($date);
        }
			});
		}
	}
}
