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

    const extractXINGContacts = '_extract_XING_contacts';

    function GM_onMessage(label, callback) {
        GM_addValueChangeListener(label, function () {
            callback.apply(undefined, arguments[2]);
        });
    }

    function GM_sendMessage(label) {
        GM_setValue(label, Array.from(arguments).slice(1));
    }

    /**
     * laod all contacts from xing page
     */
    const loadContacts = function () {


        // asynchronously scroll  until element is not there anymore
        const toHandler = function () {
            // do some stuff
            let elem = $("*[data-qa=\"lazy-loader-loading-indicator\"]").get(0);
            if (elem) {
                //  element is there, scroll
                elem.scrollIntoView();
                console.log('scrolling....');
                setTimeout(arguments.callee, 3000);
            } else {
                console.log('got all entries,  retrieve')

            }
        };

        setTimeout(toHandler, 3000);

    }

    const initLinkedIn = function () {
        console.log('GUI initialised');

        //  create iframe for XING contacts page
        //const iframe = document.body.appendChild(document.createElement('iframe'));
        //iframe.style.display = 'none';
        //iframe.src = 'https://www.xing.com/notifications/contacts';

        //console.log('iframe created');

        // initialise button to start the prrocess
        var button = document.createElement("Button");
        button.innerHTML = "Import";
        button.style = "top:0;left:0;position:absolute;z-index: 9999"
        button.onclick = () => {
            console.log("clicked!!!!!");
            GM_sendMessage(extractXINGContacts)
            console.log('message sent');
        };
        document.body.appendChild(button);

    }


    console.log('main entry point');

    if (window.location.href === 'https://www.linkedin.com/mynetwork/invite-connect/connections/') {
        console.log('on linkedin contact page')
        initLinkedIn();
    } else if (window.location.href === 'https://www.xing.com/notifications/contacts') {
        console.log('on xing contact page. init message');
        GM_onMessage(extractXINGContacts, function (src, message) {
            console.log('[xing] load contact triggered' + message);
            loadContacts();
        });

        console.log('channel on message created')
    }

})
();