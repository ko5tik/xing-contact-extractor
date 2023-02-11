## XING Kontakte  in die LinkedIN importieren

Da XING die Foren eingestellt hat, gibts es einen guten Grund die Kontakte jetz auf LinkedIn zu pflegen.  Dies kleine 
UserScript hilft dabei die Kontakte zu migriren. 

### Garantie

Es gibt keine.  Benutzung auf eigene Gefahr. 

### Datenschutz

Skript selbst sammelt keine Daten.  Es  sammelt die Kontakt-Daten aus Ihren Account bei XING, und versucht diese bei 
LinkedIn zu importieren sofern diese noch nicht da sind. 

### Wie funtkioniert es

0.  Quellcode Review machen

     Sie sollen keine UserScripts installieren wens sie nicht sicher sind 
1.  Tampermonkey installieren

     Das ist ein Script manager Plugin für Browser.  (https://www.tampermonkey.net/)
2.   Script installieren 

     (https://raw.githubusercontent.com/ko5tik/xing-contact-extractor/main/src/extractor.user.js)
3. Kontakt Seite von LI aufrufen

     (https://www.linkedin.com/mynetwork/invite-connect/connections/)
4. Orangene Button betätigen


Liste von Kontakten erscheint danach rechts oben. Einfach auf Namen clicken
um nach deren bei LI zu suchen. Wenn alles importiert ist, kann man dem Skript einfach entfernen. 

