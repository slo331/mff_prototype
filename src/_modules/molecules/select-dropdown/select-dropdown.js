'use strict';

export default class SelectDropdown {
  constructor($selector) {
    this.$selector = $selector;
    let $selectDropdown = $('.select-dropdown', $selector);

    $selectDropdown.map((i,el) => {
			let $thisGrp = $(el);
			let $select = $('select', $thisGrp);
			let $selecCount = $thisGrp.index();

			// this.createCustomDropdown($select, $selecCount);
			this.createCustomDropdown($select);
    });
    
    // Open/close
		$(document).on('click', '.dropdown-select', function (event) {
			if($(event.target).hasClass('dd-searchbox')){
				return;
			}

			if(!$(event.target).hasClass('locked')) {
				$('.dropdown-select').not($(this)).removeClass('open');
        $(this).toggleClass('open');
        
				if($(this).hasClass('open')) {
					$(this).find('.option').attr('tabindex', 0);
          $(this).find('.selected').focus();
          $(this).find('.list').slideDown('slow');
          $(this).find('.icon-arrow-down').addClass('rotate');
				} else {
					$(this).find('.option').removeAttr('tabindex');
          $(this).focus();
          $(this).find('.list').slideUp('slow');
          $(this).find('.icon-arrow-down').removeClass('rotate');
				}	
			}
    });
    
    // Close when clicking outside
		$(document).on('click', function (event) {
			if ($(event.target).closest('.dropdown-select').length === 0) {
				$('.dropdown-select').removeClass('open');
        $('.dropdown-select .option').removeAttr('tabindex');
        $('.dropdown-select').find('.list').slideUp('slow');
        $('.dropdown-select').find('.icon-arrow-down').removeClass('rotate');
			}
			event.stopPropagation();
    });
    
    // Option click
		$(document).on('click', '.dropdown-select .option', function (event) {
			$(this).closest('.list').find('.selected').removeClass('selected');
			$(this).addClass('selected');
			var text = $(this).data('display-text') || $(this).text();
			$(this).closest('.dropdown-select').find('.current').text(text);
      $(this).closest('.dropdown-select').prev('.custom-select').val($(this).data('value')).trigger('change');

      // console.log($(this).closest('.dropdown-select').prev('.custom-select').val($(this).data('value')).trigger('change'));
		});
  }

  createCustomDropdown($select) {
		let $parent = $select.parent();
		let $selectID = $select.attr('id');
		let $customSelect;
		if(!$parent.find('.dropdown-select').length) {
			$customSelect = `<div id="dropdown_${$selectID}" class="dropdown-select wide ${$select.attr('class')}" tabindex="0"><div class="selected-option"><span class="current"></span><i class="icon icon-arrow-down"></i></div><div id="select_${$selectID}" class="list"><ul></ul></div></div>`
			$select.after($customSelect);
			var dropdown = $select.next();
			var options = $select.find('option');
			var selected = $select.find('option:selected');
			dropdown.find('.current').html(selected.data('display-text') || selected.text());
			options.map((j, o) => {
				var display = $(o).data('display-text') || '';
				dropdown.find('ul').append('<li class="option' + ($(o).is(':selected') ? ' selected' : '') + '" data-value="' + $(o).val() + '" data-display-text="' + display + '">' + $(o).text() + '</li>');
      });
		}
	}
}
