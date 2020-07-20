var brand_name = 'Brother';

var base_url      = window.location.href;


chrome.storage.sync.get('productDetail', function (storage) {
    if ( storage.productDetail == true && storage.baseURL != ''  ) {
        base_url = storage.baseURL;
        console.log("product detail page landed");
        var productinfo  = [];
        productinfo.push({"product_name" : $(".product_page_wrap").find(".product_info").children("h1").text()});
        productinfo.push({ "product_image" : $(".product_page_wrap").find("figure").children("a").attr("href")});
        var productColors = [];
        $(".product_info").find("img").each(function (index) {
           productColors.push(  $(this).attr("alt") );
        })
        productinfo.push({ "regular_price" : $(".old-price").find(".price").text() });
        productinfo.push({ "sale_price" : $(".special-price").find(".price").text() });
        productinfo.push({ "short_description" : $(".ldp-short-description").text() });
        console.log("-------Product info------------- ")
        console.log(productinfo)
        console.log("-------Product info------------- ")
        var specs = [];
        var specification = $(".specifications").find("tr");
        $.each(specification , function ( index ) {
            var th = $(this).find("th").text();

            var td = $(this).find("td").text();
            var attrName = th;
            if ( th == 'SKU') {
                specs.push({
                    "SKU": td
                });
            }
            if ( th == 'Printer Brand') {
                specs.push({
                    "Printer Brand": td
                });
            }
            if ( th == 'OEM Number') {
                specs.push({
                    "OEM Number": td
                });
            }
            if ( th == 'Ink Color') {
                specs.push({
                    "Ink Color": td
                });
            }
            if ( th == 'Cartridge Yield Type') {
                specs.push({
                    "Cartridge Yield Type": td
                });
            }
            if ( th == 'Page Yield') {
                specs.push({
                    "Page Yield": td
                });
            }
            if ( th == 'Cost Per Page') {
                specs.push({
                    "Cost Per Page": td
                });
            }
            if ( th == 'Shelf Life') {
                specs.push({
                    "Shelf Life": td
                });
            }
        });
        console.log("-------Product specs------------- ")
        console.log(specs);
        console.log("-------Product specs------------- ");

        var products_data = $.merge(productinfo , specs );

        console.log(products_data);
        // Ajax Request To Insert Parent Categories

        setTimeout(function () {
            let site_url = 'https://tonerbird.com/';

            $.ajax({
                url: site_url + "wp-json/tonerbird/v1/products",
                method: "POST",
                data: JSON.stringify( products_data ),
                contentType: "application/json",
                dataType: "json"
            }).done(function (resp) {
                console.log(resp);
                console.log("Product Successfully inserted!!!!!");
                window.location.href = base_url;
            });

        }, 3000);


    }
});


chrome.storage.sync.get(['startScrape', 'brand'] , function ( storage) {


    if ( storage.startScrape == true && storage.brand  != '' ) {
        // Scrape Printer Family

        chrome.storage.sync.get('parentCatActive', function (storage) {

            if (storage.parentCatActive == true) {
                var pcategories = [];
                var parentCatLength = $(".products-grid").find(".printer-set").length;
                for (var i = 0; i < parentCatLength; i++) {
                    var pCategory = $(".products-grid").find(".printer-set").eq(i);
                    $(pCategory).each(function (index) {
                        var url = $(pCategory).find("h3").children("a").attr("href");
                        console.log(url);
                        var category = $(pCategory).find("h3").children("a").text();
                        console.log(category);
                        pcategories.push({"url": url, "category": category, "parentCategory": brand_name});
                    });
                }
                console.log(pcategories);

                // Ajax Request To Insert Parent Categories

                setTimeout(function () {
                    let site_url = 'https://tonerbird.com/';

                    $.ajax({
                        url: site_url + "wp-json/tonerbird/v1/prod_parent_cat",
                        method: "POST",
                        data: JSON.stringify(pcategories),
                        contentType: "application/json",
                        dataType: "json"
                    }).done(function (resp) {
                        console.log(resp);
                        console.log("parent category inserted");
                    });

                }, 3000);

            }
        });

        // Scrape Printer Model

        chrome.storage.sync.get("childCatActive", function (storage) {

            if (storage.childCatActive == true) {
                var child_categories = [];
                var childCatLength = $(".products-grid").find("li").length;
                console.log(childCatLength);
                for (var j = 0; j < childCatLength; j++) {
                    var cCategory = $(".products-grid").find("li").eq(j);
                    console.log(cCategory);
                    $(cCategory).each(function (index) {
                        var cUrl = $(this).find("a").attr("href");
                        console.log(cUrl);
                        var cCategoryName = $(this).find("a").text();
                        console.log(cCategoryName);
                        child_categories.push({
                            "url": cUrl,
                            "category": cCategoryName,
                            parentCategory: "MFC MultiFunction Printers"
                        });
                    });
                }
                console.log(child_categories);

                // Ajax Request To Insert Parent Categories

                setTimeout(function () {
                    let site_url = 'https://tonerbird.com/';

                    $.ajax({
                        url: site_url + "wp-json/tonerbird/v1/prod_parent_cat",
                        method: "POST",
                        data: JSON.stringify(child_categories),
                        contentType: "application/json",
                        dataType: "json"
                    }).done(function (resp) {
                        console.log(resp);
                        console.log("parent category inserted");
                    });

                }, 3000);
            }

        });

        // Scrape Printer Products

        chrome.storage.sync.get('productActive', function (storage) {

            if (storage.productActive == true) {
                var currentUrl = window.location.href;
                // Count List Products
                var printersLength = $(".printer-list-item").length;

                chrome.storage.sync.get('index', function (storage) {
                    console.log(storage.index);
                    if (storage.index < printersLength) {
                        var printer = $(".printer-list-item").eq( storage.index );
                        console.log(printer);
                        var count = 0;
                        $(printer).each(function (index) {
                            var printer_detail = $(printer).find("h3").children("a").attr("href");
                            console.log(printer_detail);
                            count++;
                            chrome.storage.sync.set({"index" : count , "baseURL" : base_url , "productActive" : false , "productDetail" : true })
                            window.location.href = printer_detail;
                        });
                    }
                })

            }
        });

    }
});

function start_scrape()
{
    chrome.storage.sync.get('countParentCat', function (storage) {
        if ( storage.countParentCat <= 0 ){
            console.log("All Brands Categories Products Scrapped!")
        }
    })
    if ( brand_name != '' ) {
        // chrome.storage.sync.set({ currentBrand: brand_name});
        // chrome.storage.sync.set({ countParentCat: parentCatLength});
        // var parentCatName = parentCatLength.find("h3").children("a").text();
        // var parentCatUrl = parentCatLength.find("h3").children("a").attr("href");

        /**
         *  Printer Family Category Insert
         * **/

            chrome.storage.sync.get(["parentCatActive" , "childCatActive" , "productActive"] , function ( storage ) {
                    if ( storage.parentCatActive == true ){
                        var pcategories = [];
                        var parentCatLength = $(".products-grid").find(".printer-set").length;
                        for (var i = 0; i < parentCatLength; i++) {
                            var pCategory = $(".products-grid").find(".printer-set").eq(i);
                            $(pCategory).each(function (index) {
                                var url = $(pCategory).find("h3").children("a").attr("href");
                                console.log(url);
                                var category = $(pCategory).find("h3").children("a").text();
                                console.log(category);
                                pcategories.push({"url": url, "category": category , "parentCategory" : brand_name });
                            });
                        }
                        console.log( pcategories );

                        // Ajax Request To Insert Parent Categories

                        setTimeout(function () {
                            let site_url = 'https://tonerbird.com/';

                            $.ajax({
                                url: site_url + "wp-json/tonerbird/v1/prod_parent_cat",
                                method: "POST",
                                data: JSON.stringify(pcategories),
                                contentType: "application/json",
                                dataType: "json"
                            }).done(function (resp) {
                                console.log(resp);
                                console.log("parent category inserted");
                            });

                        }, 3000);

                    }

                    if ( storage.childCatActive == true ) {
                        var child_categories = [];
                        var childCatLength = $(".products-grid").find("li").length;
                        console.log(childCatLength);
                        for (var j = 0; j < childCatLength; j++) {
                            var cCategory = $(".products-grid").find("li").eq(j);
                            console.log(cCategory);
                            $(cCategory).each(function (index) {
                                var cUrl = $(this).find("a").attr("href");
                                console.log(cUrl);
                                var cCategoryName = $(this).find("a").text();
                                console.log(cCategoryName);
                                child_categories.push({"url": cUrl, "category": cCategoryName , parentCategory : "MFC MultiFunction Printers"});
                            });
                        }
                        console.log( child_categories );

                        // Ajax Request To Insert Parent Categories

                        setTimeout(function () {
                            let site_url = 'https://tonerbird.com/';

                            $.ajax({
                                url: site_url + "wp-json/tonerbird/v1/prod_parent_cat",
                                method: "POST",
                                data: JSON.stringify(child_categories),
                                contentType: "application/json",
                                dataType: "json"
                            }).done(function (resp) {
                                console.log(resp);
                                console.log("parent category inserted");
                            });

                        }, 3000);
                    }

                    if ( storage.productActive == true ) {
                        var currentUrl = window.location.href;
                        // Count List Products
                        var printersLength = $(".printer-list-item").length;

                        chrome.storage.sync.get('index',function ( storage ) {
                            if ( storage.index < printersLength ) {
                                var printer = $(".printer-list-item").eq(0);
                                var count = 0;
                                $( printer ).each(function( index ) {
                                    var printer_detail = $(printer).find("h3").children("a").attr("href");
                                    window.location.href = printer_detail;

                                });
                            }

                            else{
                                alert("All product scraped!");
                            }
                        })

                    }
            });

            // console.log(categories);

            // for ( var i = 0 ; i < childCategoriesLength ; i++ ) {
            //     var childCategory = $(this).find("li");
            //     console.log ( childCategory );
            //     // $( parentCategory ).each(function( index ) {
            //     //     console.log ( "----------------" );
            //     //     console.log ( "Child Categories" );
            //     //     console.log ( "----------------" );
            //     //     var url = $(this).find("h3").children("a").attr("href");
            //     //     var category = $(this).find("h3").text();
            //     //     // console.log ( $(this).find("h3").children("a").attr("href") );
            //     //     // console.log ( $(this).find("h3").text() );
            //     //     categories.push({"url" : url , "category" : category})
            //     //    // var childCategoriesLength = $(this).find("li").length;
            //     //    // console.log(childCategoriesLength);
            //     //    //  for ( var j = 0 ; j < childCategoriesLength ; j++ ) {
            //     //    //      var childCategories = $(this).find("li").eq(j);
            //     //    //      console.log(childCategories);
            //     //    //      $( childCategories ).each(function( index ) {
            //     //    //          console.log ( "----------------" );
            //     //    //          console.log ( "Child Category" );
            //     //    //          console.log ( "----------------" );
            //     //    //          console.log ( $(this).children("a").text() );
            //     //    //          console.log ( "----------------" );
            //     //    //          console.log ( "Category Url" );
            //     //    //          console.log ( "----------------" );
            //     //    //          console.log ( $(this).children("a").attr('href') );
            //     //    //      });
            //     //    //  }
            //     // });
            // }

            // console.log(categories);

            // Ajax Request To Insert Parent Categories

            // setTimeout(function () {
            //     let site_url = 'https://tonerbird.com/';
            //
            //     $.ajax({
            //         url: site_url + "wp-json/tonerbird/v1/products",
            //         method: "POST",
            //         data: JSON.stringify(categories),
            //         contentType: "application/json",
            //         dataType: "json"
            //     }).done(function (resp) {
            //         console.log(resp);
            //     });
            //
            // }, 3000);

    }


}
    
// function scrapUrl(url, id)
// {
//     if(url)
//     {
//
//       $('[data-bukken-no='+id+']').children('div.scraping-container').removeClass('hide').html(loading);
//
//         $.ajax({
//             'url': url,
//             'type': 'get',
//             'cache': !1,
//             'dataType': 'html'
//             'dataType': 'html'
//         }).done(function(resp){
//
//             var data = {};
//             data.data = [];
//             data.images = [];
//
//            $(resp).find('.image-wrap').find('ul').children('li').each(function(i, li){
//                 let img = $(li).children('span.image-data').children('img').attr('src');
//
//                img = img.replace('?width=386&height=386&margin=true', '');
//                //img = img.replace('width=386', 'width=640');
//                //img = img.replace('height=386', 'height=640');
//                 img = SITE_URL + img;
//                 data.images.push(img);
//            });
//
//            $(resp).find('#item-detail_data').find('table').each(function(){
//
//                 let keys =  [];
//                 let     values  = [];
//                 $(this).find('tr').children('th').each(function(){
//                     keys.push(this.innerText.trim());
//                 });
//
//                 $(this).find('tr').children('td').each(function(){
//
//
//                     //let v = $(this).clone()    //clone the element
//                     //                .children() //select all the children
//                     //                .remove()   //remove all the children
//                     //                .end()  //again go back to selected element
//                     //                .text();
//                     var v = $(this);
//                     v.find('a').remove();
//                     v =  v[0].innerText;
//                     v = v.replace('（電車ルート案内）', '');
//                     v = v.replace('大阪市都島区の価格 相場', '');
//                     v = v.replace('野江内代駅の価格 相場','');
//                     v = v.replace('（）', '');
// //                    v = v.replace(/\s/g, '');
//                     v = v.replace(/^\s+/g, '');
//                     v = v.replace(/\s+$/g, '');
//
//                     values.push(v);
//                 });
//
//                 for(x=0;x<keys.length;x++)
//                 {
//                     var o = {};
//                     o.key = keys[x];
//                     o.value = values[x];
//
//                     data.data.push(o);
//
//                     // location
//                     if(o.key == '所在地'){
//
//                         $.ajax({
//                             'url': 'https://maps.google.com/maps/api/geocode/json?address='+ o.value+'&sensor=false&region=japan&key=AIzaSyAuN0Ov7wDMX28lOPfCdzz1dmOkRPuncpM',
//                             'type': 'get',
//                             'cache': !1,
//                             'dataType': 'json'
//                         }).done(function(resp){
//                             //console.log(resp);
//                             var lat = resp.results[0].geometry.location.lat;
//                             var lng = resp.results[0].geometry.location.lng;
//
//                             data.data.push({key:'latlng', value: lat+','+lng});
//
//                         });
//                     }
//                 }
//
//            });
//             //let district = $($(resp).find('ul#breadcrumbs li')[4]).text().replace(/\s/g, '').replace('>', '');
//             data.data.push({key:'district', value: district});
//             setTimeout(function(){
//                 let site_url = 'http://localhost/trusty-group-hkjp/';
//
//                 $.ajax({
//                     url: site_url+"wp-json/myhome/v1/estates/save_athome",
//                     method: "POST",
//                     data: JSON.stringify(data),
//                     contentType: "application/json",
//                     dataType: "json"
//                 }).done(function( resp ) {
//                     console.log( resp );
//
//                     // check if product detail page has not loaded
//                     if($.isEmptyObject(resp)){
//                         chrome.storage.sync.set({'reload': true, 'index': index, 'count': count});
//                         window.location.reload();
//                     }
//                     console.log(resp);
//
//                     $('[data-bukken-no='+id+']').children('div.scraping-container').removeClass('hide').html(loaded);
//
//
//                     index++;
//                     count++;
//                       toScrap();
//                 });
//
//             },3000);
//
//
//         });
//     }
// }



// chrome.storage.sync.get(['startScrap', 'reload', 'index', 'count','currentCity', 'district', 'district_key', 'totalPages', 'pageNo'], function( storage ){
//
//     console.log(storage);
//
//     if(storage.reload == true && storage.startScrap == true && storage.index > -1 && storage.count >= 0){
//         console.log('zaheer bashir');
//         index = storage.index;
//         reload = storage.reload;
//         startScrap = storage.startScrap;
//         count = storage.count;
//         currentCity = storage.currentCity;
//         district = storage.district;
//         district_key = storage.district_key;
//
//         start();
//     }
//     else {
//         console.log('new one one');
//     }
// });


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log('runtime');
    if(request.todo == "startScrap") {
        console.log("start scrape ");
        chrome.storage.sync.set({'startScrape' : true , 'brand': 'Brother' ,'parentCatActive': false , 'childCatActive': false , 'productActive' : true , 'productCategory' : "MFC-210C" , 'index' : 0 });
        window.location.reload();
    }

});

// chrome.storage.sync.set({'currentCity': currentCity, 'district': district, 'district_key': district_key, 'totalPages': 0, 'pageNo': 1, 'index': 0, 'count': 1, 'reload': false});







