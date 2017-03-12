/*
    hackday-basic-chrome-ext for hackday usage
*/
(function() {

$(document).ready(function() {

	lib = new BDCLib();
    lib.debug();

    var comments = [];
    var _store = {
        cache: {}
    };

	var CONST_CONFIGS = {
			getMaxComment: 50,
	  		setCommentTrunc: 64
		},
		CONST_SELECTOR = {
			getBookingBlur: '.booking-blur',
	    	getBookingSel: '.sr_item',
	    	getItemPhoto: '.sr_item_photo',
	    	getItemPhotoTarID: '.targetPhoto',
	    	getItemName: '.sr-hotel__name',
	    	getItemImg: '.hotel_image',
	    	getAddedBtn: '.addtoPKBtn'
		},
		CONST_STYLING = {
			setBlurStyling: {
				'-webkit-filter': 'blur(10px)',
				'filter': 'blur(10px)'
			},
			cancelBlurStyling: {
				'-webkit-filter': '',
				'filter': ''
			}
		},
		CONF_IMG = {
			like: 'images/like.png'
		},
		CONF_TRANS = {
			boxingNow: 'Boxing Now',
            clear: 'clear'
		};
	
    var _getFECache = function(hotel_id){
    	if(_store.cache[hotel_id]){
            return _store.cache[hotel_id];
        }
        return null;
    };
    var _putFECache = function(hotel_id, data){
        if(data) {
            _store.cache[hotel_id] = data;
        }
    };

	var _showComment = function(data) {
		$(CONST_SELECTOR.getBookingBlur).text('');
		var limit = (CONST_CONFIGS.getMaxComment > data.length) ? data.length : CONST_CONFIGS.getMaxComment;

        var displayData = [];
        var commentCnt;
        var ageMonth;
        var nowDate = new Date();
		for (var item=0;item<limit;item++) {
            ['pros','cons'].forEach(function(type, idx){
                commentCnt = data[item][type + '_hl'] || '';
                ageMonth = (nowDate.getTime() - (new Date(data[item]['date'])).getTime()) / (1000 * 86400 * 30);
                ageMonth = Math.min(36, ageMonth);

			    if (commentCnt) {
                    displayData.push({
                            text: commentCnt,
                            cls: type,
                            ascore: data[item].average_score,
                            score: (data[item][type + '_hlc'] || 0) * 10000 + (36 - ageMonth)
                        });
                }
            });
		}
        displayData.sort(function(a,b){return b['score'] - a['score'];});
        var data;
        var commentList;
        var averageScore;
        for(var i = 0; i < displayData.length; i++){
            commentList = document.createElement('div');
            averageScore = document.createElement('span');
            data = displayData[i];
            $(averageScore).addClass('averageScore').addClass(data.cls).text(data.ascore);
            $(commentList).addClass('booking-list').append(averageScore).append('<div class="text">' + data.text + '</div>');
            $(CONST_SELECTOR.getBookingBlur).append(commentList);
        }
	}

	var _addedHotelsInBoxingList = function(title, hotel_id) {
		var hotelCartItem = document.createElement('div'),
			hotelCartText = document.createElement('span'),
			hotelCartImg = document.createElement('img'),
			likeImg = chrome.extension.getURL(CONF_IMG.like);

		$(hotelCartImg).addClass('hotelCartImg').attr('src', likeImg);
		$(hotelCartText).addClass('hotelCartText')
						.append(title)

		$(hotelCartItem).addClass('hotelCartItem')
						.attr('data-id', hotel_id)
						.append(hotelCartImg)				
						.append(hotelCartText);
		$(hotelCartCnt).prepend(hotelCartItem);
	};

    var dom = document.createElement('div'),
    	hotelCartCnt = document.createElement('div'),
    	hotelCartNow = document.createElement('a'),
    	hotelCartClear = document.createElement('a');

    var hotelID = '',
    	hotelName = '',
    	hotelImg = '';

	// cart container
	$(hotelCartCnt).addClass('hotelCartCnt');
	$(hotelCartNow).addClass('hotelCartNow b-button b-button_primary sr_cta_button').text(CONF_TRANS.boxingNow);
    $(hotelCartClear).addClass('hotelCartClear').text(CONF_TRANS.clear);

    $(hotelCartClear).on('click', function(){
        lib.clearAllFavoriteHotels();
        reloadCurrentCart();
        $(CONST_SELECTOR.getBookingSel).find('.addtoPKBtn').removeClass('selected');
    });

	$(hotelCartNow).on('click', function(){
		console.log('== calling generatePKBoxing');
		var getFavHotels = lib.getFavoriteHotels(),
			getFavHotelAry = [];

		console.log('== getFavHotels', getFavHotels);
		for (var id in getFavHotels) {
			getFavHotelAry.push(id);
		}

		console.log('== getFavHotelAry', getFavHotelAry);
    	generatePKBoxing(getFavHotelAry);
        $(hotelCartCnt).hide();
	});

	// now cart default hotels via API
    var currentCart = {};
    var reloadCurrentCart = function(){
        currentCart = lib.getFavoriteHotels();
	    console.log('getFavoriteHotelsDefault', currentCart);
        $(hotelCartCnt).find('.hotelCartItem').remove();
    	for (var hotelsIndex in currentCart) {
	    	var hName = currentCart[hotelsIndex][0].name;
		    _addedHotelsInBoxingList(hName, hotelsIndex);
    	}
    }
    reloadCurrentCart();

    $(dom).addClass('booking-blur');

    $(hotelCartCnt).append(hotelCartNow);
    $(hotelCartCnt).append(hotelCartClear);
	$("body").append(dom).append(hotelCartCnt);
	$(CONST_SELECTOR.getBookingBlur).hide(); 

    $(CONST_SELECTOR.getBookingSel).each(function(){
		// add button
		var addtoPKBtn = document.createElement('div');

		// get current hotelID, hotelName, hotelImg
        if(!$(this).find(CONST_SELECTOR.getItemPhoto).attr('id')){
            return;
        }
		hotelID = $(this).find(CONST_SELECTOR.getItemPhoto).attr('id').replace('hotel_', '');
		hotelName = $(this).find(CONST_SELECTOR.getItemName).text().trim();
		hotelImg = $(this).find(CONST_SELECTOR.getItemImg).attr('src');

		$(addtoPKBtn).addClass('addtoPKBtn').attr('data-id', hotelID)
											.attr('data-title', hotelName)
											.attr('data-img', hotelImg)
                                            .html('<i class="fa fa-heart" aria-hidden="true"></i>');
		$(this).append(addtoPKBtn);

        if(currentCart[hotelID]){
            $(addtoPKBtn).addClass('selected');
        }
		
        $(CONST_SELECTOR.getAddedBtn).click(function(){
			var getClickDataID = $(this).attr('data-id'),
				getClickDataTitle = $(this).attr('data-title'),
				isExisted = !!currentCart[getClickDataID];

			if(isExisted){
                $(this).removeClass('selected');
                lib.removeFavoriteHotel(getClickDataID);
                reloadCurrentCart();
            }
            else{
                $(this).addClass('selected');
				// added addFavoriteHotel
				lib.addFavoriteHotel(getClickDataID, function(done){
					console.log("added hotel id", getClickDataID);
                    reloadCurrentCart();
				});
			}
		});
    });

	$(CONST_SELECTOR.getBookingSel).mouseenter(function(){
		// image blur 
		$(this).find(CONST_SELECTOR.getItemPhoto).addClass('targetPhoto').css(CONST_STYLING.setBlurStyling);

		// loading
		var hotelID = $(this).find(CONST_SELECTOR.getItemPhoto).attr('id').replace('hotel_', '');
		var loadingContainer = document.createElement('div'),
			skThreeBounce = document.createElement('div'),
			skBounce1 = document.createElement('div'),
			skBounce2 = document.createElement('div'),
			skBounce3 = document.createElement('div');
		
		$(skThreeBounce).addClass('sk-three-bounce');
		$(skBounce1).addClass('sk-child').addClass('sk-bounce1');
		$(skBounce2).addClass('sk-child').addClass('sk-bounce2');
		$(skBounce3).addClass('sk-child').addClass('sk-bounce3');

		$(skThreeBounce).append(skBounce1).append(skBounce2).append(skBounce3);
		$(loadingContainer).append(skThreeBounce);
		// clean up content
		$(CONST_SELECTOR.getBookingBlur).text('').append(loadingContainer);

		var getCache = _getFECache(hotelID);
		if (getCache) {
			_showComment(getCache);
		} else {
	    	// get hotel review
			lib.getHotelReviews(hotelID, function(data){
				if ((data.length === 1 && data[0].pros === '' && data[0].cons === '') || !data) {
					// zrp
					var notFoundText = document.createElement('div');
					$(CONST_SELECTOR.getBookingBlur).text('');
					$(notFoundText).addClass('notFoundText').text('Comment not Found')
					$(CONST_SELECTOR.getBookingBlur).append(notFoundText);
				} else if (data) {
					_putFECache(hotelID, data);
					_showComment(data);	
				}
			});
		}
		$(CONST_SELECTOR.getBookingBlur).show();
	}).mouseleave(function(){
		$(CONST_SELECTOR.getBookingBlur).hide();
		$(CONST_SELECTOR.getItemPhotoTarID).css(CONST_STYLING.cancelBlurStyling);
	});

    // create dom
    var dom = document.createElement("div");
    $("body").append(dom);


    //
    // === generate PK default ===
    //
    var getKeywordList = lib.getComparisonKeywords() || ['breakfast', 'parking', 'bathroom'];

    // init pkinput, pkdom
	var pkinput = document.createElement('div');
	var pkoverall = document.createElement('div');
	var pkdom = document.createElement('div');
    $(pkdom).addClass('pkdom');
    $(pkinput).addClass('pkinput');
    $(pkoverall).addClass('pkoverall');

	// imput dom
	var inputdom = document.createElement('input');
	inputdom.setAttribute("type", "text");
	inputdom.setAttribute("name", "find");
	inputdom.setAttribute("placeholder", "please input keyword for comment ...");

	$(inputdom).addClass('inputdom');

    $(pkinput).append(inputdom);

    // close btn
    var clsoedom = document.createElement('div');
    $(clsoedom).addClass('closebtn').append('<i class="fa fa-times  fa-lg" aria-hidden="true"></i>');

    $(pkoverall).append(clsoedom);
    $(clsoedom).on('click',function(){
    	$('.pkoverall').hide();
        $(hotelCartCnt).show();
    });

	// render standrad column
	var sectionDom = document.createElement('section'),
    	h4Dom = document.createElement('h4'),
    	ulDom = document.createElement('ul'),
    	defaultImgDom = document.createElement('div');

    $(sectionDom).attr('id', 'catepk').addClass('sectionDom').addClass('lift').addClass('plan-tier');
    $(h4Dom).append('ROUND');
    $(defaultImgDom).addClass('pkimg').addClass('empty');

    for (var index =0;index<getKeywordList.length;index++) {
    	var liDom = document.createElement('li');
    	liDom.append(getKeywordList[index]);
    	$(ulDom).addClass('defaultRound').append(liDom);
    }

    $(sectionDom).append(h4Dom).append(defaultImgDom).append(ulDom);
	$(pkdom).append(sectionDom);

	$(pkoverall).append(pkinput).append(pkdom).hide();
	$('body').append(pkoverall);

	// inputdom key press
    $('.inputdom').on('keypress', function (e) {
	  if (e.which == 13) {
	    var getKw = $(this).val();
	    var addCateliDom = document.createElement('li');
	    $(addCateliDom).addClass('contRound');

		$(addCateliDom).append(getKw);	
	    $('#catepk').find('ul').append(addCateliDom);

	    var getFavHotels = lib.getFavoriteHotels(),
			getFavHotelAry = [];

		for (var id in getFavHotels) {
			getFavHotelAry.push(id);
		}

	    for(var hotel=0;hotel<getFavHotelAry.length;hotel++) {
		    lib.getHotelKeywordReviews(getFavHotelAry[hotel], getKw, function(data){
		    	var gID = data.id,
		    		cons = data.data[getKw].cons.length,
					pros = data.data[getKw].pros.length;

				var addliDom = document.createElement('li');
                $(addliDom).addClass(getKw);

				var thumbs = '<i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>' + 
                                    '<span class="thumbs-cnt">' + pros + '</span>' +
                                    '<i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>' + 
                                    '<span class="thumbs-cnt">' + cons + '</span>';

                $(addliDom).append(thumbs);
				$('#' + gID).find('ul').append(addliDom);
		    });
		}

        lib.addComparisonKeyword(getKw);
	  }
	});

    var generatePKBoxing = function(hotelIdList) {
    	getKeywordList = lib.getComparisonKeywords();
    	$(pkoverall).show();
        

        var winHotels = {};
        // {
        //     query: {
        //         "hotel": id,
        //         "score": score
        //     }
        // }
        getKeywordList.forEach( function(ele, ind) {
            winHotels[ele] = {
                hotel: 0,
                score: -999
            };
        });
        
		// render all hotels
		for(var hotel=0;hotel<hotelIdList.length;hotel++) {
			var currHotel = hotelIdList[hotel];

			lib.getHotelKeywordReviews(hotelIdList[hotel], getKeywordList, function(data){
				// console.log('== getHotelKeywordReviews', data);

				var sectionDom = document.createElement('section'),
			    	h4Dom = document.createElement('h4'),
			    	ulDom = document.createElement('ul'),
			    	imgDom = document.createElement('div'),
			    	imglinkDom = document.createElement('a'),
			    	linkDom = document.createElement('a');

			    var getHotelID = data['id'];

			    lib.getHotelInfo(getHotelID, function(hotelInfo){
					console.log('getHotelInfo',hotelInfo);

					var getHotelName = '',
						getUrl = hotelInfo[0].url,
						getPhotoUrl = hotelInfo[0].photos[0].url_max300,
						getHotelIDc = '';

					if (hotelInfo[0]) {
						getHotelName = hotelInfo[0].name;
						getHotelIDc = hotelInfo[0].hotel_id;
					}

					$(linkDom).attr('href', getUrl)
							  .attr('target', '_blank')
							  .append(getHotelName);

					$(imgDom).addClass('pkimg').css("background-image", "url(" + getPhotoUrl + ")");


					$(imglinkDom).attr('href', getUrl)
							  	 .attr('target', '_blank')
							  	 .append(imgDom);

					$(sectionDom).attr('id', getHotelIDc).addClass('sectionDom').addClass('lift').addClass('plan-tier').addClass('cont');
				    $(h4Dom).append(linkDom);

					for(var point=0;point<getKeywordList.length;point++) {
						//console.log('target', data.data[getKeywordList[point]]);
                        var kw = getKeywordList[point];
                        var currScore = data.data[kw].score;

                        // console.log(kw);
                        // console.log(getHotelIDc);
                        // console.log(winHotels[kw].score);
                        // console.log(currScore);
                        if (currScore) {
                            // console.log(winHotels[kw].score);
                            if (winHotels[kw].score<currScore) {
                                winHotels[kw] = {
                                    "hotel": getHotelIDc,
                                    "score": currScore
                                };  
                            }
                        }

						var cons = data.data[kw].cons.length;
						var pros = data.data[kw].pros.length;	

						var liDom = document.createElement('li');
                        $(liDom).addClass(data.data[kw].query);

                        var thumbs = '<i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>' + 
                                        '<span class="thumbs-cnt">' + pros + '</span>' +
                                        '<i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>' + 
                                        '<span class="thumbs-cnt">' + cons + '</span>';

                        $(liDom).append(thumbs);
					    $(ulDom).append(liDom);
					}

                    // give medal
                    // giveMedal(winHotels, getKeywordList);
                    console.log(winHotels);
                    getKeywordList.forEach( function(ele, ind) {
                        var id = winHotels[ele].hotel;
                        if (id != 0) {
                            //console.log("#" + id + " ." + ele);
                            // console.log($("#" + id + " ." + ele));
                            //console.log($("#" + id ));
                            var img = chrome.extension.getURL("images/medal.png");
                            var medal = "<img src='" + img + "' class='medal' width='30'>";
                            $("#" + id + " ." + ele).prepend(medal);
                        }
                    });

					$(sectionDom).append(h4Dom).append(imglinkDom).append(ulDom);
					$(pkdom).append(sectionDom);
				});
			});
		}
    }
    
    // popup init
    commentPopupInit();

    // hover show popup
    $(".pkoverall").on("mouseenter", ".fa-thumbs-up", function(e){
    	var getX = e.clientX || 0,
    		getY = e.clientY || 0;
        setCommentPopup($(this), "pros", getX, getY);
    });

    $(".pkoverall").on("mouseenter", ".fa-thumbs-down", function(e){
    	var getX = e.clientX || 0,
    		getY = e.clientY || 0;
        setCommentPopup($(this), "cons", getX, getY);
    });
});
})();
