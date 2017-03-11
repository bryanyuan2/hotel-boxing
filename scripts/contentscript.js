/*
    hackday-basic-chrome-ext for hackday usage
*/
(function() {

$(document).ready(function() {

    // get resource
    // var resource = chrome.extension.getURL("audio/test.mp3");

    // create dom
    var dom = document.createElement("div");
    $(dom).addClass("dom").text('test');
    $(body).append(dom) ;
    
});
})();



