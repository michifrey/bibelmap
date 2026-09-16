/**
 * Der Fahrplan: woher diese Seite kommt und wohin sie noch will.
 *
 * Die Stationen sind **eine Liste**, keine Zeichnung. Wie die Strasse
 * verläuft, wie viele Kurven sie hat und auf welcher Seite eine Karte steht,
 * rechnet `Roadmap.tsx` daraus aus – wer hier eine Station einfügt, streicht
 * oder verschiebt, muss an der Grafik nichts anfassen.
 *
 * Die erledigten Stationen fassen die Releases aus der PRD (§ 7) zusammen,
 * nicht Nummer für Nummer: Neun Haltepunkte hinter sich und vier vor sich
 * liest man; neunundsiebzig Abschnitte nicht.
 *
 * Die geplanten Stationen stehen hier nur, wenn sie im Projekt nachweisbar
 * offen sind – jede nennt ihre Zahl oder ihre Stelle in der PRD. Wünsche ohne
 * Beleg stehen nicht auf der Strasse; wofür es bewusst keine Abzweigung gibt,
 * steht am Ende unter `NOT_PLANNED` (PRD § 1, Nicht-Ziele).
 */

export type StopStatus = 'done' | 'here' | 'planned' | 'goal';

export interface RoadStop {
  id: string;
  /** Release oder Zeitangabe – die kleine Zeile über dem Titel. */
  tag: { de: string; en: string };
  title: { de: string; en: string };
  body: { de: string; en: string };
  status: StopStatus;
  /**
   * Die Zahl, die die Station belegt – oder `null`, wo es keine gibt.
   * Sie steht gross auf der Karte, weil sie das Nachprüfbare daran ist.
   */
  figure?: { value: string; label: { de: string; en: string } };
}

export const ROAD: RoadStop[] = [
  {
    id: 'v01',
    tag: { de: 'v0.1 – v0.3', en: 'v0.1 – v0.3' },
    title: { de: 'Die Karte steht', en: 'The map exists' },
    body: {
      de: 'Orte, Zeitleiste, Suche und Heatmap; der Bibeltext liegt daneben, und jede Ansicht hat eine Adresse, die man weitergeben kann.',
      en: 'Places, timeline, search and heatmap; the biblical text sits beside them, and every view has an address you can pass on.',
    },
    status: 'done',
    figure: { value: '1.335', label: { de: 'Orte, 8.707 Stellen', en: 'places, 8,707 passages' } },
  },
  {
    id: 'v04',
    tag: { de: 'v0.4 – v0.6', en: 'v0.4 – v0.6' },
    title: { de: 'Reisen, Ausbreitung, Quiz', en: 'Journeys, spread, quiz' },
    body: {
      de: 'Die Karte erzählt: Wege durch die Bibel, die Ausbreitung nach der Apostelgeschichte, Fragen zum Nachschauen – und alles auch ohne Netz.',
      en: 'The map starts telling: routes through the Bible, the spread after Acts, questions to look up – and all of it offline too.',
    },
    status: 'done',
    figure: { value: '15', label: { de: 'Reisen zum Mitgehen', en: 'journeys to walk along' } },
  },
  {
    id: 'v09',
    tag: { de: 'v0.7 – v0.9', en: 'v0.7 – v0.9' },
    title: { de: 'Gelände, Medien, Nachweise', en: 'Terrain, media, credits' },
    body: {
      de: 'Das Land bekommt Höhe, die Orte bekommen Folgen zum Hören und Sehen, und jede fremde Arbeit bekommt ihre Zeile mit Lizenz.',
      en: 'The land gets height, the places get episodes to listen to and watch, and every borrowed work gets its line with a licence.',
    },
    status: 'done',
  },
  {
    id: 'haus',
    tag: { de: 'zuletzt', en: 'most recently' },
    title: { de: 'Aufgeräumt und nachgemessen', en: 'Tidied and measured' },
    body: {
      de: 'Ladegewicht halbiert und mit einem Budget festgehalten; Tastatur, Überschriften und Tippziele nachgezogen. Prüfskripte wachen seither darüber.',
      en: 'Load halved and pinned down with a budget; keyboard, headings and tap targets brought up to standard. Check scripts have watched over it since.',
    },
    status: 'done',
    figure: { value: '22', label: { de: 'Prüfungen bei jedem Lauf', en: 'checks on every run' } },
  },
  {
    id: 'feste',
    tag: { de: 'v0.10', en: 'v0.10' },
    title: { de: 'Das Jahr als Rad', en: 'The year as a wheel' },
    body: {
      de: 'Die Feste Israels im Kreis der zwölf Monate: wann eines liegt, wovon aus gezählt wird, was gefeiert wird – und was heute daraus geworden ist, jüdisch wie christlich. Der Neumond steht zwölfmal darin, an jedem Monatsanfang.',
      en: 'The feasts of Israel in the circle of the twelve months: when one falls, what it is counted from, what it celebrates – and what has become of it today, in Jewish and in Christian practice. The new moon stands in it twelve times, at every month’s beginning.',
    },
    status: 'done',
    figure: { value: '12', label: { de: 'Feste, 53 Bibelstellen', en: 'feasts, 53 passages' } },
  },
  {
    id: 'heute',
    tag: { de: 'heute', en: 'today' },
    title: { de: 'Hier stehen wir', en: 'This is where we are' },
    body: {
      de: 'Alles bis hierher ist gebaut und geprüft. Was danach kommt, ist offen – und jede der folgenden Stationen lässt sich im Projekt nachzählen.',
      en: 'Everything up to here is built and checked. What follows is open – and each of the stations below can be counted in the project itself.',
    },
    status: 'here',
  },
  {
    id: 'bilder',
    tag: { de: 'als Nächstes', en: 'next up' },
    title: { de: 'Mehr Orte mit Bild', en: 'More places with a picture' },
    body: {
      de: 'Von 1.335 Orten tragen 291 ein Foto – gut ein Fünftel. Der Rest zeigt einen Platzhalter. Die Bilder kommen aus Wikimedia Commons; was fehlt, muss dort gesucht und zugeordnet werden.',
      en: 'Of 1,335 places, 291 carry a photo – barely a fifth. The rest show a placeholder. Images come from Wikimedia Commons; what is missing has to be found and matched there.',
    },
    status: 'planned',
    figure: { value: '291/1.335', label: { de: 'Orte mit Foto', en: 'places with a photo' } },
  },
  {
    id: 'sprachen',
    tag: { de: 'danach', en: 'after that' },
    title: { de: 'Eine dritte Sprache', en: 'A third language' },
    body: {
      de: 'Deutsch und Englisch sind vollständig – jeder Text steht zweisprachig an einer Stelle, und „check:i18n-keys“ meldet jede Lücke. Eine dritte Sprache ist Arbeit an den Texten, nicht am Bau.',
      en: 'German and English are complete – every string lives bilingually in one place, and “check:i18n-keys” reports any gap. A third language is work on the texts, not on the machinery.',
    },
    status: 'planned',
    figure: { value: '2', label: { de: 'Sprachen vollständig', en: 'languages complete' } },
  },
  {
    id: 'bp',
    tag: { de: 'offen · PRD § 10', en: 'open · PRD § 10' },
    title: { de: 'Die letzten geratenen Adressen', en: 'The last guessed addresses' },
    body: {
      de: 'Die Links zu den BibleProject-Lesehilfen werden aus dem Buchnamen gebildet; Ausnahmen stehen von Hand daneben. „npm run check:bp“ klopft alle 63 ab – nur ist bibleproject.com aus der Entwicklungsumgebung gesperrt. Es fehlt ein Lauf mit Netz.',
      en: 'Links to the BibleProject reading guides are built from the book name, with exceptions listed by hand. “npm run check:bp” tests all 63 – but bibleproject.com is blocked from the development environment. What is missing is one run with network access.',
    },
    status: 'planned',
    figure: { value: '63', label: { de: 'Adressen ungeprüft', en: 'addresses unverified' } },
  },
  {
    id: 'v1',
    tag: { de: 'irgendwann', en: 'one day' },
    title: { de: 'v1.0 – und dann Pflege', en: 'v1.0 – and then upkeep' },
    body: {
      de: 'Kein grosser Umbau mehr, sondern: Daten nachführen, Quellen prüfen, Fehler ausbessern. Eine Karte der Bibel ist nie fertig, aber sie darf irgendwann ruhig werden.',
      en: 'No more big rebuilds, but: keep the data current, verify sources, fix mistakes. A map of the Bible is never finished, but at some point it may go quiet.',
    },
    status: 'goal',
  },
];

/**
 * Abzweigungen, die diese Strasse bewusst nicht nimmt. Sie stehen hier, weil
 * ein Fahrplan ohne sie die häufigste Frage offenlässt – „kommt das noch?" –
 * und die ehrliche Antwort „nein" ist. Die Liste ist § 1 der PRD
 * („Nicht-Ziele") plus der Datenschutz-Punkt aus § 5.
 */
export const NOT_PLANNED: { id: string; de: string; en: string }[] = [
  { id: 'accounts', de: 'Keine Benutzerkonten. Nichts hier will wissen, wer Sie sind.', en: 'No user accounts. Nothing here wants to know who you are.' },
  { id: 'tracking', de: 'Kein Tracking, keine Analyse-Skripte, keine fremden Schriften.', en: 'No tracking, no analytics scripts, no third-party fonts.' },
  { id: 'translation', de: 'Keine eigene Bibelübersetzung – Luther 1912 und die WEB sind gemeinfrei und genügen.', en: 'No translation of our own – Luther 1912 and the WEB are public domain and enough.' },
  { id: 'commentary', de: 'Kein Theologie-Kommentar. Die Seite zeigt, wo etwas steht, nicht was man davon halten soll.', en: 'No theological commentary. The site shows where something is, not what to make of it.' },
];
