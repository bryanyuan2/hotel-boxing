/*
    hackday-basic-chrome-ext for hackday usage
*/
(function() {

$(document).ready(function() {

	lib = new BDCLib();
    lib.debug();

    var comments = ['great room', 'this is a awesome trip', 'I think the room service is not very well'];

    var dom = document.createElement('div'),
    	getBookingBlur = '.booking-blur',
    	getBookingList = '.booking-list',
    	getBookingSel = '.sr_item';
    	getMaxComment = 20;
  		setCommentTrunc = 64;
    var hotelID = '';
    $(dom).addClass('booking-blur');

	$("body").append(dom);
	$(getBookingBlur).hide(); 

	$(getBookingSel).mouseenter(function(){
		var loadingContainer = document.createElement('loadingCont'),
			skThreeBounce = document.createElement('sk-three-bounce'),
			skBounce1 = document.createElement('sk-bounce1'),
			skBounce2 = document.createElement('sk-bounce2'),
			skBounce3 = document.createElement('sk-bounce3');
		
		$(skThreeBounce).addClass('sk-three-bounce');
		$(skBounce1).addClass('sk-child').addClass('sk-bounce1');
		$(skBounce2).addClass('sk-child').addClass('sk-bounce2');
		$(skBounce3).addClass('sk-child').addClass('sk-bounce3');

		$(skThreeBounce).append(skBounce1).append(skBounce2).append(skBounce3);
		$(loadingContainer).append(skThreeBounce);
		// clean up content
		$(getBookingBlur).text('').append(loadingContainer);

/*
		 <div class="sk-three-bounce">
        <div class="sk-child sk-bounce1"></div>
        <div class="sk-child sk-bounce2"></div>
        <div class="sk-child sk-bounce3"></div>
      </div>*/



		// get hotel review
		hotelID = $(this).find('.sr_item_photo').attr('id').replace('hotel_', '');
		console.log("hotelID", hotelID);

    	// get hotel review
		lib.getHoteReviews(hotelID, function(data){

			$(getBookingBlur).text('');

			// console.log("data", data);
			var limit = 10;
			if (getMaxComment > data.length) {
				limit = data.length;
			} else {
				limit = getMaxComment;
			}

			for (var item=0;item<limit;item++) {
				// create comment dom
				var commentList = document.createElement('div'),
					commentCnt = '';

				var getPros = data[item].pros || '',
					getCons = data[item].cons || '';
					setCls = '';

				console.log("item", data[item]);
				if (getPros) {
					if (getPros.length > 64) {
						commentCnt = data[item].pros.substring(0, setCommentTrunc) + ' ...'; 
					} else {
						commentCnt = getPros;
					}
					setCls = 'pros';
				} else if (getCons) {
					if (getCons.length > 64) {
						commentCnt = data[item].cons.substring(0, setCommentTrunc) + ' ...'; 
					} else {
						commentCnt = getCons;
					}
					setCls = 'cons';	
				}

				$(commentList).addClass('booking-list').addClass(setCls).append(commentCnt);
				$(getBookingBlur).append(commentList);

			}
		});

		$(getBookingBlur).show();
		

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
});
})();