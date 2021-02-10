'use strict';

import $ from 'jquery';
import enquire from 'enquire.js';
import 'jquery-match-height';

export default class Tabs {
  constructor() {
    let $tabsNav = $('.tabs__nav');
		let $tabsWrap = $('.tabs__nav--wrap', $tabsNav);
		let $tabsLink = $('.tabs__nav--link', $tabsWrap);
		let $tabsLinkBtn = $('.btn--tabs', $tabsWrap);
		let $tabsContent = $('.tabs__content');
		let $contentWrap = $('.content__wrap', $tabsContent);
		let $selected = $('.tabs__nav--dropdown', $tabsNav);
    let $options = $('.tabs__nav ul', $tabsNav);

    this.$contentWrap = $contentWrap;
    
    $tabsLink.map((i, el) => {
			let $thisTab = $(el);
			let $tabCount = $thisTab.index();
			
			$thisTab.css({
				zIndex: $tabsLink.length - $tabCount
			});
    });
    
    $contentWrap.map((i,el) => {
			let $thisWrap = $(el);
			let $wrapCount = $thisWrap.index();

			if($wrapCount == 0) {
				$thisWrap.addClass('is-active');
				$thisWrap.fadeIn('fast');
			}
    });
    
    $tabsLinkBtn.map((i,el) => {
			let $this = $(el);

			$this.on('click', e => {
				e.preventDefault();

				if(!$this.parent().hasClass('is-active')) {
					$tabsLink.removeClass('is-active');
					$this.parent().addClass('is-active');

					let $dataID = $this.parent().data('link');

					this.hideContent($('.is-active', $tabsContent));
					setTimeout(() => {
						this.showContent($dataID);
					}, 200)
				} else {
					return;
				}
			})
    });
  }

  showContent($object){
		$('#' + $object).addClass('is-active');
		$('#' + $object).fadeIn('fast');
	}

	hideContent($object){
		$object.removeClass('is-active');
		$object.fadeOut('fast');
	}
    
	showOptions($list, $icon){
		$list.addClass('show');
		$icon.addClass('rotate');
	}

	hideOptions($list, $icon){
		$list.removeClass('show');
		$icon.removeClass('rotate');
	}
}
