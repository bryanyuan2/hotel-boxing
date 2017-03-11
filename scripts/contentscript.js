/*
    hackday-basic-chrome-ext for hackday usage
*/
(function() {

$(document).ready(function() {

    // get resource
    // var resource = chrome.extension.getURL("audio/test.mp3");

    var comments = ['great room', 'this is a awesome trip', 'I think the room service is not very well'];


    var dom = document.createElement('div'),
    	getBookingBlur = '.booking-blur',
    	getBookingList = '.booking-list',
    	getBookingSel = '.sr_item';
    var hotelID = '';
    $(dom).addClass('booking-blur');

	$("body").append(dom);
	$(getBookingBlur).hide(); 

	$(getBookingSel).mouseenter(function(){
		$(getBookingBlur).show();
		hotelID = $(this).find('.sr_item_photo').attr('id').replace('hotel_', '');
		console.log("hotelID", hotelID);

	}).mouseleave(function(){
		$(getBookingBlur).hide();
	});

    for (var i=0;i<comments.length;i++) {
    	var commentList = document.createElement('div');
    	$(commentList).addClass('booking-list').text(comments[i]);
    	$(getBookingBlur).append(commentList);
    }

    // create dom
    var dom = document.createElement("div");
    $("body").append(dom);

    lib = new BDCLib();
    lib.debug();
});
})();