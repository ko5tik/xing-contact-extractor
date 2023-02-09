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
            console.log('[received]: ', label, ' => ', arguments[2])
            callback.apply(undefined, arguments[2]);
        });
    }

    function GM_sendMessage(label) {
        console.log('send:', label, ' => ', Array.from(arguments).slice(1))
        GM_setValue(label, Array.from(arguments).slice(1));
    }

    /**
     * process incoming contact on the linked in side
     * @param contacts
     */
    const liProcessIncomingContacts = function (contacts) {
        console.log('[LI] contacts received =>', contacts)

        // open all  contacts asynchronously until they are leaded
        const toHandler = function () {
            // do some stuff
            let elem = $('button.scaffold-finite-scroll__load-button').get(0);
            if (elem) {
                //  element is there, scroll
                elem.click();
                console.log('[LI] scrolling....');
                setTimeout(arguments.callee, 1000);
            } else {
                //  we scrolled to bottom
                console.log('[LI] scrolling done crete UI');
                window.scrollTo(0, 0)

                var contactPanel = $("<div/>", {
                    css: {
                        "position": "absolute",
                        "top": 50,
                        "right": 0,
                        "border": "1px solid #000",
                        'height': 300,
                        'overflow-y': 'auto',
                        "padding": "5px",
                        "z-index": "100",
                        "background-color": "#eb9813"
                    }
                });

                var list = $('<ul/>', {
                    css: {
                        'list-style': 'none',
                        'padding': 3,
                        'font-size': '10px',
                        'text-align':'left'
                    }
                })

                contacts.forEach((name) => {
                    if(name.length > 1  && !document.body.textContent.includes(name)) {
                        list.append($('<li/>').text(name));
                    } else {
                        console.log('[LI] skip name:' , name);
                    }
                })

                //  we have complete list now filter it
                //let  remaining = contacts.filter((name) => {
                //    console.log('contains ' , name , '=>' , document.body.textContent.includes(name));
                //    let result = name.length > 1 && !document.body.textContent.includes(name);
                //    return result;
                //});

                contactPanel.append(list)
                $('body').append(contactPanel);
            }


        }
        setTimeout(toHandler, 3000);
    }

    /**
     * laod all contacts from xing page,  then stire it into variable
     */
    const xingLoadContacts = function () {

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

        //  remove extracted contacts in case  so event will be trigegred
        GM_setValue(extractedContacts, '');

        GM_onMessage(extractedContacts, function (src, message) {
            console.log('[LI] contact data recieved ' + message);
            liProcessIncomingContacts(src, message);
        });

        console.log('[LI] listener in place')
        // initialise button to start the prrocess
        var button = document.createElement("Button");
        button.innerHTML = "XING Importieren";

        button.style = "top:0;left:0;position:absolute;z-index: 9999; background: #eb9813; font-size: 16px; border-style: solid black;  justify-content: center; padding: calc(.875rem - 1px) calc(1.5rem - 1px);"
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
            xingLoadContacts();
        }


    }

})
();