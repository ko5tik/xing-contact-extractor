// ==UserScript==
// @name         XingExtractor
// @namespace    http://www.pribluda.de/
// @version      0.1
// @description  extract contact data from xing
// @match        https://www.xing.com/notifications/contacts
// @match        https://www.linkedin.com/mynetwork/invite-connect/connections/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @author       Konstantin Pribluda
// @grant        none
// ==/UserScript==


(function () {

    const xingContactPage = 'https://www.xing.com/notifications/contacts';
    const doExtractXINGContacts = '_extract_XING_contacts';
    const extractedContacts = '_XING_contacts';

    function GM_onMessage(label, callback) {
        GM_addValueChangeListener(label, function () {
            console.log('received: ', label, ' => ', arguments[2])
            callback.apply(undefined, arguments[2]);
        });
    }

    function GM_sendMessage(label) {
        console.log('send:', label, ' => ', Array.from(arguments).slice(1))
        GM_setValue(label, Array.from(arguments).slice(1));
    }

    const processContacts = function (src, contacts) {
        console.log('[LI] ', src, '=>', contacts)
    }

    /**
     * laod all contacts from xing page
     */
    const loadContacts = function () {

        // asynchronously scroll  until element is not there anymore.
        //  then send message and terminate himself
        const toHandler = function () {
            // do some stuff
            let elem = $("*[data-qa=\"lazy-loader-loading-indicator\"]").get(0);
            if (elem) {
                //  element is there, scroll
                elem.scrollIntoView();
                console.log('[XING] scrolling....');
                setTimeout(arguments.callee, 1000);
            } else {
                console.log('got all entries,  retrieve')
                values = $("li[data-xds='ListItem'] div:not(.ceLLDS) >h2[data-xds='Headline']").map(function () {
                    return $(this).text()
                }).get()

                //values.push(Date.now())

                console.log(values)
                GM_sendMessage(extractedContacts, values)
                console.log('[XING] message sent')
                //  and close  himself
                window.close();
                console.log('[XING] window closed')
            }
        };

        setTimeout(toHandler, 3000);

    }

    const initLinkedIn = function () {
        console.log('[LI] init GUI');

        console.log('current;', GM_getValue(extractedContacts));
        GM_setValue(extractedContacts, '');

        GM_onMessage(extractedContacts, function (src, message) {
            console.log('[LI] contact data recieved' + message);
            processContacts(src, message);
        });

        console.log('[LI] listener in place')
        // initialise button to start the prrocess
        var button = document.createElement("Button");
        button.innerHTML = "Import";
        button.style = "top:0;left:0;position:absolute;z-index: 9999"
        button.onclick = () => {
            console.log("[LI] clicked!!!!!");

            // initialise value with 20 seconds in the future. this lag ought to be enough
            //  even in germany
            GM_setValue(doExtractXINGContacts, Date.now() + 20000)
            console.log('[LI] message sent');
            GM_openInTab(xingContactPage, {active: true});
        };
        document.body.appendChild(button);
    }


    console.log('main entry point');

    if (window.location.href === 'https://www.linkedin.com/mynetwork/invite-connect/connections/') {
        console.log('on linkedin contact page')
        initLinkedIn();
    } else if (window.location.href === 'https://www.xing.com/notifications/contacts') {
        console.log('[XING] on xing contact page. request is present:', GM_getValue(doExtractXINGContacts));


        // is there active request to import contacts,  and time is not elapsed
        if (GM_getValue(doExtractXINGContacts) > Date.now()) {
            console.log('[XING]  extracting');
            GM_setValue(doExtractXINGContacts, '');
            loadContacts();
        }


    }

})
();