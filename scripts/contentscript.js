/*
    hackday-basic-chrome-ext for hackday usage
*/
(function() {

$(document).ready(function() {

	lib = new BDCLib();
    lib.debug();

    var comments = ['great room', 'this is a awesome trip', 'I think the room service is not very well'];

    var dom = document.createElement('div'),
    	hotelCartCnt = document.createElement('div'),
    	getBookingBlur = '.booking-blur',
    	getBookingList = '.booking-list',
    	getBookingSel = '.sr_item';
    	getMaxComment = 50;
  		setCommentTrunc = 64;
    var hotelID = '',
    	hotelName = '',
    	hotelImg = '';

	// cart container

	$(hotelCartCnt).addClass('hotelCartCnt');

    $(dom).addClass('booking-blur');
	$("body").append(dom).append(hotelCartCnt);
	$(getBookingBlur).hide(); 

	$(getBookingSel).mouseenter(function(){

		// image blur 
		$(this).find('.sr_item_photo').addClass('targetPhoto').css({
			'-webkit-filter': 'blur(10px)',
			'filter': 'blur(10px)'
		});

		// add button
		var addtoPKBtn = document.createElement('div');

		// hotel id
		hotelID = $(this).find('.sr_item_photo').attr('id').replace('hotel_', '');
		//console.log("hotelID", hotelID);

		hotelName = $(this).find('.sr-hotel__name').text().trim();
		hotelImg = $(this).find('.hotel_image').attr('src');

		$(addtoPKBtn).addClass('addtoPKBtn').attr('data-id', hotelID)
											.attr('data-title', hotelName)
											.attr('data-img', hotelImg)
											.text('added to PK');
		$(this).append(addtoPKBtn);

		$('.addtoPKBtn').click(function(){
			var getClickDataID = $(this).attr('data-id'),
				getClickDataTitle = $(this).attr('data-title');
			var isExisted = false;
			console.log("click on it");

			$('.hotelCartItem').each(function() {
				var curr = $(this);

				if (getClickDataID === $(curr).attr('data-id')) {
					isExisted = true;
				}
				//console.log('qqqq ===' + $(curr).attr('data-id'));
			});

			if (isExisted === false) {
				var hotelCartItem = document.createElement('div');
				$(hotelCartItem).addClass('hotelCartItem')
								.attr('data-id', getClickDataID)				
								.text(getClickDataTitle);
				$(hotelCartCnt).append(hotelCartItem);
			}

		});



		// loading
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
					averageScore = document.createElement('span'),
					commentCnt = '';

				var getPros = data[item].pros || '',
					getCons = data[item].cons || '';
					setCls = '';

				//console.log("item", data[item]);
				if (getPros) {
					
					var commentList = document.createElement('div');

					if (getPros.length > setCommentTrunc) {
						commentCnt = data[item].pros.substring(0, setCommentTrunc) + ' ...'; 
					} else {
						commentCnt = getPros;
					}
					setCls = 'pros';
				} else if (getCons) {
					var commentList = document.createElement('div');

					if (getCons.length > setCommentTrunc) {
						commentCnt = data[item].cons.substring(0, setCommentTrunc) + ' ...'; 
					} else {
						commentCnt = getCons;
					}
					setCls = 'cons';
				}

				if (commentCnt) {
					$(averageScore).addClass('averageScore').addClass(setCls).text(data[item].average_score);
					$(commentList).addClass('booking-list').append(averageScore).append(commentCnt);
					$(getBookingBlur).append(commentList);
				}
			}
		});

		$(getBookingBlur).show();
		

	}).mouseleave(function(){
		$(getBookingBlur).hide();

		$('.targetPhoto').css({
			'-webkit-filter': '',
			'filter': ''
		});
		$('.addtoPKBtn').remove();
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