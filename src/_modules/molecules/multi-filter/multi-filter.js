'use strict';

import $ from 'jquery';

export default class MultiFilter {
  constructor($selector, config) {
		this.$selector = $selector;
		let $filterControl = $('.filter-control', $selector);
    let $filterOptions = $('.filter-options', $selector);
    let $iconArrow = $('.icon-arrow-down', $filterControl);
    let $options = $('li', $filterOptions);
		let $allCheckbox = $('.all-checkbox', $filterOptions);
		let $allOption = $('.all-checkbox__wrap', $allCheckbox);

		this.$options = $options;

		this.$allOption = $allOption;

    this.optionsShown = false;
    
    this.$label = $('p', $filterControl);
    this.$input = $('input', $filterControl);
    
    this.$filterOptions = $filterOptions;
    this.$iconArrow = $iconArrow;

		$filterControl.find('.filter-control__text').on('click', e => {
      if (this.$selector.hasClass('options-shown')) {
				this._hideOptions();
			} else {
				// $('.multi-filter').removeClass('options-shown');
				this._showOptions();
			}
		});

		$(document).on('click', e => {
			let $eTarget = $(e.target);
			if (!($eTarget.hasClass('multi-filter') || $eTarget.parents('.multi-filter').length)) {
				this._hideOptions();
			}
		});

		if (config && config.autocomplete) {
			// Autocomplete function
			let $autoComplete = $('.autocomplete', $selector);

			let keydownTimeout;

			$autoComplete.on('keydown', e => {
				clearTimeout(keydownTimeout);

				keydownTimeout = setTimeout(() => {
					if ($autoComplete.val().length >= 3) {
						let query = $autoComplete.val().toLowerCase();

						$options.filter((i, ele) => {
							let label = $(ele).find('label').text().toLowerCase();
							return label.indexOf(query) < 0;
						}).hide();
					} else {
						$options.show();
					}
				}, 100);
			});
		}

		let checkingTimeout;

		$options.map((i, ele) => {
			let $this = $(ele);
			let $label = $('label', $this);
			let $input = $('input', $this);
			
      // $input.prop('checked', true);
      
      $input.on('change', e => {
				let $optTarget = $(e.target);
				let $parent = $optTarget.parents('ul');
				let $sibling = $parent.siblings('.all-checkbox');
				let $chckBox = $sibling.find('.all-checkbox__wrap').children('.all-check');

				clearTimeout(checkingTimeout);

				checkingTimeout = setTimeout(() => {	
					// if(!$optTarget.is(":checked")){
					// 	$chckBox.prop('checked', false);
					// }				 
					
          this._updateLabel();
          this._hideOptions();
				}, 150);
			});
		});

		$('.all-check').map((i, ele) => {
			let $thisAll = $(ele);
			
			$thisAll.on('change', e => {
				let $chckTarget = $(e.target);
				let $parent = $chckTarget.parents('.all-checkbox');
				let $sibling = $parent.siblings('ul');
				let $chckBox = $sibling.find('li').children('input');

				// if($chckTarget.is(":checked")) {
				// 	$chckBox.map((i, ele) => {
				// 		let $thisChck = $(ele);
        //     $thisChck.prop('checked', true);
				// 	})
				// } else {
				// 	$chckBox.map((i, ele) => {
				// 		let $thisChck = $(ele);
        //     $thisChck.prop('checked', false);
				// 	})
        // }
        
        this._updateLabel();
        this._hideOptions();
      });

      // $thisAll.prop('checked', true);
		});
	}

	_updateLabel() {
		let selected = [];
		let noOfOptions = this.$options.length;
    let checkedNo = 0;
    let allCheck = this.$options.parents('ul').siblings('.all-checkbox').children('.all-checkbox__wrap').find('input');

		this.$options.map((j, option) => {
			let $option = $(option);
			let $label = $('label', $option);
			let $input = $('input', $option);

			if ($input.is(':checked')) {
				selected.push($label.text());
				checkedNo++;
			}
		});

		let selectedString = selected.join(', ');

		// if (checkedNo === noOfOptions || checkedNo === 0) {
		if (checkedNo === noOfOptions) {
            selectedString = 'All';
            allCheck.prop('checked', true);
		} else {
			if (checkedNo === 0) {
				selectedString = 'No Selection';
			}
		}
    // this.filterControl.update(selectedString);
    
    let update = (value, array) => {
      this.$label.text(value);
      this.$input.val(array);
    }

    update(selectedString);
	}
	
	_resetLabel() {
    // this.filterControl.update('All');
    let update = (value, array) => {
      this.$label.text(value);
      this.$input.val(array);
    }

    update('All');
	}

	_showOptions() {
    let $showOpt = () => {
      $('.multi-filter').removeClass('options-shown');
      $('.multi-filter').find('.filter-options').slideUp('slow');
      this.$selector.addClass('options-shown');
		  this.optionsShown = true;
    }
    
    $.when($showOpt())
    .done(() => {
      this.$iconArrow.addClass('rotate');
      this.$filterOptions.slideDown('slow');
    })
	}

	_hideOptions() {
    let $hideOpt = () => {
      this.$selector.removeClass('options-shown');
		  this.optionsShown = false;
    }
    
    $.when($hideOpt())
    .done(() => {
      this.$iconArrow.removeClass('rotate');
      this.$filterOptions.slideUp('slow');
    })
	}
}
