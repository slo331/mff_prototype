'use strict';

export default class SiteSearch {
  constructor() {
    let $siteSearch = $('.site-search');
    let $searchWrap = $('.search-wrap', $siteSearch);
    let $searchInput = $('.search__input', $searchWrap);
    let $searchBtnWrap = $('.search-button', $siteSearch);
    let $searchBtn = $('.btn--header-search', $searchBtnWrap);

    this.$siteSearch = $siteSearch;
    this.$searchWrap = $searchWrap;
    this.$input = $('input[type="search"]', this.$searchbar);
    this.url = this.$searchWrap.data('action');

    this.$input.keyup((e) => {
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);

			if (e.keyCode == 13 || e.which == 13) { // enter key maps to keycode `13`
        this.submitSearch();
      }
    });

    $searchBtn.on('click', e => {
      e.preventDefault();
      let $icon = $('.icon', $searchBtn);

      if(!$searchBtn.hasClass('active')) {
        $searchBtn.addClass('active');
        $icon.removeClass('icon-search').addClass('icon-close');
        $siteSearch.addClass('expanded');
        $searchInput.focus();
      } else {
        $searchBtn.removeClass('active');
        $icon.removeClass('icon-close').addClass('icon-search');
        $siteSearch.removeClass('expanded');
        $searchInput.val('');
        $searchInput.blur();
      }      
    })
  }

  submit() {
    let name = this.$input.attr('name');
    let value = this.$input.val();
    if (value.trim(' ').length == 0) {
      if (!this.$siteSearch.find('.error-msg').length) {
        this.$input.after('<p class="error-msg">Please enter a keyword to search.</p>')
      }
    } else {
      this.$siteSearch.find('.error-msg').remove();
      window.location.href = `${this.action}?${name}=${encodeURIComponent(value)}`;
    }
  }

  getQuery(pageURL, value) {
    return pageURL + '?searchQuery=' + encodeURIComponent(value);
  }

  submitSearch() {
    let searchValue = this.$input.val();

    window.location.href = this.getQuery(this.url, searchValue);
  }
}
