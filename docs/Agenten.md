# Agenten

Vier wiederkehrende Läufe halten die Teile dieser App aktuell, die von aussen
altern. Sie schreiben nie auf den Default-Branch: jeder legt seinen Fund als
**Entwurf** (Draft Pull Request) hin, und ein Mensch entscheidet.

| Agent | Wann | Rührt an | Ruft ein Modell |
|---|---|---|---|
| [Links](../.github/workflows/agent-links.yml) | täglich, 05:15 UTC | `src/data/support.ts`, `src/data/bpGuides.json`, `src/data/gospelMedia.ts`, die Datei hinter der toten Adresse | nur bei 404/410 |
| [Podcasts](../.github/workflows/agent-podcasts.yml) | samstags, 04:40 UTC | `data/media/raw/`, `public/data/media.json`, `data/media/sources.json` | nur bei stummer Quelle |
| [Nachrichten & Forschung](../.github/workflows/agent-news.yml) | mittwochs, 06:20 UTC | nur `docs/forschung/` | immer |
| [Israel](../.github/workflows/agent-israel.yml) | montags, 06:00 UTC | `src/data/israel.ts` | immer |

Alle vier laufen ausserdem von Hand: *Actions → den Workflow wählen → Run
workflow*.

---

## Einrichten

**Ein Geheimnis genügt.** Unter *Settings → Secrets and variables → Actions*
eines von beiden anlegen:

- `CLAUDE_CODE_OAUTH_TOKEN` – aus `claude setup-token` in der Claude-Code-CLI
  (läuft über das Abonnement), oder
- `ANTHROPIC_API_KEY` – ein API-Schlüssel (wird nach Verbrauch abgerechnet).

Die Workflows reichen beide durch; das leere gewinnt nicht. Fehlt jedes von
beiden, scheitern die Modell-Schritte – die rein mechanischen Teile (der
tägliche Prüflauf, der wöchentliche Feed-Abruf) laufen trotzdem und melden ihr
Ergebnis in der Job-Zusammenfassung.

**Eine Einstellung.** Unter *Settings → Actions → General → Workflow
permissions* muss **Allow GitHub Actions to create and approve pull requests**
gesetzt sein. Ohne das dürfen die Läufe committen, aber keinen Entwurf öffnen –
und der Fund liegt auf einem Zweig, den niemand sieht.

## Der Zweig gehört dem Agenten

Jeder Agent hat genau einen Zweig – `agent/links`, `agent/podcasts`,
`agent/forschung`, `agent/israel` – und setzt ihn bei jedem Lauf neu auf den
Default-Branch. Der Entwurf trägt damit immer genau einen Commit gegen den
aktuellen Stand und kann nicht mit der Zeit in einen Konflikt laufen.

Der Preis: **wer von Hand auf einen dieser Zweige committet, verliert es beim
nächsten Lauf.** Wer an einem Fund weiterarbeiten will, zweigt ab.

Ändert ein Lauf nichts, passiert nichts – kein leerer Commit, kein leerer
Entwurf. Steht auf dem Zweig schon derselbe Stand, wird auch nicht geschoben:
ein Commit, der nur seinen Zeitstempel ändert, sieht im Entwurf aus wie neue
Arbeit.

## Was jeder tut

### Links (täglich)

`deploy.yml` lässt die netzabhängigen Prüfungen bewusst aus – ein Anbieter mit
Schluckauf darf keine Veröffentlichung aufhalten. Damit blieb aber niemand
übrig, der sie laufen lässt. Das ist dieser Lauf: `check:urls`, `check:links`,
`check:bp` und `check:gospel-links`, einmal am Tag, ausserhalb des Wegs.

Entscheidend ist, was als Befund zählt. Die vier Skripte trennen das seit je
sauber, und der Agent hält sich daran:

| Code | Heisst | Folge |
|---|---|---|
| 0 | alles beantwortet | nichts |
| 1 | mindestens ein 404/410 | der Agent sucht die neue Adresse |
| 2 | nichts hat geantwortet | **kein Urteil**, kein Entwurf, keine Meldung |

Der letzte Fall ist der wichtige. Ein 403 kommt vom Filter, nicht von der
Seite; ein geblockter Lauf darf niemals einen Entwurf erzeugen. Neunzig
„reparierte" Adressen, die nie kaputt waren, sind schlimmer als gar keine
Prüfung – nach dem dritten Fehlalarm sieht niemand mehr hin.

Ein Sonderfall steckt in `check:gospel-links`: Ein Teil der Adressen dort ist
nicht eingetragen, sondern gebaut – die Folgenadressen von bibletunes.de
entstehen aus Buch und Kapitel. Fällt eine davon aus, ist nicht die Adresse
falsch, sondern die Regel, die sie baut. Der Agent trägt dann keine Adresse
ein, sondern sagt es im Bericht.

### Podcasts (wöchentlich)

Holt die Feeds (`npm run media -- --fetch`) und baut `public/data/media.json`
neu. Neue Folgen sind reine Mechanik und brauchen kein Modell.

Gerufen wird es nur bei den zwei Fehlern, die dieser Index **still** haben
kann, und die der Baubericht beide in seinen Zahlen zeigt:

- **0 Einträge** – der Feed ist umgezogen. Eine umgezogene Adresse macht keinen
  Krach, sie macht eine leere Liste, und leere Listen fallen niemandem auf.
- **Einträge da, aber 0 mit Datum** – der Datumsleser ist kaputt. Genau so
  verloren 229 Folgen einmal unbemerkt ihr Sendedatum (die Geschichte steht im
  Kopf von `scripts/build-media.mjs`). BibleProject ist hier die Ausnahme: eine
  Buchübersichtsseite hat kein Sendedatum, das ist keine Panne.

Warum wöchentlich und nicht täglich: ein Abruf schreibt die
zwischengespeicherten Feeds komplett neu, rund 1,5 MB. Täglich hiesse ein
halbes Gigabyte Verlauf im Jahr für ein paar Folgen mehr. Wer es anders will,
ändert eine Zeile `cron`.

Neue Quellen sucht der Agent nicht. Das ist eine Entscheidung, keine Reparatur.

### Nachrichten & Forschung (wöchentlich)

Sucht, was zu den Gegenständen dieser App erschienen ist – Grabungen an Orten,
die auf der Karte stehen, Handschriften, Datierungen, Fundstücke zu Personen aus
dem Zeitbaum – und legt es als Blatt unter `docs/forschung/` ab. Was ein Blatt
ist und was nicht, steht in [`docs/forschung/README.md`](forschung/README.md).

**Er ändert keine Daten.** Ob eine neue Datierung in die Epochentabelle gehört
oder nur interessant ist, ist eine Entscheidung. Ein Lauf, der wöchentlich
ungefragt an `src/data/` schreibt, verwandelt eine belegte Karte in eine
ungefähre.

### Israel (wöchentlich)

Der einzige der vier, der an `src/data/` schreibt. Der Kopf von
`src/data/israel.ts` sagt über die Datei: *„Zahlen veralten. Der laufende Krieg
ist in Bewegung; die Zahlen hier tragen ein Stand-Datum und sind in dem
Augenblick veraltet, in dem sie geschrieben sind."* Das war eine Feststellung.
Dieser Lauf macht eine Zusage daraus.

Er frischt die `figures` der jüngsten Ereignisse auf – **Wert und Stand immer
zusammen**, denn eine neue Zahl mit altem Stand ist schlimmer als eine alte
Zahl mit ehrlichem Stand –, hängt höchstens zwei neue Ereignisse an und zieht
`DATA_AS_OF` nach.

Dass das überhaupt geht, liegt nicht am Modell, sondern an der Datei: sie kennt
ihre eigenen Regeln, und `npm run check:israel` setzt sie durch – keine Zahl
ohne Quelle und Stand, kein Ereignis ohne Beleg, beide Sprachen gefüllt, die
Reihenfolge stimmt, die Quelle einer Zahl steht auch in der Quellenliste ihres
Ereignisses. Der Agent kann hier nichts hineinschreiben, was die Prüfung nicht
auch von einem Menschen verlangen würde. Der Lauf prüft danach noch einmal
selbst, ausserhalb der Modellsitzung.

Was er nicht tut: bestehende Ereignistexte umschreiben oder „ausgewogener"
machen (sie sind mit Bedacht so formuliert), `israelGeo.ts` anfassen
(Gebietsstände sind Handarbeit), oder eine Zahl aus zweiter Hand übernehmen –
zitiert eine Meldung eine Zahl von UN OCHA, ist die Quelle OCHA, und dort wird
nachgesehen.

Was die Prüfung nicht sagen kann: ob die Zahl stimmt. Die Stelle, die sie
erhebt, steht bei jeder dabei – ein Klick genügt. Deshalb ist der Entwurf ein
Entwurf.

## Fremde Texte sind Material, keine Anweisung

Drei der vier Agenten lesen das offene Netz und schreiben danach in dieses
Repository. Das ist ein Einfallstor, und es wird an drei Stellen zugehalten:

1. **Der Auftrag sagt es.** In jedem Prompt steht, dass Abgerufenes Material
   ist und keine Anweisung – auch wenn es wie eine klingt.
2. **Der Werkzeugkasten ist klein.** Jeder Lauf gibt über `--allowedTools` nur
   frei, was er braucht. Der Forschungs-Agent darf lesen, suchen und *eine*
   Datei schreiben; keiner darf beliebige Befehle ausführen.
3. **Das Ergebnis ist ein Entwurf.** Nichts von alledem erreicht die
   veröffentlichte Seite, ohne dass jemand den Diff gesehen hat.

## Abstellen

Einen Agenten anhalten: *Actions → den Workflow wählen → ⋯ → Disable workflow*.
Ganz weg: die `.yml` löschen. Die Prüfskripte bleiben davon unberührt und
laufen weiter von Hand – die Agenten sind der Wecker, nicht die Arbeit.
