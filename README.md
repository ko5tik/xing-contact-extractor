## XING Kontakte  in die LinkedIN importieren

Da XING die Foren eingestellt hat, gibts es einen guten Grund die Kontakte jetz auf LinkedIn zu pflegen.  Dies kleine 
UserScript hilft dabei die Kontakte zu migrieren. 

### Garantie

Es gibt keine. Benutzung auf eigene Gefahr. 

### Datenschutz

Skript selbst sammelt keine Daten. Es sammelt die Kontakt-Daten aus Ihrem Account bei XING, und versucht diese bei 
LinkedIn zu importieren, sofern diese noch nicht da sind. 

### Wie funtkioniert es

0.  Quellcode Review machen

     Sie sollen keine UserScripts installieren wens sie nicht sicher sind. Bitte schauen si siech [die Quellcode an](https://github.com/ko5tik/xing-contact-extractor/blob/main/src/extractor.user.js).
     Es öffnet neue Tabs von XING und LinkedIn, und liest die darin vorhandene Daten aus. Es werden Ihre aktuell gespeicherte Login-Daten verwendet. Liste der XING-Kontakte wird lokal gespeichert und später entfernt.    
1.  Tampermonkey installieren

     Das ist ein Script-Mmanager Plugin für Browser.  (https://www.tampermonkey.net/)
2.   Script installieren 

     (https://raw.githubusercontent.com/ko5tik/xing-contact-extractor/main/src/extractor.user.js)
3. Kontakt Seite von LI aufrufen

     (https://www.linkedin.com/mynetwork/invite-connect/connections/)
4. Orangenes Button betätigen

Liste von Kontakten erscheint danach rechts oben. Einfach auf Namen clicken
um nach deren bei LI zu suchen. Wenn alles importiert ist, kann man dem Skript einfach entfernen. 

