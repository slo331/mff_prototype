'use strict';

import $ from 'jquery';
import dot from 'dot';
// import Cookies from 'js-cookie';
// import SaveCourse from "../../molecules/save-course/save-course";
// import Card from "../../atoms/card/card";

export default class ListingBase {
  constructor() {

    this.template = `
    {{?it.length}}
      {{~it :item:index}}
        <li>
          <a href="{{=item.url}}">{{=item.name}}</a>
        </li>
      {{~}}
    {{??}}
      <li>No data.</li>
    {{?}}
    `;

    this.endpoint = '/apis/endpoint';

    this.parameters = {
      "page": 1
    };

    this.queries = this.getUrlQueries();

    this.beforeGetData = () => {
      console.log('Before calling AJAX');
    };

    this.getDataCallback = res => {
      console.log('Response from AJAX', res);
    };
  }

  getData(before = this.beforeGetData, cb = this.getDataCallback) {
    before();

    $.ajax({
      url: this.endpoint,
      method: 'GET',
      data: this.parameters,
      success: (res) => {
        cb(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  //Start: for bookmark button
  loadCookie(list, cookie){
		cookie = Cookies.get('savedCoursesCookie');

		//load cookie and set active
		if(cookie){
			list = this.parseCookie(cookie);
		}
		else {
			// if cookie not found
			list = [];
		}

		return list;
	}

	setButtonStates(list, $class){

		if($('.save-course').length){
			for(let i = 0; i < list.length; i++){
				let courseID = list[i].id;
				$class.setSaveState($('#'+ courseID).siblings('.save-course'));
			}
		}
	}

	parseCookie(cookie){
		return JSON.parse(cookie);
  }

  sortList(list){
		let mergeSort = (list) => {
			if(list.length < 2){
				return list;
			}

			let middle = Math.floor(list.length / 2);
			let left = list.slice(0, middle);
			let right = list.slice(middle);

			return merge(mergeSort(left), mergeSort(right));
		}

		let merge = (left, right) => {
			let result = [];

			while (left.length && right.length){
				if(left[0].name <= right[0].name){
					result.push(left.shift());
				}
				else {
					result.push(right.shift());
				}
			}

			return result.concat(left.slice()).concat(right.slice());
		}

		return mergeSort(list);
	}
  //End: for bookmark button

  renderTemplate(data, $container, toAppend = false) {
    let dotTemplate = dot.template(this.template)(data);

    if (toAppend) {
      $container.append(dotTemplate);
    } else {
      $.when($container.empty())
      .done(() => {
        // setTimeout(() => {
        //   $container.html(dotTemplate);
        // }, 1000);
        $container.html(dotTemplate);
      });
    }
  }

  getUrlQueries() {
    let queryString = {};
    let query = window.location.search.substring(1);
    if (!query.length) {
      return queryString;
    }
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");

      /* If first entry with this name */
      if (typeof queryString[pair[0]] === "undefined") {
        queryString[pair[0]] = decodeURIComponent(pair[1]);

        /* If second entry with this name */
      } else if (typeof queryString[pair[0]] === "string") {
        let arr = [ queryString[pair[0]], decodeURIComponent(pair[1])];
        queryString[pair[0]] = arr;

        /* If third or later entry with this name */
      } else {
        queryString[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return queryString;
  }

  updateURL(replaceState = false) {
    let queryString = '?';

    let i = 0;
    for (let param in this.parameters) {
      if (i > 0) {
        queryString += '&';
      }

      queryString += param + '=' + encodeURIComponent(this.parameters[param]);
      i++;
    }

    for (let query in this.queries) {
      if (typeof(this.parameters[query]) == 'undefined') {
        if (i > 0) {
          queryString += '&';
        }

        queryString += query + '=' + encodeURIComponent(this.queries[query]);
        i++;
      }
    }

    if (replaceState) {
      window.history.replaceState(this.parameters, '', queryString);
    } else {
      window.history.pushState(this.parameters, '', queryString);
    }
  }

  setupCheckboxes(fieldName) {
    /*
      - used by listing pages which has checkboxes of name="{fieldName}" with "All" options
      - to be called upon page load
      - will set {this.parameters[fieldName]} with the value of {this.queries[fieldName]}
    */

    this.parameters[fieldName] = (this.queries[fieldName]) ? this.queries[fieldName] : 'all';

    this.updateCheckboxView(fieldName);

    this._addCheckboxListener(fieldName);
  }

  updateCheckboxView(fieldName) {
    /*
    - to be called whenever the {fieldName} checkboxes needs to react based on {this.parameters[fieldName]}
    - will set the 'checked' prop for the selected {fieldName} checkboxes based on the {this.parameters[fieldName]}
     */

    if (this.parameters[fieldName] == 'all') {
      $(`input[name="${fieldName}"]`).map((i, ele) => {
        let $this = $(ele);

        if ($this.val() == 'all') {
          // $this.trigger('change');
          $this.prop('checked', true);
        } else {
          $this.prop('checked', false);
        }
      });
    } else {
      let values = this.parameters[fieldName].split('|');
      $(`input[name="${fieldName}"][value="all"]`).prop('checked', false);
      $(`input[name="${fieldName}"]`).map((i, ele) => {
        let $this = $(ele);

        if (values.indexOf($this.val()) !== -1) {
          $this.trigger('change');
          $this.prop('checked', true);
        } else {
          $this.prop('checked', false);
        }
      });
    }
  }

  getCheckboxValues(fieldName) {
    /*
      - will return the piped-value string based on selected checkboxes under input[name="{fieldName}"]
    */
    let values = [];
    $(`input[name="${fieldName}"]`).toArray().map((ele) => {
      let $this = $(ele);

      if ($this.is(':checked')) {
        values.push($this.val());
      }
    });

    return values.join('|');
  }

  _addCheckboxListener(fieldName) {
    /*
      - for checkboxes with "ALL" options only
      - to be called to add event listener to the checkbox of {fieldName}
      - on every change of value (delay of 400ms), this will:
        - update this.parameters[fieldName]
        - uncheck all the other checkboxes when "ALL" is being checked
        - uncheck "ALL" when any of other checkbox is being checked
        - check "ALL" when all other checkboxes are being unchecked
        - always reset this.parameters.page = 1
        - call {this.getData()}
        - call {this.updateURL()}
    */

    $(`input[name="${fieldName}"]`).map((i, ele) => {
      let $this = $(ele);
      $this.on("change", (e) => {
        if ($this.prop("checked") == true) {
          if ($this.val() === "all") {
            /* uncheck all other checkbox when ALL is checked, and hide all subgroups */
            $(`input[name="${fieldName}"]`).prop("checked", false);
            $this.trigger('change');
            $this.prop("checked", true);
          } else {
            $(`input[name="${fieldName}"][value="all"]`).prop("checked", false);
          }

          if ($(`input[name="${fieldName}"]:checked`).length === $(`input[name="${fieldName}"]`).length - 1) {
            $(`input[name="${fieldName}"]`).prop("checked", false);
            $(`input[name="${fieldName}"][value="all"]`).trigger('change');
          }
        } else {
          /* when no checkbox is checked, ALL will be checked automatically */
          if ($(`input[name="${fieldName}"]:checked`).length === 0) {
            $(`input[name="${fieldName}"][value="all"]`).prop("checked", true);
          }
        }
        
        this.parameters = this.getParameters(this.allFields);
        this.parameters.page = 1;
        this.getData();
        this.updateURL();
      });
    });
  }

  setupSearchbar(fieldName) {
    this.parameters[fieldName] = (this.queries[fieldName]) ? this.queries[fieldName] : '';
    this.updateSearchbarView(fieldName);
    this._addSearchbarListener(fieldName);
  }

  updateSearchbarView(fieldName) {
    $(`input[name="${fieldName}"]`).val(this.parameters[fieldName]);
  }

  _addSearchbarListener(fieldName) {
    let inputTimeout;
    let $btnSearch = $(`input[name="${fieldName}"]`).siblings('.btn--search-bar');
    // $(`input[name="${fieldName}"]`).on('input', e => {
    $btnSearch.on('click', e => {
      let $this = $(e.target);
      clearTimeout(inputTimeout);

      inputTimeout = setTimeout(() => {
        // this.parameters[fieldName] = $this.val();
        this.parameters[fieldName] = $(`input[name="${fieldName}"]`).val();
        this.parameters.page = 1;
        this.getData();
        this.updateURL();
      }, 400);
    });

    $(`input[name="${fieldName}"]`).keyup((e) => {
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);

			if (e.keyCode == 13 || e.which == 13) { // enter key maps to keycode `13`
        $btnSearch.trigger('click');
      }
    });
  }

  setupRadioButton(fieldName) {
    this.parameters[fieldName] = (this.queries[fieldName]) ? this.queries[fieldName] : $(`input[name="${fieldName}"][type='radio']:eq(0)`).val();

    this.updateRadioButtonView(fieldName);

    this._addRadioButtonListener(fieldName);
  }

  updateRadioButtonView(fieldName) {
    $(`input[name="${fieldName}"]`).map((i, ele) => {
      let $this = $(ele);
      if ($this.val() == this.parameters[fieldName]) {
        $this.prop('checked', true);
      } else {
        $this.prop('checked', false);
      }
    });
  }

  getRadioButtonValue(fieldName) {
    let value;
    $(`input[name="${fieldName}"]`).map((i, ele) => {
      let $this = $(ele);
      if ($this.prop('checked') == true) {
        value = $this.val();
        return false; // break the loop once value is found
      }
    });

    return value;
  }

  _addRadioButtonListener(fieldName) {
    $(`input[name="${fieldName}"]`).map((i, ele) => {
      let $this = $(ele);
      $this.on("change", (e) => {
        if ($this.prop("checked") == true) {
          this.parameters[fieldName] = $this.val();
        }
        // reset back to page 1
        this.parameters.page = 1;
        this.getData();
        this.updateURL();
      });
    });
  }

  setupPagination(fieldName) {
    this.parameters[fieldName] = (this.queries[fieldName]) ? parseInt(this.queries[fieldName]) : 1;
  }

  reInitPagination(fieldName, pagination, $pagination, currentPage, totalPages) {

    let callback = () => {
      this._addPaginationListener(fieldName, $pagination);
    }

    this.updatePaginationView(pagination, currentPage, totalPages, callback);

    // $('html, body').animate({
    //   // scrollTop: $('header').offset().top
    //   scrollTop: $('.listing').offset().top
    // }, 400);

  }

  _addPaginationListener(fieldName, $pagination) {
    $pagination.find('li').map((i, ele) => {
      let $this = $(ele);
      let $link = $this.find('a');

      $link.on('click', e => {
        e.preventDefault();

        if (!$this.hasClass('disabled')) {
          this.parameters[fieldName] = $link.data('page');

          this.getData();
          this.updateURL();
        }
      });
    });
  }

  updatePaginationView(pagination, currentPage, totalPages, callback) {
    pagination.update(currentPage, totalPages, callback);
  }

  setupListeners(allFields){
    for(let i = 0; i < allFields.length; i++){
      if (allFields[i].type === 'text') this.setupSearchbar(allFields[i].name);
      if (allFields[i].type === 'select') this.setupSort(allFields[i].name);
      if (allFields[i].type === 'checkbox') this.setupCheckboxes(allFields[i].name);
      if (allFields[i].type === 'radio') this.setupRadioButton(allFields[i].name, allFields);
    }
  }

  updateViews(allFields){
    for(let i = 0; i < allFields.length; i++){
      if (allFields[i].type === 'text') this.updateSearchbarView(allFields[i].name);
      if (allFields[i].type === 'select') this.updateSortView(allFields[i].name);
      if (allFields[i].type === 'checkbox') this.updateCheckboxView(allFields[i].name);
      if (allFields[i].type === 'radio') this.updateRadioButtonView(allFields[i].name);
    }
  }

  setupSort(fieldName) {
    this.parameters[fieldName] = (this.queries[fieldName]) ? this.queries[fieldName] : $(`select[name='${fieldName}'] option:eq(0)`).val();

    this.updateSortView(fieldName);
    this._addSortListener(fieldName);
  }

  updateSortView(fieldName) {
    $(`select[name="${fieldName}"]`).val(this.parameters[fieldName]);

    const triggerLabel = $(`select[name="${fieldName}"]`).next().find('.current');
    const triggerOption = $(`select[name="${fieldName}"]`).next().find(`.option[data-value="${ this.parameters[fieldName] }"]`);

    triggerLabel.text($(`select[name="${fieldName}"]`).find(`option[value="${ this.parameters[fieldName] }"]`).text());
    $('.option').removeClass('selected');
    triggerOption.addClass('selected');
  }

  _addSortListener(fieldName) {
    $(`select[name="${fieldName}"]`).on('change', () => {
      this.parameters[fieldName] = $(`select[name="${fieldName}"]`).val();
      this.parameters.page = 1;
      this.getData();
      this.updateURL();
    });
  }

  setupReset($reset, referenceToFields) {
    $reset.on('click', (e) => {
      e.preventDefault();
      this.endpoint = $('.courses-listing').data("endpoint");
      this.handleReset(referenceToFields);
      // this.getData();
      // this.updateURL();
    });
  }

  handleReset(referenceToFields) {
    for (let i = 0; i < referenceToFields.length; i++) {
      if (referenceToFields[i].type === "text") {
        this.parameters[referenceToFields[i].name] = "";
        this.updateSearchbarView(referenceToFields[i].name);
      }

      // Should reset handle sorter?
      if (referenceToFields[i].type === "select") {
        this.parameters[referenceToFields[i].name] = $(`select[name="${referenceToFields[i].name}"] option:eq(0)`).val();
        this.updateSortView(referenceToFields[i].name);
      }

      if (referenceToFields[i].type === "checkbox") {
        this.parameters[referenceToFields[i].name] = "all";
        this.updateCheckboxView(referenceToFields[i].name);
      }

      // Should reset handle radio button? Should work with auto api call instead of having the click filter again
      if (referenceToFields[i].type === "radio") {
        this.parameters[referenceToFields[i].name] = $(`input[name="${referenceToFields[i].name}"][type='radio']:eq(0)`).val();
        this.updateRadioButtonView(referenceToFields[i].name);
      }
    }

    this.parameters.page = 1;
  }

  _addSubmitButtonListener($button, allFields) {
    $button.on('click', (e) => {
      e.preventDefault();
      this.parameters = this.getParameters(allFields);

      this.getUrlQueries();
      this.getData();
      this.updateURL();
    });
  }

  makeInputObject($ele, type, array) {
    $ele.map((i, ele) => {
      let inputObject = {};
      inputObject.name = $(ele).attr("name");
      inputObject.type = type;
      array.push(inputObject);
    });

    return array;
  }

  makeOptionObject($ele, type, array) {
    $ele.map((i, ele) => {
      // push only name first radio button in each radio button group
      let inputObject = {};
      inputObject.name = $(ele).find(`input[type='${type}']:eq(0)`).attr('name');
      inputObject.type = type;
      array.push(inputObject);
    });

    return array;
  }

  getAllFields($parent){
    let allFields = [];

    if ($parent.find('.text-field input').length)
      allFields = this.makeInputObject($parent.find('.text-field input'), "text", allFields);
    if ($parent.find('.date-field input').length)
      allFields = this.makeInputObject($parent.find('.date-field input'), "text", allFields);
    if ($parent.find('select').length)
      allFields = this.makeInputObject($parent.find('select'), "select", allFields);
    if ($parent.find('.checkboxes').length)
      allFields = this.makeOptionObject($parent.find('.checkboxes'), "checkbox", allFields);
    if ($parent.find('.radio-buttons').length)
      allFields = this.makeOptionObject($parent.find('.radio-buttons'), "radio", allFields);

    // console.log(allFields);

    return allFields;
  }

  getParameters(allFields, hasPagination = true) {
    let parameters = {};

    allFields.forEach(field => {
      if(field.type === 'checkbox')
        parameters[field.name] = this.getCheckboxValues(field.name);
      else if(field.type === 'radio')
        parameters[field.name] = this.getRadioButtonValue(field.name);
      else
        parameters[field.name] = $(`[name=${field.name}]`).val();
    });

    if (this.filterSlider) {
      const $input = this.filterSlider.$selector.find('input')
      parameters[$input.attr('name')] = this.filterSlider.filterValue;
    }

    // add page key if listing has pagination
    if (hasPagination) parameters.page = 1;

    return parameters;
  }

  updateDropdown($tabs) {
    $('.nav-dropdown__button .label', $tabs).text($('input[type=radio]:checked', $tabs).next().text());
  }

  parseCourseDate(date, startof = false) {
    let [dd, mmm, yyyy] = date.split(' ');

    let mm = '';
    
    switch(mmm) {
      case 'Jan':
        mm = 1;
        break;
      case 'Feb':
        mm = 2;
        break;
      case 'Mar':
        mm = 3;
        break;
      case 'Apr':
        mm = 4;
        break;
      case 'May':
        mm = 5;
        break;
      case 'Jun':
        mm = 6;
        break;
      case 'Jul':
        mm = 7;
        break;
      case 'Aug':
        mm = 8;
        break;
      case 'Sep':
        mm = 9;
        break;
      case 'Oct':
        mm = 0;
        break;
      case 'Nov':
        mm = 11;
        break;
      case 'Dec':
        mm = 12;
        break;
      default:
        mm = 1;
    }

    if (startof) {
      dd = '01';
    }
    else {
      dd = new Date(parseInt(yyyy), parseInt(mm) + 1, 0).getDate();
    }

    return `${dd} ${mmm} ${yyyy}`;
  }

  parseToday(startof = false) {
    const d = new Date();
    const month = d.getMonth();
    const year = d.getFullYear();
    
    let mmm = '';
    switch(month) {
      case 0:
        mmm = 'Jan';
        break;
      case 1:
        mmm = 'Feb';
        break;
      case 2:
        mmm = 'Mar';
        break;
      case 3:
        mmm = 'Apr';
        break;
      case 4:
        mmm = 'May';
        break;
      case 5:
        mmm = 'Jun';
        break;
      case 6:
        mmm = 'Jul';
        break;
      case 7:
        mmm = 'Aug';
        break;
      case 8:
        mmm = 'Sep';
        break;
      case 9:
        mmm = 'Oct';
        break;
      case 10:
        mmm = 'Nov';
        break;
      case 11:
        mmm = 'Dec';
        break;
      default:
        mmm = 'Jan';
    }
    
    let dd = '';
    if (startof) {
      dd = '01';
    }
    else {
      dd = new Date(parseInt(year), parseInt(month) + 1, 0).getDate();
    }

    return `${dd} ${mmm} ${year}`;
  }
}
