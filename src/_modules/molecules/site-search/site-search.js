'use strict';

export default class SiteSearch {
  constructor() {
    let $siteHeader = $('.site-header');
    let $siteSearch = $('.site-search');
    let $mainSearch = $('.main-search', $siteHeader);
    let $searchWrap = $('.search-wrap', $siteSearch);
    let $searchInput = $('.search__input', $siteHeader);
    let $searchBtnWrap = $('.search-button', $siteSearch);
    let $searchBtn = $('.btn--header-search', $searchBtnWrap);

    this.$siteSearch = $siteSearch;
    this.$searchWrap = $searchWrap;
    this.$input = $('input[type="search"]');
    this.url = this.$searchWrap.data('action');
    this.api = this.$searchWrap.data('api');

    // this.$input.keyup((e) => {
		// 	e.preventDefault ? e.preventDefault() : (e.returnValue = false);

		// 	if (e.keyCode == 13 || e.which == 13) { // enter key maps to keycode `13`
    //     this.submitSearch();
    //   }
    // });

    this.$input.map((i,el) => {
      let $el = $(el);
      $el.on('keyup', e => {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        if (e.keyCode == 13 || e.which == 13) {
          let $val = $el.val();
          this.submitSearch($val);
        }
      });
    });

    $searchBtn.on('click', e => {
      e.preventDefault();
      let $icon = $('.icon', $searchBtn);

      if(!$searchBtn.hasClass('active')) {
        $searchBtn.addClass('active');
        $icon.removeClass('icon-search').addClass('icon-close');
        // $siteSearch.addClass('expanded');
        $.when($mainSearch.addClass('expanded').slideDown('fast'))
        .done(() => {
          this.$input.focus();
        });
      } else {
        $searchBtn.removeClass('active');
        $icon.removeClass('icon-close').addClass('icon-search');
        // $siteSearch.removeClass('expanded');
        $.when($mainSearch.removeClass('expanded').slideUp('fast'))
        .done(() => {
          // $searchInput.val('');
          // $searchInput.blur();
          this.$input.val('');
          this.$input.attr('placeholder', 'Search...');
          this.$input.blur();
          $searchBtn.blur();
        });
      }      
    })
  }

  getQuery(pageURL, value, api) {
    // return pageURL + '?searchQuery=' + encodeURIComponent(value);
    return pageURL + '?q=' + value + '&cx=' + api;
  }

  submitSearch(value) {
    let url = this.getQuery(this.url, value, this.api);

    if(value.length === 0) {
      this.$input.attr('placeholder', 'Error - Please provide keyword for search.');
    } else {
      window.open(url, '_blank');
      this.$input.attr('placeholder', 'Search...');
    }
  }
}
