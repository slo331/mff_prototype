'use strict';

import $ from 'jquery';

export default class Pagination {
  constructor($selector) {

    this.totalPages = 1;
    this.page = 1;

    this.$list = $selector;
  }

  update(page, totalPages, callback) {
    this.totalPages = totalPages;
    this.page = page;

    this._render(callback);
  }

  _render(callback = () => {}) {
    let totalPages = this.totalPages;
    let page = parseInt(this.page);

    if (totalPages < 2) {
      this.$list.html('');
      return;
    }

    let centerPadding = 2;
    let paginationSize = centerPadding * 2 + 1;
    let _html = '';
    if (page > 1) {
      _html += `
      <li class="arrows pagination-prev">
        <a href="#", title="Go to page ${ page - 1 }" data-page="${ page - 1 }"><i class="icon icon-arrow-left"></i></a>
      </li>
      `;
    }

    _html += `
    <li class="${ (page == 1) ? 'active' : ''}">
      <a href="#" title="Go to page 1" data-page="1">1</a>
    </li>
    `;

    let start = (page - centerPadding >= 2) ? page - centerPadding : 2;
    let end = (page + centerPadding >= totalPages - 1) ? totalPages - 1 : page + centerPadding;

    if (page - centerPadding > 2 && start > 2) {
      _html += `
      <li class="pagination-ellipsis">
        <span>...</span>
      </li>
      `;
    }

    let i = start;
    while (i <= end) {
      _html += `
      <li class="${ (i == page) ? 'active' : ''}">
        <a href="#" title="Go to page ${i}" data-page="${i}">${i}</a>
      </li>
      `;
      i++;
    }

    if (page + centerPadding < totalPages - 1 && end < totalPages - 1) {
      _html += `
      <li class="pagination-ellipsis">
        <span>...</span>
      </li>
      `
    }

    _html += `
    <li class="${ (page == totalPages) ? 'active' : ''}">
      <a href="#" title="Go to page ${ totalPages }" data-page="${ totalPages }">${ totalPages }</a>
    </li>
    `;

    if (page < totalPages) {
      _html += `
      <li class="arrows pagination-next">
        <a href="#" title="Go to page ${ page + 1 }" data-page="${ page + 1 }"><i class="icon icon-arrow-right"></i></a>
      </li>
      `;
    }

    this.$list.html(_html);

    callback();
  }
}
