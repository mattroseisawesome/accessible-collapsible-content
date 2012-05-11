/**
 * Accessible Collapsibles - jQuery plugin for accessible, unobtrusive collapsible content sections
 * Copyright (c) 2012 Matt Rose https://twitter.com/#!/yonoshesteckler
 * Which was based on the totally effing sweet "Accessible Tabs" by Dirk Ginader
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
  accessibleCollapsibles:function(config){
   var defaults={
    active: 0, //this should indicate the current item
    currentClass:'current',
    collapsibleParent:'.collapsible-container',
    collapsible:'.collapsible',
    collapsibleHead:'.trigger', // Tag or valid Query Selector of the Elements to Transform the Collapsible from (originals are removed)
    collapsibleBody:'.collapsible-body', // Tag or valid Query Selector of the Elements to be treated as the Collapsible Body
    currentInfoText:'current selection: ', // text to indicate for screenreaders which collapsible is the current one
    currentInfoPosition:'prepend', // Definition where to insert the Info Text. Can be either "prepend" or "append"
    currentInfoClass:'current-info', // Class to apply to the span wrapping the CurrentInfoText
    autoAnchor:false, // will move over any existing id of a headline in tabs markup so it can be linked to it
   };
   this.options=$.extend(defaults,config);
   var collapsiblesCount=0;
   var o = this;
   if($("body").data('accessibleCollapsiblesCount')!==undefined){collapsiblesCount=$("body").data('accessibleCollapsiblesCount');}
   $("body").data('accessibleCollapsiblesCount',this.size()+collapsiblesCount);

   $(o.options.collapsibleParent).attr({"data-role":"collapsible-set","tabindex":"-1"});
   $(o.options.collapsible).attr({"tabindex":"0","aria-selected":"false","data-role":"collapsible"});
   $(o.options.collapsibleBody).addClass("visually-hidden").attr({"aria-expanded":"false","aria-hidden":"true"});
   $(o.options.collapsibleHead).addClass("closed");

   /*collapsible click event*/
   $(o.options.collapsible+" "+o.options.collapsibleHead).toggle(function(){
    $(this).addClass("opened");
    $(this).parent(o.options.collapsible).addClass("selected");
    $(this).parent(o.options.collapsible).attr("aria-selected","true");
    $(this).siblings(o.options.collapsibleBody).removeClass("visually-hidden");
    $(this).siblings(o.options.collapsibleBody).attr({"aria-expanded":"true","aria-hidden":"false"});
    },function(){
    $(this).removeClass("opened");
    $(this).parent(o.options.collapsible).removeClass("selected");
    $(this).parent(o.options.collapsible).attr("aria-selected","false");
    $(this).siblings(o.options.collapsibleBody).addClass("visually-hidden");
    $(this).siblings(o.options.collapsibleBody).attr({"aria-expanded":"false","aria-hidden":"true"});
   }).blur(function(){
    $(this).parent(o.options.collapsible).attr("aria-selected","false");
   });

  /*keyboard navigation*/
  var collapsibleKey = $(o.options.collapsible); 
  var collapsibleKeySelected;
  if($(o.options.collapsible).focus()){
   $(o.options.collapsible).keydown(function(e){
    $(this).attr("aria-selected","true").addClass("keyboard-focus");
    /*for some reason, you have to initialize the up/down navigation with two keyups
     * still some weirdness navigating between up/down and tab
     * right/down arrow nagivates down*/
    if((e.which==39)||(e.which==40)){
     if(collapsibleKeySelected){
      prev = collapsibleKeySelected.prev();
      next = collapsibleKeySelected.next();
      if(next.length > 0){
       collapsibleKeySelected = next.focus().toggleClass("keyboard-focus").attr("aria-selected","true");
      }else{
      /*you are at the bottom*/
      }
     }else{
      collapsibleKeySelected = collapsibleKey.eq(0).focus().toggleClass("keyboard-focus").attr("aria-selected","true");
     }
    /*left/up arrow navigates up*/
    }else if((e.which==37)||(e.which==38)){
     if(collapsibleKeySelected){
      prev = collapsibleKeySelected.prev();
      next = collapsibleKeySelected.next();
      if(prev.length > 0){
       collapsibleKeySelected = prev.focus().toggleClass("keyboard-focus").attr("aria-selected","true");
      }else{
      /*you are at the top*/
      }
     }else{
      collapsibleKeySelected = collapsibleKey.last().focus().toggleClass("keyboard-focus").attr("aria-selected","true");
     }
    }
    /*enter/space bar opens item*/
    if((e.which==13)||(e.which==32)){
     $(this).children(o.options.collapsibleHead).trigger("click");
    }
   }).blur(function(){
    $(this).removeClass("keyboard-focus").attr("aria-selected","false");
    $(document).unbind("keyup");
   });
  }



   $(o.options.collapsible).each(function(t,e){
    var el=$(this);
    var list='';
    var collapsiblesCount=0;
    var ids=[];

    $(el).find(o.options.collapsibleHead).each(function(i){
     /*get a unique id to assign to this tab's heading*/
     var collapsibleId=o.getUniqueId('collapsible',collapsiblesCount+t,i);
     /*assign the unique id and the tabheadClass class name to this tab's heading*/     
     $(this).attr({"id":collapsibleId,"class":o.options.collapsibleClassHead,"tabindex":"-1"});
      collapsiblesCount++;
     });
  /*open collapsible based on anchor*/
  if(o.options.autoAnchor && window.location.hash){
   var anchor=window.location.hash;
   $(anchor).addClass("opened");
   $(anchor).parent(o.options.collapsible).addClass("selected keyboard-focus").focus();
   $(anchor).siblings(o.options.collapsibleBody).removeClass("visually-hidden");
  }else{
   $(o.options.collapsible+":first").addClass("keyboard-focus").attr("aria-selected","true").focus();
  }
  
  
     /*Ensure that the call to setup tabs is re-runnable*/
     var collapsibles_selector = o.options.collapsibleParent;
     if(!$(el).find(collapsibles_selector).length){
      $(o.options.collapsibleParent +' collapsibleamount'+collapsiblesCount+'');
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
