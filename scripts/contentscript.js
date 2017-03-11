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