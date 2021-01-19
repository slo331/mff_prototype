'use strict';

import $ from 'jquery';

export default class ScrollTop {
  constructor() {
    let $scrollTopWrap = $('.scroll-top');
    let $backToTop = $('.btn--scrolltop', $scrollTopWrap);

		$backToTop.on('click', e => {
			e.preventDefault();
			$('html, body').animate({scrollTop: 0}, 600);
		});
  }
}
