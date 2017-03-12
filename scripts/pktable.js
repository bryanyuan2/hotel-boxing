// var PKCONST = {
//     hotelList: [],
//     kwList: []
// }

function generatePkTable(){
    
    $.get(chrome.extension.getURL('view/pktable.html'), function(data) {

        // $($.parseHTML(data)).appendTo('body');

    });

}

function commentPopupInit(){
    $.get(chrome.extension.getURL('view/popup-comment.html'), function(data) {
        $($.parseHTML(data)).appendTo('.pkdom');
    });

    console.log('popup init');
}

function setCommentPopup(lib, id, kw, type){
    var id = "733981";
    var kw = "service";
    var type = "pros"; // "pros" or "cons"

    $(".popup-contanier ul").empty();
    lib.getHotelKeywordReviews(id, kw, function(data){
        var comments = data.data[kw][type];
        comments.forEach( function(ele, ind) {
            var cn = $(".popup-contanier li").clone(true);
            var comment = ele.text;
            console.log(comment);
            cn.append(comment);
            $(".popup-contanier ul").append(cn);
        });

    });
}
