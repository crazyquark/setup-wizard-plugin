/********************************************************
 *
 * Custom Javascript code for AppStrap Bootstrap theme
 * Written by Themelize.me (http://themelize.me)
 *
 *******************************************************/
/*global jRespond */
var jPM = {};
jQuery(document).ready(function() {
  "use strict";
  
  //colour switch - demo only
  // --------------------------------
  var defaultColour = 'green';
  jQuery('.colour-switcher a').click(function() {
    var c = jQuery(this).attr('href').replace('#','');
    var cacheBuster = 3 * Math.floor(Math.random() * 6);
    jQuery('.colour-switcher a').removeClass('active');
    jQuery('.colour-switcher a.'+ c).addClass('active');
    
    if (c !== defaultColour) {
      jQuery('#colour-scheme').attr('href','css/colour-'+ c +'.css?x='+ cacheBuster);
    }
    else {
      jQuery('#colour-scheme').attr('href', '#');
    }
  });
  
  //IE placeholders
  // --------------------------------
  jQuery('[placeholder]').focus(function() {
    var input = jQuery(this);
    if (input.val() === input.attr('placeholder')) {
      if (this.originalType) {
        this.type = this.originalType;
        delete this.originalType;
      }
      input.val('');
      input.removeClass('placeholder');
    }
  }).blur(function() {
    var input = jQuery(this);
    if (input.val() === '') {
      input.addClass('placeholder');
      input.val(input.attr('placeholder'));
    }
  }).blur();
  
  // Detect Bootstrap fixed header
  // @see: http://getbootstrap.com/components/#navbar-fixed-top
  // --------------------------------
  if (jQuery('.navbar-fixed-top').size() > 0) {
    jQuery('html').addClass('has-navbar-fixed-top');
  }
  
  // Bootstrap tooltip
  // @see: http://getbootstrap.com/javascript/#tooltips
  // --------------------------------
  // invoke by adding data-toggle="tooltip" to a tags (this makes it validate)
  if(jQuery().tooltip) {
    jQuery('body').tooltip({
      selector: "[data-toggle=tooltip]",
      container: "body"
    });
  }
    
  // Bootstrap popover
  // @see: http://getbootstrap.com/javascript/#popovers
  // --------------------------------
  // invoke by adding data-toggle="popover" to a tags (this makes it validate)
  if(jQuery().popover) {
    jQuery('body').popover({
      selector: "[data-toggle=popover]",
      container: "body",
      trigger: "hover"
    });
  }
  
  // Submenus
  // --------------------------------  
  jQuery('html').themeSubMenus();

  //allow any page element to set page class
  // --------------------------------  
  jQuery('[data-page-class]').each(function() {
    jQuery('html').addClass(jQuery(this).data('page-class'));
  });
  
  //show hide for hidden header
  // --------------------------------
  jQuery('[data-toggle=show-hide]').each(function() {
    jQuery(this).click(function() {
      var state = 'open'; //assume target is closed & needs opening
      var target = jQuery(this).attr('data-target');
      var targetState = jQuery(this).attr('data-target-state');
      
      //allows trigger link to say target is open & should be closed
      if (typeof targetState !== 'undefined' && targetState !== false) {
        state = targetState;
      }
      
      if (state === 'undefined') {
        state = 'open';
      }
      
      jQuery(target).toggleClass('show-hide-'+ state);
      jQuery(this).toggleClass(state);
    });
  });

  //Plugin: jPanel Menu
  // data-toggle=jpanel-menu must be present on .navbar-btn
  // @todo - allow options to be passed via data- attr
  // --------------------------------
  if(jQuery.jPanelMenu && jQuery('[data-toggle=jpanel-menu]').size() > 0) {
    var jpanelMenuTrigger = jQuery('[data-toggle=jpanel-menu]');

    jPM = jQuery.jPanelMenu({
      menu: jpanelMenuTrigger.data('target'),
      direction: 'left',
      trigger: '.'+ jpanelMenuTrigger.attr('class'),
      excludedPanelContent: '.jpanel-menu-exclude',
      openPosition: '280px',
      afterOpen: function() {
        jpanelMenuTrigger.addClass('open');
        jQuery('html').addClass('jpanel-menu-open');
      },
      afterClose: function() {
        jpanelMenuTrigger.removeClass('open');
        jQuery('html').removeClass('jpanel-menu-open');
      }
    });
  
    //jRespond settings
    var jRes = jRespond([
      {
        label: 'small',
        enter: 0,
        exit: 991
      }
    ]);
    
    //turn jPanel Menu on/off as needed
    jRes.addFunc({
        breakpoint: 'small',
        enter: function() {
          jPM.on();
          jQuery('html').themeSubMenus();
        },
        exit: function() {
          jPM.off();
          jQuery('html').themeSubMenus();
        }
    });
  }
  
  //Plugin: clingify (sticky navbar)
  // --------------------------------
  if (jQuery().clingify) {
    jQuery('[data-toggle=clingify]').clingify({
      breakpoint: 1010,
    });
  }
  
  //Plugin: flexslider
  // --------------------------------
  jQuery('.flexslider').each(function() {
    var sliderSettings =  {
      animation: jQuery(this).attr('data-transition'),
      selector: ".slides > .slide",
      controlNav: true,
      smoothHeight: true,
      start: function(slider) {
        //hide all animated elements
        slider.find('[data-animate-in]').each(function() {
          jQuery(this).css('visibility','hidden');
        });

        //slide backgrounds
        slider.find('.slide-bg').each(function() {
          jQuery(this).css({'background-image': 'url('+ jQuery(this).data('bg-img') +')'});
          jQuery(this).css('visibility','visible').addClass('animated').addClass(jQuery(this).data('animate-in'));
        });
        
        //animate in first slide
        slider.find('.slide').eq(1).find('[data-animate-in]').each(function() {
          jQuery(this).css('visibility','hidden');
          if (jQuery(this).data('animate-delay')) {
            jQuery(this).addClass(jQuery(this).data('animate-delay'));
          }
          if (jQuery(this).data('animate-duration')) {
            jQuery(this).addClass(jQuery(this).data('animate-duration'));
          }
          jQuery(this).css('visibility','visible').addClass('animated').addClass(jQuery(this).data('animate-in'));
          jQuery(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
            function() {
              jQuery(this).removeClass(jQuery(this).data('animate-in'));
            }
          );
        });
      },
      before: function(slider) {
        slider.find('.slide-bg').each(function() {
          jQuery(this).removeClass(jQuery(this).data('animate-in')).removeClass('animated').css('visibility','hidden');
        });
        
        //hide next animate element so it can animate in
        slider.find('.slide').eq(slider.animatingTo + 1).find('[data-animate-in]').each(function() {
          jQuery(this).css('visibility','hidden');
        });
      },
      after: function(slider) {
       //alert(slider.currentSlide);
        //hide animtaed elements so they can animate in again
        slider.find('.slide').find('[data-animate-in]').each(function() {
          jQuery(this).css('visibility','hidden');
        });
        
        //animate in next slide
        slider.find('.slide').eq(slider.animatingTo + 1).find('[data-animate-in]').each(function() {
          if (jQuery(this).data('animate-delay')) {
            jQuery(this).addClass(jQuery(this).data('animate-delay'));
          }
          if (jQuery(this).data('animate-duration')) {
            jQuery(this).addClass(jQuery(this).data('animate-duration'));
          }
          jQuery(this).css('visibility','visible').addClass('animated').addClass(jQuery(this).data('animate-in'));
          jQuery(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
            function() {
              jQuery(this).removeClass(jQuery(this).data('animate-in'));
            }
          );
        });
      }
    };
    
    var sliderNav = jQuery(this).attr('data-slidernav');
    if (sliderNav !== 'auto') {
      sliderSettings = $.extend({}, sliderSettings, {
        manualControls: sliderNav +' li a',
        controlsContainer: '.flexslider-wrapper'
      });
    }
    
    jQuery('html').addClass('has-flexslider');
    jQuery(this).flexslider(sliderSettings);
  });
  jQuery('.flexslider').resize(); //make sure height is right load assets loaded
  
  //Plugin: jQuery Quicksand plugin
  //@based on: http://www.evoluted.net/thinktank/web-development/jquery-quicksand-tutorial-filtering
  // --------------------------------
  jQuery('[data-js=quicksand]').each(function() {
    var quicksandTrigger = jQuery(this).find(jQuery(this).data('quicksand-trigger'));
    var quicksandTarget = jQuery(jQuery(this).data('quicksand-target'));
    var quicksandTargetData = quicksandTarget.clone();
    var filterId = 'all';
    var filteredData;
    
    quicksandTrigger.click(function(e) {
      filterId = jQuery(this).data('quicksand-fid');
      filteredData = '';
      quicksandTrigger.parents('li').removeClass('active');
      jQuery(this).parents('li').addClass('active');
      
      if (filterId === 'all') {
        filteredData = quicksandTargetData.find('[data-quicksand-id]');
      }
      else {
        filteredData = quicksandTargetData.find('[data-quicksand-tid="'+ filterId +'"]');
      }
      
      quicksandTarget.quicksand(filteredData,
        {
          duration: 600,
          attribute: 'data-quicksand-id',
          adjustWidth: 'auto',
        }
      ).addClass('quicksand-target');
      e.preventDefault();
    });
  });

  //Plugin: Slider Revolution
  // --------------------------------
  jQuery('[data-toggle=slider-rev]').each(function() {
    var sliderRevEl = $(this);
    var sliderRevSettings;
    var sliderRevSettingsDefault = {
      delay: 9000,
      startheight: 500,
      startwidth: 960,
      fullScreenAlignForce: "off",
      autoHeight: "off",
      hideThumbs: 200,
      thumbWidth: 100, // Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
      thumbHeight: 50,
      thumbAmount: 3,
      navigationType: "bullet", // bullet, thumb, none
      navigationArrows: "solo", // nextto, solo, none
      hideThumbsOnMobile: "off",
      hideBulletsOnMobile: "off",
      hideArrowsOnMobile: "off",
      hideThumbsUnderResoluition: 0,
      navigationStyle: "round", // round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item),
      navigationHAlign: "center", // Vertical Align top,center,bottom
      navigationVAlign: "bottom", // Horizontal Align left,center,right
      navigationHOffset: 0,
      navigationVOffset: 20,
      soloArrowLeftHalign: "left",
      soloArrowLeftValign: "center",
      soloArrowLeftHOffset: 20,
      soloArrowLeftVOffset: 0,
      soloArrowRightHalign: "right",
      soloArrowRightValign: "center",
      soloArrowRightHOffset: 20,
      soloArrowRightVOffset: 0,
      keyboardNavigation: "on",
      touchenabled: "on", // Enable Swipe Function : on/off
      onHoverStop: "on", // Stop Banner Timet at Hover on Slide on/off
      stopAtSlide: -1, // Stop Timer if Slide "x" has been Reached. If stopAfterLoops set to 0, then it stops already in the first Loop at slide X which defined. -1 means do not stop at any slide. stopAfterLoops has no sinn in this case.
      stopAfterLoops: -1, // Stop Timer if All slides has been played "x" times. IT will stop at THe slide which is defined via stopAtSlide:x, if set to -1 slide never stop automatic
      hideCaptionAtLimit: 0, // It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
      hideAllCaptionAtLimit: 0, // Hide all The Captions if Width of Browser is less then this value
      hideSliderAtLimit: 0, // Hide the whole slider, and stop also functions if Width of Browser is less than this value
      shadow: 0, //0 = no Shadow, 1,2,3 = 3 Different Art of Shadows  (No Shadow in Fullwidth Version !)
      fullWidth: "off", // Turns On or Off the Fullwidth Image Centering in FullWidth Modus
      fullScreen: "off",
      minFullScreenHeight: 0, // The Minimum FullScreen Height
      fullScreenOffsetContainer: "",
      dottedOverlay: "none", //twoxtwo, threexthree, twoxtwowhite, threexthreewhite
      forceFullWidth: "off", // Force The FullWidth
      spinner: "spinner0"
    };
    sliderRevSettings = $.extend({}, sliderRevSettingsDefault, sliderRevEl.data());
    sliderRevEl.revolution(sliderRevSettings);
  });
});

jQuery.fn.extend({
  
  //submenu dropdowns
  // --------------------------------
  themeSubMenus: function () {
    jQuery('ul.dropdown-menu [data-toggle=dropdown]', jQuery(this)).on('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
        
      // Toggle direct parent
      jQuery(this).parent().toggleClass('open');
    });
  }
});