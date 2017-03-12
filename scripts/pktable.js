// var PKCONST = {
//     hotelList: [],
//     kwList: []
// }

var TEMPLATE = {
    "CommentLi": ""
}

function generatePkTable(){
    
    $.get(chrome.extension.getURL('view/pktable.html'), function(data) {

        // $($.parseHTML(data)).appendTo('body');

    });

}

function commentPopupInit(){
    $.get(chrome.extension.getURL('view/popup-comment.html'), function(data) {
        $($.parseHTML(data)).appendTo('.pkoverall');
        TEMPLATE.CommentLi = $(".popup-contanier li:first-child").empty().clone(true);
    });

    console.log('popup init');
}

function setCommentPopup(obj, type){
    // var type = "pros"; // "pros" or "cons"

    var id = obj.closest("section").attr("id");
    var kw = [ obj.parent().attr("class") ];

    $(".popup-contanier ul").empty();
    lib.getHotelKeywordReviews(id, kw, function(data){
        var comments = data.data[kw][type];
        comments.forEach( function(ele, ind) {
            if (ind > 5) return;
            var tmpcn = TEMPLATE.CommentLi.clone(true);
            var comment = ele.text;
            tmpcn.append(comment);
            $(".popup-contanier ul").append(tmpcn);
        });

    });
}


function giveMedal(){

}
