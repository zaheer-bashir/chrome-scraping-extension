$(function(){
    $('#scrap').click(function(){
        chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {todo: "startScrap"})
        });
    });

    $('#resetParams').click(function(){
        chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {todo: "resetParams"})
        });
    });
});