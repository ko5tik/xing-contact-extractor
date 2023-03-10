// ==UserScript==
// @name         XingExtractor
// @namespace    http://www.pribluda.de/
// @version      0.1
// @description  extract contact data from xing
// @match        https://www.xing.com/notifications/contacts
// @match        https://www.linkedin.com/mynetwork/invite-connect/connections/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @author       Konstantin Pribluda
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// ==/UserScript==


(function () {

    const xingContactPage = 'https://www.xing.com/notifications/contacts';
    const liContactsPage = ' https://www.linkedin.com/mynetwork/invite-connect/connections/';
    const liSearchUrl = 'https://www.linkedin.com/search/results/all/?keywords=';

    const doExtractXINGContacts = '_extract_XING_contacts';
    const extractedContacts = '_XING_contacts';

    /**
     * dismiss GUI on linked in
     */
    const liDismissGui = function () {
        // remove stored contact data  so GUI is not fired up again
        // until new import
        GM_setValue(extractedContacts, undefined);
    }

    /**
     * process incoming contact list on the linked in side
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

                // whip up some GUI
                var floatPanel = $('<div/>', {
                    css: {
                        "position": "absolute",
                        "top": 50,
                        "right": 0,
                        "border": "1px solid #000",
                        'height': 300,
                        "z-index": "100",
                        "background-color": "#eb9813"
                    }
                });
                $('body').append(floatPanel);

                var dismiss = $('<button/>').text('x dismiss').click(() => {
                    liDismissGui();
                    floatPanel.hide();
                });

                floatPanel.append(dismiss);

                var count = $('<div/>');
                floatPanel.append(count);

                var contactPanel = $("<div/>", {
                    css: {
                        'max-height': '100%',
                        'overflow-y': 'auto',
                        "padding": "5px",
                        "background-color": "#eb9813"
                    }
                });

                floatPanel.append(contactPanel)

                var list = $('<ul/>', {
                    css: {
                        'list-style': 'none',
                        'padding': 3,
                        'font-size': '10px',
                        'text-align': 'left'
                    }
                })

                let c = 0;
                const textContent = document.body.textContent.toLowerCase();
                contacts.forEach((name) => {
                    if (name.length > 1 && !textContent.includes(name.toLowerCase())) {
                        //  name has to be longer than 1 (those are alphabet separators)
                        //  and not contained on LI contact page
                        // TODO: link to import comes here
                        list.append($('<li/>').append($('<a/>', {
                            'href': liSearchUrl + name,
                            'target': '_blank'
                        }).text(name)));
                        c++;
                    } else {
                        console.log('[LI] skip name:', name);
                    }
                })

                count.text(c + ' Kontakte');

                contactPanel.append(list);


               //  we scrolled to bottom,   back to top
                console.log('[LI] scrolling done crete UI');
                window.scrollTo(0, 0)

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

                console.log(values);

                // store contacts and fire up importer page
                GM_setValue(extractedContacts, values)
                console.log('[XING] contacts saved. open LI')
                GM_openInTab(liContactsPage, {active: true});

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

        // initialise button to start the prrocess
        var button = document.createElement("Button");
        button.innerHTML = "XING Kontakte Importieren";

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

    //  initialisation
    if (window.location.href === 'https://www.linkedin.com/mynetwork/invite-connect/connections/') {
        console.log('[LI] on linkedin contact page')
        //  are there saved contact to import?
        var contacts = GM_getValue(extractedContacts)
        console.log('[LI] contacts:', contacts)
        if (contacts) {
            console.log('[LI]  importing contacts')

            //GM_setValue(extractedContacts, undefined)
            liProcessIncomingContacts(contacts)
        } else {
            console.log('[LI] no  contacts, create button')
            initLinkedIn();
        }
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