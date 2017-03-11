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
    
    exports.getHoteReviews = function(hotelId, cb){
        exports.requestBookingDotCom('getBookingcomReviews',
            {
                hotel_ids: hotelId,
                show_review_score_word: '1'
            }, cb);
    };
    
    exports.debug = function(){
        exports.getHotelInfo('725241', function(data){_debug('get info', data)});
        exports.getHoteReviews('725241', function(data){_debug('get reviews', data)});

        // cache test
        //setTimeout(function(){
        //    exports.getHotelInfo('725241', function(data){_debug('get info', data)});
        //    exports.getHoteReviews('725241', function(data){_debug('get reviews', data)});
        //}, 5000);
        //
        
        exports.addFavoriteHotel('725241', function(){
            _debug('favorite list:', exports.getFavoriteHotels());
            exports.removeFavoriteHotel('725241');
            _debug('favorite list:', exports.getFavoriteHotels());
        });
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

