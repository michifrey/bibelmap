# Nachrichten und Forschung

Hier legt der Forschungs-Agent (`.github/workflows/agent-news.yml`) einmal in
der Woche ab, was er gefunden hat: `JJJJ-MM-TT.md`, ein Blatt je Lauf.

## Wozu

Diese App behauptet an vielen Stellen etwas über die Welt – wo ein Ort lag, wie
alt ein Fund ist, was eine Zahl bedeutet. Solche Behauptungen altern, und sie
altern leise. Ein Ort, den die Forschung inzwischen dreissig Kilometer weiter
südlich sucht, sagt auf der Karte nichts davon; er liegt einfach weiter falsch.

Der Agent sucht deshalb nicht „Neues über die Bibel" im Allgemeinen, sondern
das, was hier drinsteht: Grabungen an Orten aus `public/data/places.json`,
Handschriften- und Textforschung, Datierungen, Fundstücke, zu denen es in
`src/data/personSources.ts` schon einen Eintrag gibt oder geben sollte.

## Was ein Blatt ist – und was nicht

Ein Blatt ist eine **Fundliste mit Vorschlägen**, kein Beitrag zur App. Es
ändert keine Daten. Jeder Eintrag nennt die Quelle und sagt, welche Datei es
beträfe, wenn jemand ihn übernimmt. Das Übernehmen bleibt Handarbeit: ob eine
neue Datierung in `src/data/eras.ts` gehört oder ob sie einfach nur
interessant ist, entscheidet kein Cronjob.

Deshalb steht in einem Blatt auch, was der Agent **nicht** gefunden hat. Eine
Woche ohne Fund ist ein Ergebnis; ein Blatt, das sie mit Beliebigem füllt,
ist die schlechtere Woche.

## Was hier nicht hingehört

Tagespolitik. Die gehört, soweit sie die Israel-Karte betrifft, zum
Israel-Agenten und landet dort in `src/data/israel.ts` – mit Beleg und
Stand-Datum, wie jede Zahl in dieser Datei.

## Quellenlage

Die Vorschläge stammen aus dem offenen Netz und sind ungeprüft, bis jemand sie
prüft. Für einen Fund, dessen einzige Spur eine Pressemeldung ist, gilt, was
für jede Zahl in diesem Repo gilt: die Stelle nennen, die ihn erhebt – oder ihn
draussen lassen.
