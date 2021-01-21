'use strict';

import $ from 'jquery';
import MultiFilter from '../../molecules/multi-filter/multi-filter';
import SelectDropdown from '../../molecules/select-dropdown/select-dropdown';

export default class ListFilter {
  constructor() {
    let $filter = $('.filter');
    let $filterWrap = $('.filter-wrap', $filter);
    let $categoryFilter = $('.category-filter', $filterWrap);
    let $sortFilter = $('.sortby-filter', $filterWrap);

    this.$catFilter = new MultiFilter($categoryFilter);
    new SelectDropdown();
  }
}
