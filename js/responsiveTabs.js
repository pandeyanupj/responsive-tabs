var RespTabs = {};

(function($){
	'use strict';
	$.fn.responsiveTabs = function(){
		return this.each(function(){
			var respTabs = Object.create(RespTabs);
			respTabs.init(this);
		});
	};
})(jQuery);

RespTabs.init = function(elem){
	var $tabs = $(elem).children(); //total panels
	$headers = $tabs.children(':header'); //header of tabs
	$contents = $tabs.children('div'); //content of tabs
	$headers.addClass('resp-headings');
	$contents.addClass('resp-contents');

	//check for panel marked as active or set first as default
	var $activePanel = $('[resp-tab="default"]');
	if(!$activePanel.length) {
		$activePanel = $tabs.first();
	};

	//mark one content as active and hide the rest
	$activePanel.children('div').addClass('resp-content__active').attr('aria-hidden', 'false'); 
	$contents.not('.resp-content__active').hide().attr('aria-hidden', 'true'); 
	$activePanel.children(':header').addClass('resp-heading__active');

	var $tabList = $('<ul></ul>', { 'class': 'resp-tablist' }); //nav tabs for desktop
	var $tabDrop = $('<select></select>', {'class': 'resp-tabDrop'}) //dropdown for mobile

	var tabCount = 1;
	$headers.each(function(){
		var $tabHeading = $(this);
		var $tabDiv = $(this).next();
		
		/*generate options for dropDown*/
		var $tabDropOptions = $('<option></option>', {
			'class': 'resp-tabDropOption',
			id: 'tabOption' + tabCount,
			text: $tabHeading.text()
		});

		/*generate list items for tabList*/
		var $tabListItem = $('<li></li>', {
			'class': 'resp-tablistItem',
			id: 'tablistItem' + tabCount,
			text: $tabHeading.text(),
			click: function(){
				$tabs.find('.resp-content__active').toggle().removeClass('resp-content__active').attr('aria-hidden', 'true').prev().removeClass('resp-heading__active');
				$tabDiv.toggle().addClass('resp-content__active').attr('aria-hidden', 'false');
				$tabHeading.addClass('resp-heading__active');
				$tabList.find('.resp-tablistItem__active').removeClass('resp-tablistItem__active');
				$tabListItem.addClass('resp-tablistItem__active');

				/*syncing tab change with dropdown*/
				$('.resp-tabDropOption').removeAttr('selected');
				$('.resp-tabDropOption').eq($('.resp-tablistItem__active').index()).attr('selected', 'selected');
			}
		});

		if($tabDiv.hasClass('resp-content__active')){
			$tabListItem.addClass('resp-tablistItem__active');
		}

		$tabList.append($tabListItem); //add listItems into list
		$tabDrop.append($tabDropOptions); //add options in dropdown

		$tabDrop.change(function(){
			$tabs.find('.resp-content__active').toggle().removeClass('resp-content__active').attr('aria-hidden', 'true').prev().removeClass('resp-heading__active');
			$('.resp-contents').eq($('.resp-tabDrop :selected').index()).toggle().addClass('resp-content__active').attr('aria-hidden', 'false');
			$('.resp-headings').eq($('.resp-tabDrop :selected').index()).addClass('resp-heading__active');
			/*syncing dropdown change with tabs*/
			$('.resp-tablistItem').removeClass('resp-tablistItem__active');
			$('.resp-tablistItem').eq($('.resp-tabDrop :selected').index()).addClass('resp-tablistItem__active');
		});

		tabCount++;
	});
	$(document).ready(function(){
		$('.resp-tabDropOption').eq($activePanel.index()).attr('selected', 'selected');
	});
	
	$tabs.parent().before($tabList);
	$tabs.parent().before($tabDrop);
};
