function BDCLib(){
};

BDCLib.prototype.requestBookingDotCom = function(method, params, cb){
    var url = 'https://distribution-xml.booking.com/json/bookings.' + method + '?';
    params = Object.assign({
        languagecode: 'en',
        rows: '1000'
    }, params);
    for(var key in params){
        url += key + '=' + encodeURIComponent(params[key]) + '&';
    }
    console.log('curl', url, $.ajax);
    $.ajax({
        url: url,
        dataType: "json",
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Basic " + btoa("hacker234:8hqNW6HtfU"));
        }
    }).done(cb);
}

BDCLib.prototype.getHotelInfo = function(hotelId, cb){
    this.requestBookingDotCom('getHotels',
        {
            hotel_ids: hotelId,
            show_facilities: '1',
            show_hotel_center: '1',
            show_hotel_themes: '1',
            show_languages_spoken: '1',
            show_review_score_word: '1',
            show_timezone: '1'
        }, cb);
};

BDCLib.prototype.getHoteReviews = function(hotelId, cb){
    this.requestBookingDotCom('getBookingcomReviews',
        {
            hotel_ids: hotelId,
            show_review_score_word: '1'
        }, cb);
};

BDCLib.prototype.debug = function(){
    this.getHotelInfo('725241', function(data){console.log('ok info', data)});
    this.getHoteReviews('725241', function(data){console.log('ok reviews', data)});
};

