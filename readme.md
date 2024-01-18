# TYPO3 Extension nkc_event

Die Extension stellt PlugIns bereit, um Inhalte der Nordkirche API (Veranstaltungen) auf einer Website darzustellen.

* Listenansicht
* Detailansicht (Visitenkarte)
* Suchformular

* Kartdarstellung
  * mit Liste unter der Karte
  * alleinstehend ohne Liste


## Abhängigkeiten
Diese Extension basiert auf

    nordkirche/nkc_base ^11.5
    nordkirche/nk-google-map ^11.5
    fluidtypo3/vhs ^6.1
    TYPO3 ^11.5

## Installation
Die Installation der Extension erfolgt über composer, da bei dieser Installation auch alle Abhängigkeiten mit installiert werden müssen.

    composer req nordkirche/nkc-event

Bitte binden Sie anschließend das statische Template der Extension in Ihr TypoScript Template ein.

## Konfiguration

Bitte beachten Sie die Dokumentation von nordkirche/nkc-base, um Zugriffe auf die NAPI zu ermöglichen.

Es gibt im statischen TypoScript umfangreiche Konfigurationen, die für die eigenen Bedürfnisse angepasst werden können und müssen (z.B. Pfade Icons für die Kartendarstellung) Für TYPO3 Integratoren sollten sich die meisten Dinge von selbst erklären.

Grunsätzlich ist es so, dass Konfigurationen teilweise sowohl in TypoScript als auch in den Plug-Ins möglich sind. Hier zu beachten, dass Plug-In Konfigurationen TypoScript überschreiben, wenn sie einen Wert haben.

Die Templates der Extension haben ein sehr rudimentäres Markup, um die Möglichkeiten der Extension zu zeigen. Die darzustellenen Inhalte sind so komplex, dass ein Standard-Layout wenig Sinn ergeben hätte.

## PSR-14 Events
Es gibt PSR-14 Events, um die NAPI Queries und die Ausgabe der Daten anzupassen:

| Controller      | Action      | Event                         | Daten holen             | Daten überschreiben     |
|-----------------|-------------|-------------------------------|-------------------------|-------------------------|
| EventController | listAction  | ModifyAssignedListValuesEvent | getAssignedListValues() | setAssignedListValues() |
| EventController | listAction  | ModifyQueryEvent              | getEventQuery()         | setEventQuery()         |
| EventController | showAction  | ModifyAssignedValuesEvent     | getAssignedValues()     | setAssignedValues()     |
|

## Fehler gefunden?
Bitte melden Sie Fehler via github
https://github.com/Nordkirche/nkc-event
