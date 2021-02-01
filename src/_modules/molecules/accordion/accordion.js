'use strict';

import $ from 'jquery';

export default class Accordion {
  constructor() {
    let $accordion = $('.accordion');
    let $accItem = $('.accordion-item', $accordion)
    let $accLabel = $('.label-title', $accItem);
    let $icon = $('.icon', $accLabel);

    let $expand = $('.btn--acc_expand', $accordion);
    let $collapse = $('.btn--acc_collapse', $accordion);

    this.$accItem = $accItem;

    $accLabel.map((i,el) => {
      let $el = $(el);
      
      $el.on('click', () => {
        let $parent = $el.parent('.accordion-parent');
        let $accContent = $el.siblings('.content-wrap');
        let $icon = $el.find('.icon');

        let $slideUp = () => {
          $accContent.slideUp('slow');
          $icon.removeClass('icon-collapse').addClass('icon-expand');
        }

        let $slideDown = () => {
          $icon.removeClass('icon-expand').addClass('icon-collapse');
          $accContent.slideDown('slow');
        }
      
        if ($parent.hasClass('is-open')) {
          $.when($slideUp())
          .done(() => {
            $parent.removeClass('is-open');
          });
        } else {
          $.when($slideDown())
          .done(() => {
            $parent.addClass('is-open');
          });
        }
      });
    });

    $expand.map((i,el) => {
      let $el = $(el);
      let $parent = $el.parent('.sub-control');
      let $sibling = $parent.siblings('.sub-accordion');
      let $accParent = $sibling.find('.accordion-parent');
      let $contentWrap = $sibling.find('.content-wrap');
      let $icon = $sibling.find('.icon');

      $el.on('click', e => {
        e.preventDefault();
        $icon.removeClass('icon-expand').addClass('icon-collapse');
        $contentWrap.slideDown('slow');
        $accParent.addClass('is-open');
      });
    });

    $collapse.map((i,el) => {
      let $el = $(el);
      let $parent = $el.parent('.sub-control');
      let $sibling = $parent.siblings('.sub-accordion');
      let $accParent = $sibling.find('.accordion-parent');
      let $contentWrap = $sibling.find('.content-wrap');
      let $icon = $sibling.find('.icon');

      $el.on('click', e => {
        e.preventDefault();
        $contentWrap.slideUp('slow');
        $icon.removeClass('icon-collapse').addClass('icon-expand');
        $accParent.removeClass('is-open');
      });
    });

    $(document).ready(() => {
      if(window.location.hash) {
        this.triggerAcc();
      }

      $(window).on('hashchange', e => {
        let $close = () => {
          $('.content-wrap').slideUp('slow');
          $('.accordion-parent').removeClass('is-open');
          $icon.removeClass('icon-collapse').addClass('icon-expand');
        }

        $.when($close())
        .done(() => {
          this.triggerAcc();
        });
      });
    });
  }

  triggerAcc() {
    let $hash = window.location.hash.slice(1);
    console.log($hash);

    this.$accItem.map((i,el) => {
      let $el = $(el);
      let $label = $('.accordion-label', $el);
      let $data = $el.data('accordion');

      if($data === $hash) {
        $label.trigger('click');
      }
    });
  }
}
