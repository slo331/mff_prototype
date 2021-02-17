'use strict';

import $ from 'jquery';

export default class Notification {
  constructor() {
    let $notificationWrap = $('.notification');
    let $notification = $('.notification__content', $notificationWrap);
    let $btnClose = $('.btn--close', $notificationWrap);

    // Check if got Notification Cookie
    if (this._getCookie('notice') == null || this._getCookie('notice') == 'true') {
      
      $.when(this._setCookie('notice', 'true'))
      .done(() => {
        setTimeout(() => {
          $notificationWrap.slideDown('slow');
			    $notificationWrap.addClass('noticed');
        }, 1000);
      });
    }
    
    $btnClose.on('click', e => {
      e.preventDefault();

      let $notifySlideUp = () => {
        $notificationWrap.removeClass('noticed');
        this._setCookie('notice', 'false');
      }
      
      $.when($notifySlideUp())
      .done(() => {
        $notificationWrap.slideUp('slow');
      });
    })
  }

  _setCookie(name,value,days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
  
  _getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    
    for(var i=0;i < ca.length;i++) {
      let c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
}
