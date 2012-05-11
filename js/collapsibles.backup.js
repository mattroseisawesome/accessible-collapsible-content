/**
 * Accessible Accordions - jQuery plugin for accessible, unobtrusive collapsible content sections (accordions, sort of)
 * Copyright (c) 2012 Matt Rose https://twitter.com/#!/yonoshesteckler
 * Which was based on the totally effing sweet "Accessible Accordions" by Dirk Ginader
 * https://github.com/ginader/Accessible-Tabs
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * version 1.0
**/

(function($){
 var debugMode=true;
 $.fn.extend({
  getUniqueId:function(p,q,r){
   if(r===undefined){
    r='';
   }else{
    r='-'+r;
   }
   return p+q+r;
  },
  accessibleAccordions:function(config){
   var defaults={
    active: 0, //this should indicate the current item
    currentClass:'current', // Classname to apply to the LI of the selected Tab
    accordionParent:'.accordion-container',
    accordion:'.accordion',
    accordionHead:'.trigger', // Tag or valid Query Selector of the Elements to Transform the Tabs-Navigation from (originals are removed)
    accordionBody:'.accordion-body', // Tag or valid Query Selector of the Elements to be treated as the Tab Body
    currentInfoText:'current selection: ', // text to indicate for screenreaders which tab is the current one
    currentInfoPosition:'prepend', // Definition where to insert the Info Text. Can be either "prepend" or "append"
    currentInfoClass:'current-info', // Class to apply to the span wrapping the CurrentInfoText
    autoAnchor:false, // will move over any existing id of a headline in tabs markup so it can be linked to it
   };
   var keyCodes = {
    37 : -1, //LEFT
    38 : -1, //UP
    39 : +1, //RIGHT 
    40 : +1, //DOWN
    9 : +1 //TAB
   };
   this.options=$.extend(defaults,config);
   var accordionsCount=0;
   var o = this;
   if($("body").data('accessibleAccordionsCount')!==undefined){accordionsCount=$("body").data('accessibleAccordionsCount');}
   $("body").data('accessibleAccordionsCount',this.size()+accordionsCount);

   $(o.options.accordionParent).attr({"data-role":"collapsible-set","tabindex":"-1"});
   $(o.options.accordion).attr({"tabindex":"0","aria-selected":"false","data-role":"collapsible"});
   $(o.options.accordionBody).addClass("visually-hidden").attr({"aria-expanded":"false","aria-hidden":"true"});//if i try to combine them in one attr(), it fails.  sue me.
   $(o.options.accordionHead).addClass("closed");
   $(o.options.accordion+":first").focus().addClass("keyboard-focus").attr("aria-selected","true");

   /*accordion click event*/
   $(o.options.accordion+" "+o.options.accordionHead).toggle(function(){
    $(this).addClass("opened");
    $(this).parent(o.options.accordion).addClass("selected");
    $(this).parent(o.options.accordion).attr("aria-selected","true");
    $(this).siblings(o.options.accordionBody).removeClass("visually-hidden");
    $(this).siblings(o.options.accordionBody).attr({"aria-expanded":"true","aria-hidden":"false"});
    },function(){
    $(this).removeClass("opened");
    $(this).parent(o.options.accordion).removeClass("selected");
    $(this).parent(o.options.accordion).attr("aria-selected","false");
    $(this).siblings(o.options.accordionBody).addClass("visually-hidden");
    $(this).siblings(o.options.accordionBody).attr({"aria-expanded":"false","aria-hidden":"true"});
   }).blur(function(){
    $(this).parent(o.options.accordion).attr("aria-selected","false");
   });

  /*keyboard navigation*/
  var accordionKey = $(o.options.accordion); 
  var accordionKeySelected;
  if($(o.options.accordion).focus()){
   $(o.options.accordion).keyup(function(e){
    $(this).attr("aria-selected","true").addClass("keyboard-focus");
    /*enter/space bar opens item*/
    if((e.which===13)||(e.which===32)){
     $(this).children(o.options.accordionHead).trigger("click");
    }
    /*right/down arrow nagivates down*/
    if((e.which===39)||(e.which===40)){
     if(accordionKeySelected){
      prev = accordionKeySelected.prev();
      next = accordionKeySelected.next();
      if(next.length > 0){
       accordionKeySelected = next.focus().toggleClass("keyboard-focus").attr("aria-selected","true");
      }else{
      /*you are at the bottom*/
      }
     }else{
      accordionKeySelected = accordionKey.eq(0).focus().toggleClass("keyboard-focus").attr("aria-selected","true");
     }
    /*left/up arrow navigates up*/
    }else if((e.which===37)||(e.which===38)){
     if(accordionKeySelected){
      prev = accordionKeySelected.prev();
      next = accordionKeySelected.next();
      if(prev.length > 0){
       accordionKeySelected = prev.focus().toggleClass("keyboard-focus").attr("aria-selected","true");
      }else{
      /*you are at the top*/
      }
     }else{
      accordionKeySelected = accordionKey.last().focus().toggleClass("keyboard-focus").attr("aria-selected","true");
     }
    }
   }).blur(function(){
    $(this).removeClass("keyboard-focus").attr("aria-selected","false");
    $(document).unbind("keyup");
   });
  }

   $(o.options.accordion).each(function(t,e){
    var el=$(this);
    var list='';
    var accordionsCount=0;
    var ids=[];

    $(el).find(o.options.accordionHead).each(function(i){
     /*get a unique id to assign to this tab's heading*/
     var accordionId=o.getUniqueId('accordion',accordionsCount+t,i);
     /*assign the unique id and the tabheadClass class name to this tab's heading*/     
     $(this).attr({"id":accordionId,"class":o.options.accordionheadClass,"tabindex":"-1"});
      accordionsCount++;
     });

     /*Ensure that the call to setup tabs is re-runnable*/
     var accordions_selector = o.options.accordionParent;
     if(!$(el).find(accordions_selector).length){
      $(o.options.accordionParent +' accordionamount'+accordionsCount+'');
     }

     /*open accordion based on anchor*/
     if(o.options.autoAnchor && window.location.hash){
      var anchor=window.location.hash;$(anchor).toggleClass("opened");
      $(anchor).parent(o.options.accordion).toggleClass("selected");
      $(anchor).siblings(o.options.accordionBody).toggleClass("visually-hidden");
     }
    });
   },
  });

 // private Methods
 function debug(msg,info){
  if(debugMode&&window.console && window.console.log){
   if(info){
    window.console.log(info+': ',msg);
   }else{
    window.console.log(msg);
   }
  }
 }
})(jQuery);
