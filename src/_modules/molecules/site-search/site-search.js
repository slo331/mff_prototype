'use strict';

export default class SiteSearch {
  constructor() {
    let $siteSearch = $('.site-search');
    let $searchWrap = $('.search-wrap', $siteSearch);
    let $searchInput = $('.search__input', $searchWrap);
    let $searchBtnWrap = $('.search-button', $siteSearch);
    let $searchBtn = $('.btn--header-search', $searchBtnWrap);

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
}
