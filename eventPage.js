chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if( request.todo == "pageScrapped" )
    {
        let notifOptions = {
            'type': 'basic',
            'iconUrl': '../icon16.png',
            'message': 'All listings of this page has beed scrapped!'
        }
        chrome.notifications.create('pageScrapNotif', notifOptions);
    }
});