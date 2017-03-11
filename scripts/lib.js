function BDCLib(){
    var _store = {
        cache: {},
        favorite: {}
    };
    var _getCache = function(url){
        if(_store.cache[url]){
            return _store.cache[url];
        }
        return null;
    };
    var _putCache = function(url, content){
        if(content){
            _store.cache[url] = content;
        }
    };
    var _debug = function(){
        var arr = Array.prototype.slice.call(arguments);
        arr.unshift('libDebug');
        console.log.apply(null, arr);
    };

    var exports = {};
    exports.requestBookingDotCom = function(method, params, cb){
        var url = 'https://distribution-xml.booking.com/json/bookings.' + method + '?';
        params = Object.assign({
            languagecode: 'en',
            rows: '1000'
        }, params);
        for(var key in params){
            url += key + '=' + encodeURIComponent(params[key]) + '&';
        }
        
        _debug('curl', url, $.ajax);
    
        var cacheData = _getCache(url);
        if(cacheData){
            _debug('use cache');
            cb(cacheData);
            return;
        }
    
        $.ajax({
            url: url,
            dataType: "json",
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "Basic " + btoa("hacker234:8hqNW6HtfU"));
            }
        }).done(function(data){
            _putCache(url, data);
            cb(data);
        });
    }
    
    exports.getHotelInfo = function(hotelId, cb){
        exports.requestBookingDotCom('getHotels',
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
    
    exports.getHotelReviews = function(hotelId, cb){
        exports.requestBookingDotCom('getBookingcomReviews',
            {
                hotel_ids: hotelId,
                show_review_score_word: '1'
            }, cb);
    };

    exports.getHotelKeywordReviews = function(hotelId, query, cb){
        exports.getHotelReviews(hotelId, function(reviews){
            var result = {
                score: 0,
                pros: [],
                cons: []
            };
            var fieldProfile = {
                pros: 1,
                cons: -1
            };
            var isMatchKeyword = function(text, query){
                var re = new RegExp(query, 'i');
                return !!text.match(re);
            };
            var review;
            var ageYears;
            var now = new Date();
            var matchedReviewCount = 0;
            for(var i = 0; i < reviews.length; i++){
                review = reviews[i];
                for(var field in fieldProfile){
                    if(review[field] && isMatchKeyword(review[field], query)){
                        matchedReviewCount++;
                        result[field].push({
                            text: review[field],
                            date: review.date,
                            title: review.headline,
                            author: review.author
                        });
                        ageYears = (now.getTime() - (new Date(review.date)).getTime()) / (86400000 * 365);
                        result.score += fieldProfile[field] / ageYears;
                    }
                }
            }
            result.score /= matchedReviewCount;
            cb(result);
        });
    };
    
    exports.debug = function(){
        //exports.getHotelInfo('725241', function(data){_debug('get info', data)});
        //exports.getHotelReviews('725241', function(data){_debug('get reviews', data)});

        // cache test
        //setTimeout(function(){
        //    exports.getHotelInfo('725241', function(data){_debug('get info', data)});
        //    exports.getHotelReviews('725241', function(data){_debug('get reviews', data)});
        //}, 5000);
        //
        
        // favorite hotel test
        //exports.addFavoriteHotel('725241', function(){
        //    _debug('favorite list:', exports.getFavoriteHotels());
        //    exports.removeFavoriteHotel('725241');
        //    _debug('favorite list:', exports.getFavoriteHotels());
        //});

        //exports.getHotelKeywordReviews('725241', 'breakfast', function(data){_debug('keyword review', data);});

        //福華
        //exports.getHotelKeywordReviews('270817', 'breakfast', function(data){_debug('keyword review', data);});
        //喜來登
        //exports.getHotelKeywordReviews('334583', 'breakfast', function(data){_debug('keyword review', data);});
        // Canal House Suites at Sofitel Legend The Grand Amsterdam 
        //exports.getHotelKeywordReviews('1279339', 'breakfast', function(data){_debug('keyword review', data);});
        // Crane Hotel Faralda
        //exports.getHotelKeywordReviews('1139273', 'breakfast', function(data){_debug('keyword review', data);});
    };

    exports.addFavoriteHotel = function(hotelId, done){
        if(_store.favorite[hotelId]){
            _debug('warning: duplicate favorite hotel ID ' + hotelId);
            return false;
        }
        _store.favorite[hotelId] = true;
        exports.getHotelInfo(hotelId, function(data){
            _store.favorite[hotelId] = data;
            if(done){
                done(data);
            }
        });
        return true;
    };
    
    exports.removeFavoriteHotel = function(hotelId){
        if(!_store.favorite[hotelId]){
            _debug('warning: not found favorite hotel ID ' + hotelId);
            return false;
        }
        delete _store.favorite[hotelId];
        return true;
    };
    
    exports.getFavoriteHotels = function(){
        return _store.favorite;
    };
    
    return exports;
};
