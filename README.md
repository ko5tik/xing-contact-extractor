## XING Kontakte  in die LinkedIN importieren

Da XING die Foren eingestellt hat, gibts es einen guten Grund die Kontakte jetz auf LinkedIn zu pflegen.  Dies kleine 
UserScript hilft dabei die Kontakte zu migrieren. 

### Garantie

Es gibt keine. Benutzung auf eigene Gefahr. 

### Datenschutz

Skript selbst sammelt keine Daten. Es liest die Kontakt-Daten aus Ihrem Account bei XING aus, und versucht diese bei 
LinkedIn zu importieren, sofern diese noch nicht da sind. Diese Daten werden lokal gespeichert und werden entfernt, nachdem man auf **dismiss**-Button gedr&uuml;ckt hat. 

### Wie funtkioniert es

0.  Quellcode Review machen

     Sie sollen keine UserScripts installieren wens sie nicht sicher sind. Bitte schauen sie sich [die Quellcode an](https://github.com/ko5tik/xing-contact-extractor/blob/main/src/extractor.user.js).
     Es öffnet neue Tabs von XING und LinkedIn, und liest die darin vorhandene Daten aus. Es werden Ihre aktuell gespeicherte Login-Daten verwendet. Liste der XING-Kontakte wird lokal gespeichert und später entfernt.    
1.  Tampermonkey installieren

     Das ist ein Script-Mmanager Plugin für Browser.  (https://www.tampermonkey.net/)
2.   Script installieren 

     (https://raw.githubusercontent.com/ko5tik/xing-contact-extractor/main/src/extractor.user.js)
3. Kontakt Seite von LI aufrufen

     (https://www.linkedin.com/mynetwork/invite-connect/connections/)
4. Orangenes Button betätigen

Folgendes sollte danach passieren:

- XING-Kontaktseite wird aufgemacht, und gescrollt bis zum Ende. Dabei werden die Kontakte ausgelesen. (Kann dauern, wenn es viele Kontakte sind)
- Kontaktseite von Linked-In wird aufgemacht, und nach unten bis zum Ende durchgescrollt. Dabei werden die Kontaktnamen abgeglichen. Die, die schon bei LinkedIn vorhanden sind, werden ausgefiltert (Kann dauern,  wenn es sehr viele sind) 
- Eine Liste mit Kontakten von XING, die nicht bei LinkedIn gefunden wurdern wird angezeigt. Auf die Links klicken und suchen (Suche öffnet sich in einen neuen Tab)


### Bei Problemen

Sollte es yu Problemen kommen, bitte mich kontaktieren. Und Konsolen-Ausgabe zukommen lassen.


###  Kan mann noch ....

Klar kann man es - Ich kann auch eine spezifische L&ouml;sung entwicklen, um Daten aus anderen Quellen yu lesen und in anderen Form darzustellen. Ich Entwickle Software. Einfach mich ansprechen.       

