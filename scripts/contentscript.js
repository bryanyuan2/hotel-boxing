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
				var hotelCartItem = document.createElement('div'),
					hotelCartText = document.createElement('span'),
					hotelCartImg = document.createElement('img');

				var likeImg = chrome.extension.getURL("images/like.png");
				$(hotelCartImg).addClass('hotelCartImg').attr('src', likeImg);
				$(hotelCartText).addClass('hotelCartText')
								.append(getClickDataTitle)

				$(hotelCartItem).addClass('hotelCartItem')
								.attr('data-id', getClickDataID)
								.append(hotelCartImg)				
								.append(hotelCartText);
				$(hotelCartCnt).append(hotelCartItem);

				// added addFavoriteHotel
				lib.addFavoriteHotel(getClickDataID, function(done){
					console.log("added hotel id", getClickDataID);
				});
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
		lib.getHotelReviews(hotelID, function(data){

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

    var pktableContainer = document.createElement("div");
    $(pktableContainer).attr("id", "pktable-container");
    
    var pktable =   "<table class='booking-pktable'>" +
                        "<tbody>" +
                            "<tr>" +
                                "<td>Hotel</td>" +
                                "<td><img src='http://t-ec.bstatic.com/images/hotel/square200/392/39242578.jpg' alt=''></td>" +
                                "<td><img src='http://s-ec.bstatic.com/images/hotel/square200/728/72839775.jpg' alt=''></td>" +
                                "<td><img src='http://s-ec.bstatic.com/images/hotel/square200/360/36046638.jpg' alt=''></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>breakfast</td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>parking</td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>pool</td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td><input type='text' id='booking-input-kw' placeholder='Feature:'/><i id='booking-add-kw-button' class='fa fa-plus-square' aria-hidden='true'></i></td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                            "</tr>" +
                        "</tbody>" +
                    "</table>";

    $(pktableContainer).append(pktable);
    $("body").append(pktableContainer); 

    $("#booking-add-kw-button").click(function(){
        addNewRow( $("#booking-input-kw").val() );
    });
    $("#booking-add-kw-button").hover(function(){
        $(this).addClass("fa-lg");
    }, function(){
        $(this).removeClass("fa-lg");
    });

    $("#booking-input-kw").blur(function(){
    });

    lib = new BDCLib();
    lib.debug();

});
})();

function addNewRow (kw) {
    
    console.log(kw);
    var newRow =    "<tr>" +
                        "<td>" +
                            "<input type='text' id='input-kw' placeholder='What's important to you...'/>"
                        "</td>" +
                    "</tr>";
    return newRow;
}