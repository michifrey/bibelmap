// Wie das Evangelium in die Welt kam: die Reisen des Paulus (Apostelgeschichte)
// und – darüber hinaus – die Ausbreitung des Christentums bis in die Gegenwart.
//
// Die Reisedaten stammen aus der Apostelgeschichte, die Koordinaten aus dem
// OpenBible-Datensatz (`placeId` verweist auf `public/data/places.json`).
// Die Stationen nach der Apostelgeschichte sind Kirchengeschichte, keine
// Bibelstellen: Jahreszahlen sind gerundet, früh­kirchliche Überlieferungen
// (Thomas in Indien, Markus in Alexandria) sind als solche gekennzeichnet.

export interface Bilingual {
  de: string;
  en: string;
}

/** Eine Station einer Missionsreise. */
export interface MissionStop {
  de: string;
  en: string;
  lat: number;
  lon: number;
  /** Ort in places.json – erlaubt den Sprung auf die Hauptkarte. */
  placeId?: string;
  /** Bibelstelle in der Apostelgeschichte. */
  ref?: Bilingual;
  note?: Bilingual;
  /** Station auf dem Rückweg – in der Liste zurückhaltender gezeigt. */
  back?: boolean;
}

export interface MissionJourney {
  id: string;
  de: string;
  en: string;
  years: Bilingual;
  /** Bibelstelle für den BibleGateway-Link. */
  passage: Bilingual;
  color: string;
  summary: Bilingual;
  stops: MissionStop[];
}

const JERUSALEM: [number, number] = [31.777, 35.234];
const ROME: [number, number] = [41.892, 12.485];
const CONSTANTINOPLE: [number, number] = [41.008, 28.978];
const CTESIPHON: [number, number] = [33.094, 44.581];
const LISBON: [number, number] = [38.722, -9.139];
const LONDON: [number, number] = [51.507, -0.128];
const HERRNHUT: [number, number] = [51.019, 14.744];
const BOSTON: [number, number] = [42.36, -71.058];
const SEOUL: [number, number] = [37.567, 126.978];

export const JOURNEYS: MissionJourney[] = [
  {
    id: 'witnesses',
    de: 'Von Jerusalem nach Judäa und Samarien',
    en: 'From Jerusalem to Judea and Samaria',
    years: { de: '~30–44 n. Chr.', en: 'c. AD 30–44' },
    passage: { de: 'Apostelgeschichte 1-11', en: 'Acts 1-11' },
    color: '#9a4ba0',
    summary: {
      de: 'Noch bevor Paulus aufbricht, wandert die Botschaft: Pfingsten in Jerusalem, die Verfolgung streut die Gemeinde nach Samarien und an die Küste, und in Antiochia entsteht die erste Gemeinde, in der Juden und Griechen zusammen glauben.',
      en: 'Before Paul ever sets out the message is already moving: Pentecost in Jerusalem, persecution scattering the church into Samaria and along the coast, and in Antioch the first congregation where Jews and Greeks believe together.',
    },
    stops: [
      { de: 'Jerusalem', en: 'Jerusalem', lat: 31.77667, lon: 35.23417, placeId: 'a15257a', ref: { de: 'Apg 2,1-41', en: 'Acts 2:1-41' }, note: { de: 'Pfingsten: Menschen aus fünfzehn Ländern hören die Botschaft in ihrer eigenen Sprache.', en: 'Pentecost: people from fifteen lands hear the message each in their own language.' } },
      { de: 'Samarien', en: 'Samaria', lat: 32.27611, lon: 35.195, placeId: 'a041bb3', ref: { de: 'Apg 8,4-8', en: 'Acts 8:4-8' }, note: { de: 'Die Verfolgung nach Stephanus treibt die Gemeinde aus der Stadt – Philippus predigt in Samarien.', en: 'The persecution after Stephen drives the church out of the city – Philip preaches in Samaria.' } },
      { de: 'Straße nach Gaza', en: 'Road to Gaza', lat: 31.504, lon: 34.4644, placeId: 'aa8edd2', ref: { de: 'Apg 8,26-39', en: 'Acts 8:26-39' }, note: { de: 'Der äthiopische Hofbeamte kehrt getauft nach Afrika zurück.', en: 'The Ethiopian court official returns to Africa baptised.' } },
      { de: 'Damaskus', en: 'Damascus', lat: 33.51111, lon: 36.30639, placeId: 'a69c1d4', ref: { de: 'Apg 9,1-19', en: 'Acts 9:1-19' }, note: { de: 'Der Verfolger Saulus wird zum Zeugen.', en: 'Saul the persecutor becomes a witness.' } },
      { de: 'Joppe', en: 'Joppa', lat: 32.05448, lon: 34.75304, placeId: 'ae023a9', ref: { de: 'Apg 9,36-43', en: 'Acts 9:36-43' } },
      { de: 'Cäsarea', en: 'Caesarea', lat: 32.5, lon: 34.89167, placeId: 'a58735e', ref: { de: 'Apg 10,1-48', en: 'Acts 10:1-48' }, note: { de: 'Kornelius: der erste Nichtjude, der ohne Umweg dazugehört.', en: 'Cornelius: the first Gentile to belong without detour.' } },
      { de: 'Zypern & Kyrene', en: 'Cyprus & Cyrene', lat: 32.82095, lon: 21.85123, placeId: 'a81cdb5', ref: { de: 'Apg 11,19-20', en: 'Acts 11:19-20' }, note: { de: 'Namenlose Flüchtlinge aus Zypern und Kyrene sprechen als Erste auch zu Griechen.', en: 'Nameless refugees from Cyprus and Cyrene are the first to speak to Greeks as well.' } },
      { de: 'Antiochia am Orontes', en: 'Antioch on the Orontes', lat: 36.22669, lon: 36.17174, placeId: 'ae41ab4', ref: { de: 'Apg 11,19-26', en: 'Acts 11:19-26' }, note: { de: 'Hier heißen die Jünger zum ersten Mal „Christen“ – und von hier aus geht die Mission weiter.', en: 'Here the disciples are first called "Christians" – and from here the mission goes on.' } },
    ],
  },
  {
    id: 'first',
    de: 'Erste Missionsreise',
    en: 'First missionary journey',
    years: { de: '~46–48 n. Chr.', en: 'c. AD 46–48' },
    passage: { de: 'Apostelgeschichte 13-14', en: 'Acts 13-14' },
    color: '#b8742e',
    summary: {
      de: 'Die Gemeinde von Antiochia sendet Barnabas und Saulus aus: über Zypern nach Kleinasien. In Antiochia in Pisidien fällt die Entscheidung, sich den Nichtjuden zuzuwenden; in Lystra wird Paulus gesteinigt – und geht zurück in dieselben Städte, um die jungen Gemeinden zu ordnen.',
      en: 'The church at Antioch sends out Barnabas and Saul: via Cyprus into Asia Minor. At Pisidian Antioch comes the turn to the Gentiles; at Lystra Paul is stoned – and goes back to the same towns to order the young churches.',
    },
    stops: [
      { de: 'Antiochia am Orontes', en: 'Antioch on the Orontes', lat: 36.22669, lon: 36.17174, placeId: 'ae41ab4', ref: { de: 'Apg 13,1-3', en: 'Acts 13:1-3' }, note: { de: 'Die Gemeinde fastet, betet und lässt die beiden ziehen.', en: 'The church fasts, prays and lets the two go.' } },
      { de: 'Seleukia', en: 'Seleucia', lat: 36.124, lon: 35.922, placeId: 'a6d306d', ref: { de: 'Apg 13,4', en: 'Acts 13:4' } },
      { de: 'Salamis (Zypern)', en: 'Salamis (Cyprus)', lat: 35.18494, lon: 33.90194, placeId: 'afa863b', ref: { de: 'Apg 13,5', en: 'Acts 13:5' } },
      { de: 'Paphos', en: 'Paphos', lat: 34.75567, lon: 32.40417, placeId: 'a314765', ref: { de: 'Apg 13,6-12', en: 'Acts 13:6-12' }, note: { de: 'Der Statthalter Sergius Paulus kommt zum Glauben; ab hier heißt Saulus Paulus.', en: 'The proconsul Sergius Paulus believes; from here Saul is called Paul.' } },
      { de: 'Perge', en: 'Perga', lat: 36.96035, lon: 30.85369, placeId: 'aff04b8', ref: { de: 'Apg 13,13', en: 'Acts 13:13' }, note: { de: 'Johannes Markus kehrt um – später der Grund für den Streit mit Barnabas.', en: 'John Mark turns back – later the reason for the split with Barnabas.' } },
      { de: 'Antiochia in Pisidien', en: 'Antioch in Pisidia', lat: 38.30611, lon: 31.18917, placeId: 'a6c704a', ref: { de: 'Apg 13,14-52', en: 'Acts 13:14-52' }, note: { de: '„So wenden wir uns zu den Heiden“ – die Predigt in der Synagoge wird zum Wendepunkt.', en: '"We turn to the Gentiles" – the synagogue sermon becomes the turning point.' } },
      { de: 'Ikonion', en: 'Iconium', lat: 37.8722, lon: 32.49233, placeId: 'ae425aa', ref: { de: 'Apg 14,1-5', en: 'Acts 14:1-5' } },
      { de: 'Lystra', en: 'Lystra', lat: 37.6017, lon: 32.3384, placeId: 'af0719d', ref: { de: 'Apg 14,6-19', en: 'Acts 14:6-19' }, note: { de: 'Erst hält man die beiden für Götter, dann wird Paulus gesteinigt und für tot gehalten.', en: 'First taken for gods, then Paul is stoned and left for dead.' } },
      { de: 'Derbe', en: 'Derbe', lat: 37.34857, lon: 33.36145, placeId: 'aa401a9', ref: { de: 'Apg 14,20-21', en: 'Acts 14:20-21' } },
      { de: 'Lystra, Ikonion, Antiochia', en: 'Lystra, Iconium, Antioch', lat: 37.6017, lon: 32.3384, placeId: 'af0719d', ref: { de: 'Apg 14,21-23', en: 'Acts 14:21-23' }, note: { de: 'Rückweg durch dieselben Städte: Älteste werden eingesetzt.', en: 'Back through the same towns: elders are appointed.' }, back: true },
      { de: 'Perge', en: 'Perga', lat: 36.96035, lon: 30.85369, placeId: 'aff04b8', ref: { de: 'Apg 14,25', en: 'Acts 14:25' }, back: true },
      { de: 'Attalia', en: 'Attalia', lat: 36.88127, lon: 30.70361, placeId: 'ac744c1', ref: { de: 'Apg 14,25', en: 'Acts 14:25' }, back: true },
      { de: 'Antiochia am Orontes', en: 'Antioch on the Orontes', lat: 36.22669, lon: 36.17174, placeId: 'ae41ab4', ref: { de: 'Apg 14,26-28', en: 'Acts 14:26-28' }, note: { de: 'Bericht an die sendende Gemeinde: Gott hat den Heiden „die Tür des Glaubens aufgetan“.', en: 'Report to the sending church: God has opened "a door of faith" to the Gentiles.' }, back: true },
    ],
  },
  {
    id: 'second',
    de: 'Zweite Missionsreise',
    en: 'Second missionary journey',
    years: { de: '~49–52 n. Chr.', en: 'c. AD 49–52' },
    passage: { de: 'Apostelgeschichte 15,36-18,22', en: 'Acts 15:36-18:22' },
    color: '#2f8f7f',
    summary: {
      de: 'Nach dem Apostelkonzil bricht Paulus mit Silas auf. In Troas ruft ihn im Traum ein Mazedonier – das Evangelium setzt nach Europa über: Philippi, Thessalonich, Athen, Korinth.',
      en: 'After the Jerusalem council Paul sets out with Silas. At Troas a Macedonian calls him in a dream – the gospel crosses into Europe: Philippi, Thessalonica, Athens, Corinth.',
    },
    stops: [
      { de: 'Antiochia am Orontes', en: 'Antioch on the Orontes', lat: 36.22669, lon: 36.17174, placeId: 'ae41ab4', ref: { de: 'Apg 15,36-40', en: 'Acts 15:36-40' } },
      { de: 'Syrien & Zilizien (Tarsus)', en: 'Syria & Cilicia (Tarsus)', lat: 36.91303, lon: 34.89206, placeId: 'a666ea0', ref: { de: 'Apg 15,41', en: 'Acts 15:41' } },
      { de: 'Derbe', en: 'Derbe', lat: 37.34857, lon: 33.36145, placeId: 'aa401a9', ref: { de: 'Apg 16,1', en: 'Acts 16:1' } },
      { de: 'Lystra', en: 'Lystra', lat: 37.6017, lon: 32.3384, placeId: 'af0719d', ref: { de: 'Apg 16,1-3', en: 'Acts 16:1-3' }, note: { de: 'Timotheus schließt sich an.', en: 'Timothy joins the team.' } },
      { de: 'Phrygien & Galatien', en: 'Phrygia & Galatia', lat: 39.26667, lon: 32.98333, placeId: 'a0f440a', ref: { de: 'Apg 16,6', en: 'Acts 16:6' } },
      { de: 'Troas', en: 'Troas', lat: 39.75194, lon: 26.15861, placeId: 'a91c509', ref: { de: 'Apg 16,8-10', en: 'Acts 16:8-10' }, note: { de: '„Komm herüber nach Mazedonien und hilf uns.“', en: '"Come over to Macedonia and help us."' } },
      { de: 'Neapolis', en: 'Neapolis', lat: 40.935, lon: 24.415, placeId: 'a6a7150', ref: { de: 'Apg 16,11', en: 'Acts 16:11' }, note: { de: 'Erster Schritt auf europäischem Boden.', en: 'First step on European soil.' } },
      { de: 'Philippi', en: 'Philippi', lat: 41.01207, lon: 24.28458, placeId: 'a49e1d0', ref: { de: 'Apg 16,12-40', en: 'Acts 16:12-40' }, note: { de: 'Lydia, die Purpurhändlerin, und der Kerkermeister – die erste Gemeinde Europas.', en: 'Lydia the purple-seller and the jailer – the first church in Europe.' } },
      { de: 'Amphipolis & Apollonia', en: 'Amphipolis & Apollonia', lat: 40.82016, lon: 23.84721, placeId: 'a4bdea7', ref: { de: 'Apg 17,1', en: 'Acts 17:1' } },
      { de: 'Thessalonich', en: 'Thessalonica', lat: 40.63777, lon: 22.94577, placeId: 'afa9d8e', ref: { de: 'Apg 17,1-9', en: 'Acts 17:1-9' } },
      { de: 'Beröa', en: 'Berea', lat: 40.51833, lon: 22.2, placeId: 'a62fe31', ref: { de: 'Apg 17,10-14', en: 'Acts 17:10-14' }, note: { de: 'Sie prüfen täglich in der Schrift, ob es sich so verhält.', en: 'They examine the Scriptures daily to see whether it is so.' } },
      { de: 'Athen', en: 'Athens', lat: 37.97185, lon: 23.72674, placeId: 'a1fe6e7', ref: { de: 'Apg 17,15-34', en: 'Acts 17:15-34' }, note: { de: 'Die Rede auf dem Areopag: „dem unbekannten Gott“.', en: 'The Areopagus speech: "to the unknown god".' } },
      { de: 'Korinth', en: 'Corinth', lat: 37.90579, lon: 22.87874, placeId: 'a6f437a', ref: { de: 'Apg 18,1-17', en: 'Acts 18:1-17' }, note: { de: 'Anderthalb Jahre bei Priska und Aquila; hier entstehen die Thessalonicherbriefe.', en: 'Eighteen months with Priscilla and Aquila; the Thessalonian letters are written here.' } },
      { de: 'Kenchreä', en: 'Cenchreae', lat: 37.88434, lon: 22.99682, placeId: 'aa31dd3', ref: { de: 'Apg 18,18', en: 'Acts 18:18' }, back: true },
      { de: 'Ephesus', en: 'Ephesus', lat: 37.93912, lon: 27.3407, placeId: 'a5feb15', ref: { de: 'Apg 18,19-21', en: 'Acts 18:19-21' }, back: true },
      { de: 'Cäsarea', en: 'Caesarea', lat: 32.5, lon: 34.89167, placeId: 'a58735e', ref: { de: 'Apg 18,22', en: 'Acts 18:22' }, back: true },
      { de: 'Jerusalem & Antiochia', en: 'Jerusalem & Antioch', lat: 31.77667, lon: 35.23417, placeId: 'a15257a', ref: { de: 'Apg 18,22', en: 'Acts 18:22' }, back: true },
    ],
  },
  {
    id: 'third',
    de: 'Dritte Missionsreise',
    en: 'Third missionary journey',
    years: { de: '~53–57 n. Chr.', en: 'c. AD 53–57' },
    passage: { de: 'Apostelgeschichte 18,23-21,17', en: 'Acts 18:23-21:17' },
    color: '#3a6ea8',
    summary: {
      de: 'Drei Jahre in Ephesus – von dort erreicht die Botschaft die ganze Provinz Asien. Am Ende reist Paulus mit der Kollekte für Jerusalem zurück, obwohl ihm Fesseln angekündigt sind.',
      en: 'Three years in Ephesus – from there the message reaches the whole province of Asia. At the end Paul travels back with the collection for Jerusalem, though chains are foretold for him.',
    },
    stops: [
      { de: 'Antiochia am Orontes', en: 'Antioch on the Orontes', lat: 36.22669, lon: 36.17174, placeId: 'ae41ab4', ref: { de: 'Apg 18,23', en: 'Acts 18:23' } },
      { de: 'Galatien & Phrygien', en: 'Galatia & Phrygia', lat: 39.26667, lon: 32.98333, placeId: 'a0f440a', ref: { de: 'Apg 18,23', en: 'Acts 18:23' } },
      { de: 'Ephesus', en: 'Ephesus', lat: 37.93912, lon: 27.3407, placeId: 'a5feb15', ref: { de: 'Apg 19,1-41', en: 'Acts 19:1-41' }, note: { de: 'Zwei Jahre täglich im Hörsaal des Tyrannus; der Aufruhr der Silberschmiede.', en: 'Two years daily in the hall of Tyrannus; the silversmiths’ riot.' } },
      { de: 'Mazedonien', en: 'Macedonia', lat: 41.6, lon: 22.54, placeId: 'a69e1b8', ref: { de: 'Apg 20,1-2', en: 'Acts 20:1-2' } },
      { de: 'Griechenland (Korinth)', en: 'Greece (Corinth)', lat: 37.90579, lon: 22.87874, placeId: 'a6f437a', ref: { de: 'Apg 20,2-3', en: 'Acts 20:2-3' }, note: { de: 'Drei Monate; hier entsteht der Römerbrief.', en: 'Three months; the letter to the Romans is written here.' } },
      { de: 'Philippi', en: 'Philippi', lat: 41.01207, lon: 24.28458, placeId: 'a49e1d0', ref: { de: 'Apg 20,6', en: 'Acts 20:6' }, back: true },
      { de: 'Troas', en: 'Troas', lat: 39.75194, lon: 26.15861, placeId: 'a91c509', ref: { de: 'Apg 20,6-12', en: 'Acts 20:6-12' }, note: { de: 'Eutychus fällt aus dem Fenster – und steht wieder auf.', en: 'Eutychus falls from the window – and gets up again.' }, back: true },
      { de: 'Assos & Mitylene', en: 'Assos & Mitylene', lat: 39.49056, lon: 26.33667, placeId: 'a0a2ca7', ref: { de: 'Apg 20,13-14', en: 'Acts 20:13-14' }, back: true },
      { de: 'Chios & Samos', en: 'Chios & Samos', lat: 38.3725, lon: 26.1375, placeId: 'a4c2c75', ref: { de: 'Apg 20,15', en: 'Acts 20:15' }, back: true },
      { de: 'Milet', en: 'Miletus', lat: 37.53111, lon: 27.27556, placeId: 'a55027d', ref: { de: 'Apg 20,15-38', en: 'Acts 20:15-38' }, note: { de: 'Der Abschied von den Ältesten aus Ephesus.', en: 'The farewell to the elders from Ephesus.' }, back: true },
      { de: 'Kos, Rhodos, Patara', en: 'Cos, Rhodes, Patara', lat: 36.81528, lon: 27.11028, placeId: 'a398e5d', ref: { de: 'Apg 21,1', en: 'Acts 21:1' }, back: true },
      { de: 'Tyrus', en: 'Tyre', lat: 33.27083, lon: 35.19611, placeId: 'a160272', ref: { de: 'Apg 21,3-6', en: 'Acts 21:3-6' }, back: true },
      { de: 'Ptolemais', en: 'Ptolemais', lat: 32.9214, lon: 35.0692, placeId: 'abc2af0', ref: { de: 'Apg 21,7', en: 'Acts 21:7' }, back: true },
      { de: 'Cäsarea', en: 'Caesarea', lat: 32.5, lon: 34.89167, placeId: 'a58735e', ref: { de: 'Apg 21,8-14', en: 'Acts 21:8-14' }, note: { de: 'Agabus kündigt die Gefangenschaft an; Paulus reist weiter.', en: 'Agabus foretells the imprisonment; Paul travels on.' }, back: true },
      { de: 'Jerusalem', en: 'Jerusalem', lat: 31.77667, lon: 35.23417, placeId: 'a15257a', ref: { de: 'Apg 21,15-17', en: 'Acts 21:15-17' }, back: true },
    ],
  },
  {
    id: 'rome',
    de: 'Die Fahrt nach Rom',
    en: 'The voyage to Rome',
    years: { de: '~59–62 n. Chr.', en: 'c. AD 59–62' },
    passage: { de: 'Apostelgeschichte 27-28', en: 'Acts 27-28' },
    color: '#b0436b',
    summary: {
      de: 'Als Gefangener kommt Paulus dorthin, wohin er als Freier wollte: nach Rom. Sturm, Schiffbruch und ein Winter auf Malta liegen dazwischen – die Apostelgeschichte endet mit zwei Jahren Predigt in der Hauptstadt, „ungehindert“.',
      en: 'As a prisoner Paul reaches the place he had hoped to visit as a free man: Rome. Storm, shipwreck and a winter on Malta lie in between – Acts ends with two years of preaching in the capital, "unhindered".',
    },
    stops: [
      { de: 'Cäsarea', en: 'Caesarea', lat: 32.5, lon: 34.89167, placeId: 'a58735e', ref: { de: 'Apg 27,1-2', en: 'Acts 27:1-2' } },
      { de: 'Sidon', en: 'Sidon', lat: 33.56099, lon: 35.37194, placeId: 'a98e4d7', ref: { de: 'Apg 27,3', en: 'Acts 27:3' } },
      { de: 'Myra', en: 'Myra', lat: 36.25917, lon: 29.98528, placeId: 'aa4b3e2', ref: { de: 'Apg 27,5-6', en: 'Acts 27:5-6' }, note: { de: 'Umstieg auf ein alexandrinisches Getreideschiff.', en: 'Transfer to an Alexandrian grain ship.' } },
      { de: 'Knidos', en: 'Cnidus', lat: 36.68583, lon: 27.375, placeId: 'ab793ce', ref: { de: 'Apg 27,7', en: 'Acts 27:7' } },
      { de: 'Schöne Häfen (Kreta)', en: 'Fair Havens (Crete)', lat: 34.92969, lon: 24.80031, placeId: 'aae626a', ref: { de: 'Apg 27,8-12', en: 'Acts 27:8-12' }, note: { de: 'Paulus rät zu überwintern – man fährt trotzdem weiter.', en: 'Paul advises wintering there – they sail on anyway.' } },
      { de: 'Kauda', en: 'Cauda', lat: 34.83333, lon: 24.08333, placeId: 'aca2b0a', ref: { de: 'Apg 27,16', en: 'Acts 27:16' }, note: { de: 'Vierzehn Tage im Sturm „Eurakylon“.', en: 'Fourteen days in the storm called "Euraquilo".' } },
      { de: 'Malta', en: 'Malta', lat: 35.93346, lon: 14.41173, placeId: 'a57835d', ref: { de: 'Apg 27,39-28,10', en: 'Acts 27:39-28:10' }, note: { de: 'Schiffbruch, Schlangenbiss, Heilungen – und ein Winter auf der Insel.', en: 'Shipwreck, snakebite, healings – and a winter on the island.' } },
      { de: 'Syrakus', en: 'Syracuse', lat: 37.06389, lon: 15.29306, placeId: 'a1e3697', ref: { de: 'Apg 28,12', en: 'Acts 28:12' } },
      { de: 'Rhegion', en: 'Rhegium', lat: 38.1088, lon: 15.64412, placeId: 'a63bb26', ref: { de: 'Apg 28,13', en: 'Acts 28:13' } },
      { de: 'Puteoli', en: 'Puteoli', lat: 40.82611, lon: 14.12056, placeId: 'a4488e9', ref: { de: 'Apg 28,13-14', en: 'Acts 28:13-14' }, note: { de: 'Dort finden sie bereits Brüder – die Gemeinde war schneller.', en: 'They already find brothers there – the church got there first.' } },
      { de: 'Drei Tavernen', en: 'Three Taverns', lat: 41.56194, lon: 12.87389, placeId: 'afef438', ref: { de: 'Apg 28,15', en: 'Acts 28:15' } },
      { de: 'Rom', en: 'Rome', lat: 41.8922, lon: 12.4852, placeId: 'afc8e7a', ref: { de: 'Apg 28,16-31', en: 'Acts 28:16-31' }, note: { de: 'Zwei Jahre in einer Mietwohnung: „Er predigte das Reich Gottes … ungehindert.“', en: 'Two years in rented lodgings: "proclaiming the kingdom of God … unhindered."' } },
    ],
  },
];

export const JOURNEY_BY_ID: Record<string, MissionJourney> = Object.fromEntries(
  JOURNEYS.map((j) => [j.id, j]),
);

/* ------------------------------------------------------------------ */
/* Die Ausbreitung nach der Apostelgeschichte                          */
/* ------------------------------------------------------------------ */

export interface SpreadPhase {
  id: string;
  de: string;
  en: string;
  range: Bilingual;
  /** Jahre, die die Phase umspannt – für den Zeitregler. */
  from: number;
  to: number;
  color: string;
  lead: Bilingual;
  /** Kartenausschnitt, wenn die Phase geöffnet wird. */
  view: { center: [number, number]; zoom: number };
}

export interface SpreadEvent {
  id: string;
  phase: string;
  /** Jahr für die Sortierung; die Anzeige nutzt `when`. */
  year: number;
  when: Bilingual;
  de: string;
  en: string;
  lat: number;
  lon: number;
  /** Ausgangspunkt – zeichnet einen Bogen auf der Karte. */
  from?: [number, number];
  text: Bilingual;
  /** Stichwort für den Nachschlage-Link (deutsche Wikipedia). */
  topic?: string;
  topicEn?: string;
}

export const PHASES: SpreadPhase[] = [
  {
    id: 'journeys',
    de: 'Die Reisen des Paulus',
    en: "Paul's journeys",
    range: { de: '30–62 n. Chr.', en: 'AD 30–62' },
    from: 30,
    to: 62,
    color: '#b8742e',
    lead: {
      de: 'Die Apostelgeschichte erzählt die Ausbreitung als Reisebericht: von Jerusalem über Antiochia bis nach Rom.',
      en: 'Acts tells the spread as a travelogue: from Jerusalem via Antioch all the way to Rome.',
    },
    view: { center: [37, 26], zoom: 5 },
  },
  {
    id: 'apostolic',
    de: 'Die anderen Wege',
    en: 'The other roads',
    range: { de: '30–100 n. Chr.', en: 'AD 30–100' },
    from: 30,
    to: 100,
    color: '#9a4ba0',
    lead: {
      de: 'Neben Paulus zogen andere los – nach Ägypten, Mesopotamien, Armenien, bis nach Indien. Für diese Wege gibt es keine Apostelgeschichte, nur frühe Überlieferung.',
      en: 'Others set out besides Paul – to Egypt, Mesopotamia, Armenia, as far as India. For these roads there is no book of Acts, only early tradition.',
    },
    view: { center: [30, 45], zoom: 4 },
  },
  {
    id: 'empire',
    de: 'Im Römischen Reich',
    en: 'Across the Roman Empire',
    range: { de: '100–500 n. Chr.', en: 'AD 100–500' },
    from: 100,
    to: 500,
    color: '#2f8f7f',
    lead: {
      de: 'Aus einer verfolgten Minderheit wird in vier Jahrhunderten die Religion des Reiches – und zugleich wächst die Kirche jenseits seiner Grenzen: in Armenien, Persien, Äthiopien, Georgien.',
      en: 'In four centuries a persecuted minority becomes the religion of the empire – while the church also grows beyond its borders: in Armenia, Persia, Ethiopia, Georgia.',
    },
    view: { center: [33, 32], zoom: 4 },
  },
  {
    id: 'medieval',
    de: 'Über Europa und Asien',
    en: 'Across Europe and Asia',
    range: { de: '500–1500', en: '500–1500' },
    from: 500,
    to: 1500,
    color: '#3a6ea8',
    lead: {
      de: 'Mönche, Händler und Übersetzer tragen die Botschaft nach Irland, an den Rhein, zu den Slawen und die Seidenstraße entlang bis nach China.',
      en: 'Monks, merchants and translators carry the message to Ireland, the Rhine, the Slavs and along the Silk Road as far as China.',
    },
    view: { center: [45, 45], zoom: 3 },
  },
  {
    id: 'discovery',
    de: 'Über die Weltmeere',
    en: 'Across the oceans',
    range: { de: '1500–1800', en: '1500–1800' },
    from: 1500,
    to: 1800,
    color: '#c2812a',
    lead: {
      de: 'Mit den Schiffen der Kolonialmächte reisen auch Missionare – nach Amerika, Afrika und Asien. Mission und Kolonialgewalt liegen in dieser Zeit oft dicht beieinander.',
      en: 'Missionaries travel on the ships of the colonial powers – to the Americas, Africa and Asia. In this era mission and colonial force often lie uncomfortably close together.',
    },
    view: { center: [10, 20], zoom: 2 },
  },
  {
    id: 'century',
    de: 'Das große Missionsjahrhundert',
    en: 'The great century of missions',
    range: { de: '1800–1900', en: '1800–1900' },
    from: 1800,
    to: 1900,
    color: '#b0436b',
    lead: {
      de: 'Bibelgesellschaften, Missionsgesellschaften und Tausende Freiwillige – und immer öfter tragen einheimische Christen die Botschaft selbst weiter.',
      en: 'Bible societies, mission societies and thousands of volunteers – and increasingly local Christians carry the message onward themselves.',
    },
    view: { center: [15, 30], zoom: 2 },
  },
  {
    id: 'modern',
    de: 'Weltweite Kirche',
    en: 'A worldwide church',
    range: { de: '1900–heute', en: '1900–today' },
    from: 1900,
    to: 2025,
    color: '#5c8a3a',
    lead: {
      de: 'Im 20. Jahrhundert verschiebt sich der Schwerpunkt der Christenheit nach Süden: Afrika, Lateinamerika und Asien senden heute selbst aus – „von überall nach überall“.',
      en: 'In the 20th century the centre of gravity of Christianity moves south: Africa, Latin America and Asia now send out themselves – "from everywhere to everywhere".',
    },
    view: { center: [10, 10], zoom: 2 },
  },
];

export const PHASE_BY_ID: Record<string, SpreadPhase> = Object.fromEntries(
  PHASES.map((p) => [p.id, p]),
);

export const SPREAD_EVENTS: SpreadEvent[] = [
  // --- Apostolische Zeit ------------------------------------------------
  {
    id: 'pentecost', phase: 'apostolic', year: 30, when: { de: 'um 30', en: 'c. 30' },
    de: 'Pfingsten in Jerusalem', en: 'Pentecost in Jerusalem',
    lat: 31.777, lon: 35.234,
    text: {
      de: 'Die Liste der Völker in Apostelgeschichte 2 – Parther, Meder, Elamiter, Ägypter, Römer – ist so etwas wie das Inhaltsverzeichnis der ganzen Ausbreitung.',
      en: 'The list of nations in Acts 2 – Parthians, Medes, Elamites, Egyptians, Romans – reads like the table of contents for the whole expansion.',
    },
    topic: 'Pfingsten', topicEn: 'Pentecost',
  },
  {
    id: 'rome-early', phase: 'apostolic', year: 49, when: { de: 'vor 49', en: 'before 49' },
    de: 'Rom: eine Gemeinde ohne Gründer', en: 'Rome: a church with no founder',
    lat: 41.892, lon: 12.485, from: JERUSALEM,
    text: {
      de: 'Als Kaiser Claudius die Juden aus Rom weist, sind Priska und Aquila bereits Christen. Niemand weiß, wer die Gemeinde in der Hauptstadt gegründet hat – sie war einfach da.',
      en: 'When Claudius expels the Jews from Rome, Priscilla and Aquila are already Christians. Nobody knows who founded the church in the capital – it was simply there.',
    },
    topic: 'Claudius-Edikt', topicEn: 'Edict of Claudius',
  },
  {
    id: 'alexandria', phase: 'apostolic', year: 60, when: { de: 'um 60 (Überlieferung)', en: 'c. 60 (tradition)' },
    de: 'Alexandria: Markus in Ägypten', en: 'Alexandria: Mark in Egypt',
    lat: 31.183, lon: 29.896, from: JERUSALEM,
    text: {
      de: 'Die koptische Kirche führt sich auf den Evangelisten Markus zurück. Sicher ist: Alexandria wird früh zu einem Zentrum christlicher Gelehrsamkeit.',
      en: 'The Coptic Church traces itself to Mark the Evangelist. What is certain: Alexandria becomes an early centre of Christian learning.',
    },
    topic: 'Koptische Kirche', topicEn: 'Coptic Orthodox Church',
  },
  {
    id: 'edessa', phase: 'apostolic', year: 50, when: { de: 'um 50 (Überlieferung)', en: 'c. 50 (tradition)' },
    de: 'Edessa: das Evangelium auf Syrisch', en: 'Edessa: the gospel in Syriac',
    lat: 37.15, lon: 38.795, from: JERUSALEM,
    text: {
      de: 'Östlich des Reiches entsteht eine Kirche, die nicht Griechisch, sondern Aramäisch/Syrisch spricht – die Sprachwelt Jesu. Von hier führen die Wege weiter nach Persien und Zentralasien.',
      en: 'East of the empire a church arises that speaks not Greek but Aramaic/Syriac – the language world of Jesus. From here the roads run on to Persia and Central Asia.',
    },
    topic: 'Syrische Kirche', topicEn: 'Syriac Christianity',
  },
  {
    id: 'india-thomas', phase: 'apostolic', year: 52, when: { de: 'um 52 (Überlieferung)', en: 'c. 52 (tradition)' },
    de: 'Indien: die Thomaschristen', en: 'India: the Thomas Christians',
    lat: 10.22, lon: 76.2, from: JERUSALEM,
    text: {
      de: 'An der Malabarküste in Kerala lebt bis heute eine Kirche, die ihre Gründung auf den Apostel Thomas zurückführt – lange bevor Europa christlich war.',
      en: 'On the Malabar coast in Kerala a church survives to this day that traces its founding to the apostle Thomas – long before Europe was Christian.',
    },
    topic: 'Thomaschristen', topicEn: 'Saint Thomas Christians',
  },
  {
    id: 'babylon-peter', phase: 'apostolic', year: 64, when: { de: 'um 64', en: 'c. 64' },
    de: 'Grüße aus „Babylon“', en: 'Greetings from "Babylon"',
    lat: 32.543, lon: 44.422, from: JERUSALEM,
    text: {
      de: 'Der erste Petrusbrief grüßt aus „Babylon“ und schreibt an Gemeinden in Pontus, Galatien, Kappadozien, Asien und Bithynien – ganz Kleinasien ist erreicht.',
      en: '1 Peter sends greetings from "Babylon" and writes to churches in Pontus, Galatia, Cappadocia, Asia and Bithynia – all of Asia Minor has been reached.',
    },
    topic: '1. Petrusbrief', topicEn: 'First Epistle of Peter',
  },
  {
    id: 'nero', phase: 'apostolic', year: 64, when: { de: '64', en: '64' },
    de: 'Rom brennt: die erste Verfolgung', en: 'Rome burns: the first persecution',
    lat: 41.892, lon: 12.485,
    text: {
      de: 'Nero macht die Christen für den Brand Roms verantwortlich. Die Überlieferung setzt hier den Tod von Petrus und Paulus an – die Bewegung wächst trotzdem weiter.',
      en: 'Nero blames the Christians for the fire of Rome. Tradition places the deaths of Peter and Paul here – the movement keeps growing anyway.',
    },
    topic: 'Christenverfolgung im Römischen Reich', topicEn: 'Persecution of Christians in the Roman Empire',
  },
  {
    id: 'patmos', phase: 'apostolic', year: 95, when: { de: 'um 95', en: 'c. 95' },
    de: 'Patmos & Ephesus: die sieben Gemeinden', en: 'Patmos & Ephesus: the seven churches',
    lat: 37.309, lon: 26.549, from: JERUSALEM,
    text: {
      de: 'Die Offenbarung schreibt an sieben Gemeinden in der Provinz Asien – ein dichtes Netz von Kirchen, keine 70 Jahre nach Ostern.',
      en: 'Revelation writes to seven churches in the province of Asia – a dense network of congregations, less than 70 years after Easter.',
    },
    topic: 'Sendschreiben', topicEn: 'Seven churches of Asia',
  },

  // --- Römisches Reich --------------------------------------------------
  {
    id: 'lyon', phase: 'empire', year: 177, when: { de: '177', en: '177' },
    de: 'Lyon: Märtyrer in Gallien', en: 'Lyon: martyrs in Gaul',
    lat: 45.764, lon: 4.836, from: ROME,
    text: {
      de: 'Der Brief der Gemeinden von Lyon und Vienne zeigt: Das Evangelium ist die Rhône hinauf bis nach Gallien gelangt – getragen von Händlern aus Kleinasien.',
      en: 'The letter of the churches of Lyon and Vienne shows the gospel has travelled up the Rhône into Gaul – carried by traders from Asia Minor.',
    },
    topic: 'Märtyrer von Lyon', topicEn: 'Martyrs of Lyon',
  },
  {
    id: 'carthage', phase: 'empire', year: 180, when: { de: 'um 180', en: 'c. 180' },
    de: 'Karthago: die Kirche auf Latein', en: 'Carthage: the church in Latin',
    lat: 36.853, lon: 10.323, from: ROME,
    text: {
      de: 'In Nordafrika entsteht die erste lateinischsprachige Theologie – Tertullian, später Cyprian und Augustinus. Die Bibel wird ins Lateinische übersetzt.',
      en: 'North Africa produces the first Latin-speaking theology – Tertullian, later Cyprian and Augustine. The Bible is translated into Latin.',
    },
    topic: 'Tertullian', topicEn: 'Tertullian',
  },
  {
    id: 'persia-church', phase: 'empire', year: 250, when: { de: 'um 250', en: 'c. 250' },
    de: 'Seleukia-Ktesiphon: die Kirche des Ostens', en: 'Seleucia-Ctesiphon: the Church of the East',
    lat: 33.094, lon: 44.581,
    text: {
      de: 'Im Perserreich wächst eine eigenständige Kirche mit syrischer Liturgie – außerhalb des Römischen Reiches und deshalb oft als „fremde“ Religion verdächtigt.',
      en: 'In the Persian empire an independent church with a Syriac liturgy grows – outside the Roman empire, and therefore often suspected as a "foreign" religion.',
    },
    topic: 'Apostolische Kirche des Ostens', topicEn: 'Church of the East',
  },
  {
    id: 'armenia', phase: 'empire', year: 301, when: { de: 'um 301', en: 'c. 301' },
    de: 'Armenien: das erste christliche Königreich', en: 'Armenia: the first Christian kingdom',
    lat: 40.162, lon: 44.291,
    text: {
      de: 'König Trdat lässt sich von Gregor dem Erleuchter taufen – Armenien wird als erstes Land christlich, ein gutes Jahrzehnt vor Konstantins Wende.',
      en: 'King Tiridates is baptised by Gregory the Illuminator – Armenia becomes the first Christian nation, a decade before Constantine’s turn.',
    },
    topic: 'Gregor der Erleuchter', topicEn: 'Gregory the Illuminator',
  },
  {
    id: 'milan', phase: 'empire', year: 313, when: { de: '313', en: '313' },
    de: 'Mailand: das Ende der Verfolgung', en: 'Milan: the end of persecution',
    lat: 45.464, lon: 9.19,
    text: {
      de: 'Konstantin und Licinius gewähren Religionsfreiheit. Aus der verfolgten Minderheit wird binnen weniger Jahrzehnte die geförderte – und ab 380 die offizielle – Religion des Reiches.',
      en: 'Constantine and Licinius grant religious freedom. Within decades the persecuted minority becomes the favoured – and from 380 the official – religion of the empire.',
    },
    topic: 'Mailänder Vereinbarung', topicEn: 'Edict of Milan',
  },
  {
    id: 'georgia', phase: 'empire', year: 337, when: { de: 'um 337', en: 'c. 337' },
    de: 'Georgien: Nino in Mzcheta', en: 'Georgia: Nino at Mtskheta',
    lat: 41.843, lon: 44.721,
    text: {
      de: 'Eine gefangene Christin, Nino, überzeugt das Königshaus von Iberien – Georgien wird eines der frühesten christlichen Länder.',
      en: 'A captive Christian woman, Nino, convinces the royal house of Iberia – Georgia becomes one of the earliest Christian nations.',
    },
    topic: 'Nino von Georgien', topicEn: 'Saint Nino',
  },
  {
    id: 'axum', phase: 'empire', year: 340, when: { de: 'um 340', en: 'c. 340' },
    de: 'Aksum: Äthiopien wird christlich', en: 'Axum: Ethiopia becomes Christian',
    lat: 14.131, lon: 38.719, from: [31.183, 29.896],
    text: {
      de: 'Frumentius, als Junge nach Aksum verschlagen, wird der erste Bischof Äthiopiens. Die äthiopische Kirche besteht seit 1700 Jahren ohne Unterbrechung.',
      en: 'Frumentius, shipwrecked at Axum as a boy, becomes Ethiopia’s first bishop. The Ethiopian church has continued unbroken for 1,700 years.',
    },
    topic: 'Frumentius', topicEn: 'Frumentius',
  },
  {
    id: 'wulfila', phase: 'empire', year: 350, when: { de: 'um 350', en: 'c. 350' },
    de: 'Wulfila übersetzt für die Goten', en: 'Ulfilas translates for the Goths',
    lat: 44.0, lon: 26.1, from: CONSTANTINOPLE,
    text: {
      de: 'Für die Goten an der Donau erfindet Wulfila eine Schrift und übersetzt die Bibel – das älteste erhaltene Buch einer germanischen Sprache.',
      en: 'For the Goths on the Danube, Ulfilas invents an alphabet and translates the Bible – the oldest surviving book in a Germanic language.',
    },
    topic: 'Wulfila', topicEn: 'Ulfilas',
  },
  {
    id: 'merv', phase: 'empire', year: 420, when: { de: 'um 420', en: 'c. 420' },
    de: 'Merw: entlang der Seidenstraße', en: 'Merv: along the Silk Road',
    lat: 37.662, lon: 62.192, from: CTESIPHON,
    text: {
      de: 'Bischofssitze in Merw und Herat markieren die Route, auf der die Kirche des Ostens den Handelswegen nach Zentralasien folgt.',
      en: 'Bishoprics at Merv and Herat mark the route by which the Church of the East follows the trade roads into Central Asia.',
    },
    topic: 'Seidenstraße', topicEn: 'Silk Road',
  },
  {
    id: 'patrick', phase: 'empire', year: 432, when: { de: 'um 432', en: 'c. 432' },
    de: 'Irland: Patrick kehrt zurück', en: 'Ireland: Patrick returns',
    lat: 54.35, lon: -6.654, from: [51.5, -2.6],
    text: {
      de: 'Als Sklave nach Irland verschleppt, kehrt Patrick freiwillig zurück – an den Rand der bekannten Welt. Irland wird binnen zweier Generationen christlich.',
      en: 'Carried off to Ireland as a slave, Patrick returns of his own will – to the edge of the known world. Ireland becomes Christian within two generations.',
    },
    topic: 'Patrick von Irland', topicEn: 'Saint Patrick',
  },

  // --- Mittelalter -------------------------------------------------------
  {
    id: 'iona', phase: 'medieval', year: 563, when: { de: '563', en: '563' },
    de: 'Iona: irische Mönche nach Norden', en: 'Iona: Irish monks head north',
    lat: 56.335, lon: -6.397, from: [54.35, -6.654],
    text: {
      de: 'Columba gründet auf einer Hebrideninsel ein Kloster, von dem aus Schottland und Nordengland missioniert werden. Klöster werden zu Missionsstationen.',
      en: 'Columba founds a monastery on a Hebridean island from which Scotland and northern England are evangelised. Monasteries become mission stations.',
    },
    topic: 'Columban von Iona', topicEn: 'Columba',
  },
  {
    id: 'canterbury', phase: 'medieval', year: 597, when: { de: '597', en: '597' },
    de: 'Canterbury: Mission von Rom aus', en: 'Canterbury: mission sent from Rome',
    lat: 51.279, lon: 1.083, from: ROME,
    text: {
      de: 'Gregor der Große schickt Augustinus zu den Angelsachsen – die erste vom Papst geplante Mission.',
      en: 'Gregory the Great sends Augustine to the Anglo-Saxons – the first mission planned from Rome.',
    },
    topic: 'Augustinus von Canterbury', topicEn: 'Augustine of Canterbury',
  },
  {
    id: 'xian', phase: 'medieval', year: 635, when: { de: '635', en: '635' },
    de: 'Xi’an: das Evangelium in China', en: "Xi'an: the gospel reaches China",
    lat: 34.341, lon: 108.94, from: CTESIPHON,
    text: {
      de: 'Der Mönch Alopen erreicht die Tang-Hauptstadt. Eine Steinstele von 781 beschreibt auf Chinesisch und Syrisch die „leuchtende Lehre“ – 800 Jahre vor den ersten europäischen Missionaren.',
      en: 'The monk Alopen reaches the Tang capital. A stele of 781 describes the "luminous teaching" in Chinese and Syriac – 800 years before the first European missionaries.',
    },
    topic: 'Nestorianische Stele', topicEn: 'Xi’an Stele',
  },
  {
    id: 'nubia', phase: 'medieval', year: 540, when: { de: 'um 540', en: 'c. 540' },
    de: 'Nubien: christliche Königreiche am Nil', en: 'Nubia: Christian kingdoms on the Nile',
    lat: 18.55, lon: 30.55, from: [31.183, 29.896],
    text: {
      de: 'Am mittleren Nil entstehen drei christliche Reiche, die fast tausend Jahre bestehen – lange bekannt nur aus Ruinen und Wandmalereien.',
      en: 'Three Christian kingdoms arise on the middle Nile and last almost a thousand years – long known only from ruins and wall paintings.',
    },
    topic: 'Christliches Nubien', topicEn: 'Nubia',
  },
  {
    id: 'boniface', phase: 'medieval', year: 723, when: { de: '723', en: '723' },
    de: 'Bonifatius fällt die Donareiche', en: 'Boniface fells the oak of Thor',
    lat: 51.132, lon: 9.283, from: [51.279, 1.083],
    text: {
      de: 'Der Angelsachse Winfrid – Bonifatius – missioniert Hessen und Thüringen und ordnet die Kirche im Frankenreich. Aus Missionierten sind Missionare geworden.',
      en: 'The Anglo-Saxon Wynfrith – Boniface – evangelises Hesse and Thuringia and organises the church in the Frankish realm. The evangelised have become evangelists.',
    },
    topic: 'Bonifatius', topicEn: 'Saint Boniface',
  },
  {
    id: 'cyril', phase: 'medieval', year: 863, when: { de: '863', en: '863' },
    de: 'Kyrill und Method bei den Slawen', en: 'Cyril and Methodius among the Slavs',
    lat: 49.06, lon: 17.46, from: CONSTANTINOPLE,
    text: {
      de: 'Die beiden Brüder aus Thessaloniki schaffen eine Schrift für das Slawische und übersetzen die Liturgie – gegen den Widerstand derer, die nur drei „heilige Sprachen“ gelten lassen wollten.',
      en: 'The two brothers from Thessalonica create an alphabet for Slavonic and translate the liturgy – against those who would allow only three "sacred languages".',
    },
    topic: 'Kyrill und Method', topicEn: 'Saints Cyril and Methodius',
  },
  {
    id: 'kyiv', phase: 'medieval', year: 988, when: { de: '988', en: '988' },
    de: 'Kiew: die Taufe der Rus', en: 'Kyiv: the baptism of the Rus',
    lat: 50.45, lon: 30.523, from: CONSTANTINOPLE,
    text: {
      de: 'Fürst Wladimir wählt für sein Reich das Christentum byzantinischer Prägung – der Beginn der ostslawischen Christenheit.',
      en: 'Prince Vladimir chooses Byzantine Christianity for his realm – the beginning of East Slavic Christianity.',
    },
    topic: 'Wladimir I.', topicEn: 'Vladimir the Great',
  },
  {
    id: 'iceland', phase: 'medieval', year: 1000, when: { de: 'um 1000', en: 'c. 1000' },
    de: 'Island und Skandinavien', en: 'Iceland and Scandinavia',
    lat: 64.146, lon: -21.94, from: [55.676, 12.568],
    text: {
      de: 'Das isländische Allthing beschließt im Jahr 1000 den Übertritt zum Christentum – der Norden Europas wird binnen weniger Generationen christlich.',
      en: 'In the year 1000 the Icelandic Althing decides to adopt Christianity – northern Europe turns Christian within a few generations.',
    },
    topic: 'Christianisierung Islands', topicEn: 'Christianization of Iceland',
  },
  {
    id: 'damietta', phase: 'medieval', year: 1219, when: { de: '1219', en: '1219' },
    de: 'Damiette: Franziskus beim Sultan', en: 'Damietta: Francis meets the sultan',
    lat: 31.418, lon: 31.814, from: [43.1, 12.6],
    text: {
      de: 'Mitten im Kreuzzug geht Franz von Assisi unbewaffnet zu Sultan al-Kamil – ein anderer Weg, der lange die Ausnahme bleibt.',
      en: 'In the middle of a crusade Francis of Assisi walks unarmed to Sultan al-Kamil – a different approach, and long an exception.',
    },
    topic: 'Franz von Assisi', topicEn: 'Francis of Assisi',
  },
  {
    id: 'khanbaliq', phase: 'medieval', year: 1294, when: { de: '1294', en: '1294' },
    de: 'Khanbaliq: Montecorvino in Peking', en: 'Khanbaliq: Montecorvino in Beijing',
    lat: 39.904, lon: 116.407, from: ROME,
    text: {
      de: 'Johannes von Montecorvino übersetzt das Neue Testament ins Mongolische und baut eine Kirche in der Hauptstadt des Khans. Nach dem Sturz der Yuan-Dynastie verschwindet die Gemeinde wieder.',
      en: 'John of Montecorvino translates the New Testament into Mongolian and builds a church in the khan’s capital. After the fall of the Yuan dynasty the community disappears again.',
    },
    topic: 'Johannes von Montecorvino', topicEn: 'John of Montecorvino',
  },
  {
    id: 'gutenberg', phase: 'medieval', year: 1455, when: { de: '1455', en: '1455' },
    de: 'Mainz: die gedruckte Bibel', en: 'Mainz: the printed Bible',
    lat: 49.992, lon: 8.247,
    text: {
      de: 'Gutenbergs Druckpresse macht die Bibel vervielfältigbar – die technische Voraussetzung für alles, was in den nächsten Jahrhunderten an Übersetzung und Verbreitung folgt.',
      en: 'Gutenberg’s press makes the Bible reproducible – the technical precondition for everything that follows in translation and distribution.',
    },
    topic: 'Gutenberg-Bibel', topicEn: 'Gutenberg Bible',
  },

  // --- Über die Weltmeere ------------------------------------------------
  {
    id: 'kongo', phase: 'discovery', year: 1491, when: { de: '1491', en: '1491' },
    de: 'Königreich Kongo', en: 'Kingdom of Kongo',
    lat: -6.269, lon: 14.249, from: LISBON,
    text: {
      de: 'Der König von Kongo lässt sich taufen; sein Sohn Afonso I. macht das Christentum zur Staatsreligion. Zugleich beginnt mit denselben Schiffen der atlantische Sklavenhandel.',
      en: 'The king of Kongo is baptised; his son Afonso I makes Christianity the state religion. On the same ships the Atlantic slave trade begins.',
    },
    topic: 'Königreich Kongo', topicEn: 'Kingdom of Kongo',
  },
  {
    id: 'wittenberg', phase: 'discovery', year: 1517, when: { de: '1517', en: '1517' },
    de: 'Wittenberg: die Bibel in der Volkssprache', en: 'Wittenberg: the Bible in the vernacular',
    lat: 51.866, lon: 12.647,
    text: {
      de: 'Die Reformation setzt auf Übersetzung: Luthers Bibel prägt eine Sprache und macht das Prinzip stark, dass jeder den Text in seiner eigenen Sprache lesen soll.',
      en: 'The Reformation bets on translation: Luther’s Bible shapes a language and entrenches the principle that everyone should read the text in their own tongue.',
    },
    topic: 'Lutherbibel', topicEn: 'Luther Bible',
  },
  {
    id: 'mexico', phase: 'discovery', year: 1524, when: { de: '1524', en: '1524' },
    de: 'Neuspanien: Mission und Eroberung', en: 'New Spain: mission and conquest',
    lat: 19.433, lon: -99.133, from: LISBON,
    text: {
      de: 'Franziskaner und Dominikaner kommen mit den Konquistadoren nach Mexiko. Einzelne – wie Bartolomé de las Casas – klagen die Gewalt gegen die Indigenen an; die meisten nicht.',
      en: 'Franciscans and Dominicans arrive in Mexico with the conquistadors. A few – like Bartolomé de las Casas – denounce the violence against indigenous people; most do not.',
    },
    topic: 'Bartolomé de Las Casas', topicEn: 'Bartolomé de las Casas',
  },
  {
    id: 'goa', phase: 'discovery', year: 1542, when: { de: '1542', en: '1542' },
    de: 'Goa: Franz Xaver in Indien', en: 'Goa: Francis Xavier in India',
    lat: 15.496, lon: 73.827, from: LISBON,
    text: {
      de: 'Der Jesuit Franz Xaver beginnt in Indien und reist weiter nach Malakka und Japan – der Auftakt der jesuitischen Asienmission.',
      en: 'The Jesuit Francis Xavier begins in India and travels on to Malacca and Japan – the start of the Jesuit mission in Asia.',
    },
    topic: 'Franz Xaver', topicEn: 'Francis Xavier',
  },
  {
    id: 'japan', phase: 'discovery', year: 1549, when: { de: '1549', en: '1549' },
    de: 'Japan: Kagoshima und die „verborgenen Christen“', en: 'Japan: Kagoshima and the "hidden Christians"',
    lat: 31.596, lon: 130.557, from: [15.496, 73.827],
    text: {
      de: 'Nach schnellem Wachstum folgt das Verbot: Ab 1614 leben Japans Christen zweieinhalb Jahrhunderte im Verborgenen – und sind 1865 immer noch da.',
      en: 'Rapid growth is followed by prohibition: from 1614 Japan’s Christians live hidden for two and a half centuries – and are still there in 1865.',
    },
    topic: 'Kakure Kirishitan', topicEn: 'Hidden Christians',
  },
  {
    id: 'manila', phase: 'discovery', year: 1565, when: { de: '1565', en: '1565' },
    de: 'Philippinen: Cebu und Manila', en: 'Philippines: Cebu and Manila',
    lat: 14.599, lon: 120.984, from: [19.433, -99.133],
    text: {
      de: 'Über den Pazifik, von Mexiko aus, wird das einzige mehrheitlich christliche Land Asiens gegründet – heute mit über 80 Millionen Christen.',
      en: 'Across the Pacific, from Mexico, the only majority-Christian country in Asia takes shape – today with more than 80 million Christians.',
    },
    topic: 'Christentum auf den Philippinen', topicEn: 'Christianity in the Philippines',
  },
  {
    id: 'ricci', phase: 'discovery', year: 1601, when: { de: '1601', en: '1601' },
    de: 'Matteo Ricci am Kaiserhof', en: 'Matteo Ricci at the imperial court',
    lat: 39.904, lon: 116.407, from: [15.496, 73.827],
    text: {
      de: 'Ricci lernt Chinesisch, kleidet sich wie ein Gelehrter und übersetzt Mathematik und Theologie – Mission als Gespräch mit einer Hochkultur.',
      en: 'Ricci learns Chinese, dresses as a scholar and translates mathematics and theology – mission as a conversation with a high culture.',
    },
    topic: 'Matteo Ricci', topicEn: 'Matteo Ricci',
  },
  {
    id: 'eliot', phase: 'discovery', year: 1663, when: { de: '1663', en: '1663' },
    de: 'Neuengland: die erste Bibel Amerikas', en: 'New England: America’s first Bible',
    lat: 42.301, lon: -71.06, from: LONDON,
    text: {
      de: 'John Eliot druckt die Bibel auf Massachusett – die erste in Amerika gedruckte Bibel überhaupt, in einer indigenen Sprache.',
      en: 'John Eliot prints the Bible in Massachusett – the first Bible printed in America, and in an indigenous language.',
    },
    topic: 'Eliot-Indianerbibel', topicEn: 'Eliot Indian Bible',
  },
  {
    id: 'tranquebar', phase: 'discovery', year: 1706, when: { de: '1706', en: '1706' },
    de: 'Tranquebar: die erste evangelische Mission', en: 'Tranquebar: the first Protestant mission',
    lat: 11.029, lon: 79.851, from: [51.866, 12.647],
    text: {
      de: 'Ziegenbalg und Plütschau landen in Südindien, lernen Tamil, gründen Schulen und übersetzen das Neue Testament – auch für Mädchen und für Kinder niedriger Kasten.',
      en: 'Ziegenbalg and Plütschau land in South India, learn Tamil, found schools and translate the New Testament – for girls and low-caste children too.',
    },
    topic: 'Bartholomäus Ziegenbalg', topicEn: 'Bartholomäus Ziegenbalg',
  },
  {
    id: 'moravians', phase: 'discovery', year: 1732, when: { de: '1732', en: '1732' },
    de: 'Herrnhut sendet aus', en: 'Herrnhut starts sending',
    lat: 17.743, lon: -64.703, from: HERRNHUT,
    text: {
      de: 'Aus einem sächsischen Dorf gehen Handwerker in die Karibik, nach Grönland, Südafrika und Labrador – im Verhältnis zur Gemeindegröße die intensivste Missionsbewegung der Geschichte.',
      en: 'From one Saxon village, craftsmen go to the Caribbean, Greenland, South Africa and Labrador – proportionally the most intense missionary movement in history.',
    },
    topic: 'Herrnhuter Brüdergemeine', topicEn: 'Moravian Church',
  },
  {
    id: 'greenland', phase: 'discovery', year: 1733, when: { de: '1733', en: '1733' },
    de: 'Grönland: Hans Egede', en: 'Greenland: Hans Egede',
    lat: 64.175, lon: -51.739, from: [55.676, 12.568],
    text: {
      de: 'In der Arktis muss Egede die Sprache erst lernen und Bilder finden, die dort tragen – „Brot“ etwa gab es nicht.',
      en: 'In the Arctic, Egede must first learn the language and find images that work there – there was no such thing as "bread".',
    },
    topic: 'Hans Egede', topicEn: 'Hans Egede',
  },

  // --- Das große Missionsjahrhundert -------------------------------------
  {
    id: 'carey', phase: 'century', year: 1793, when: { de: '1793', en: '1793' },
    de: 'William Carey nach Indien', en: 'William Carey to India',
    lat: 22.75, lon: 88.34, from: LONDON,
    text: {
      de: 'Der Schuster Carey gründet in Serampur eine Druckerei und lässt Bibelteile in über 30 indische Sprachen übersetzen – der Beginn der neuzeitlichen protestantischen Mission.',
      en: 'Carey the cobbler founds a printing press at Serampore and has parts of the Bible translated into over 30 Indian languages – the start of modern Protestant mission.',
    },
    topic: 'William Carey', topicEn: 'William Carey (missionary)',
  },
  {
    id: 'bfbs', phase: 'century', year: 1804, when: { de: '1804', en: '1804' },
    de: 'London: die Bibelgesellschaften', en: 'London: the Bible societies',
    lat: 51.507, lon: -0.128,
    text: {
      de: 'Weil ein walisisches Mädchen keine Bibel bekommen konnte, entsteht die Britische und Ausländische Bibelgesellschaft – Bibeln billig, in jeder Sprache, ohne Auslegung.',
      en: 'Because a Welsh girl could not get a Bible, the British and Foreign Bible Society is founded – Bibles cheap, in every language, without commentary.',
    },
    topic: 'Britische und Ausländische Bibelgesellschaft', topicEn: 'British and Foreign Bible Society',
  },
  {
    id: 'morrison', phase: 'century', year: 1807, when: { de: '1807', en: '1807' },
    de: 'Kanton: Robert Morrison', en: 'Canton: Robert Morrison',
    lat: 23.129, lon: 113.264, from: LONDON,
    text: {
      de: 'Morrison arbeitet 25 Jahre in Kanton, übersetzt die ganze Bibel ins Chinesische und verfasst das erste chinesisch-englische Wörterbuch – bei etwa zehn Taufen.',
      en: 'Morrison works 25 years in Canton, translates the whole Bible into Chinese and compiles the first Chinese-English dictionary – with around ten baptisms.',
    },
    topic: 'Robert Morrison', topicEn: 'Robert Morrison (missionary)',
  },
  {
    id: 'judson', phase: 'century', year: 1813, when: { de: '1813', en: '1813' },
    de: 'Birma: Adoniram Judson', en: 'Burma: Adoniram Judson',
    lat: 16.871, lon: 96.199, from: BOSTON,
    text: {
      de: 'Judsons burmesische Bibel wird bis heute benutzt. Die Botschaft fasst weniger bei der Mehrheit Fuß als bei den Karen und anderen Bergvölkern.',
      en: 'Judson’s Burmese Bible is still in use. The message takes root less among the majority than among the Karen and other hill peoples.',
    },
    topic: 'Adoniram Judson', topicEn: 'Adoniram Judson',
  },
  {
    id: 'freetown', phase: 'century', year: 1816, when: { de: 'ab 1816', en: 'from 1816' },
    de: 'Freetown: befreite Sklaven als Missionare', en: 'Freetown: freed slaves as missionaries',
    lat: 8.484, lon: -13.234, from: LONDON,
    text: {
      de: 'In Sierra Leone finden Menschen aus hunderten Völkern zusammen. Viele kehren als Christen in ihre Heimatregionen zurück – Westafrika wird zu großen Teilen von Afrikanern missioniert.',
      en: 'In Sierra Leone people from hundreds of peoples come together. Many return home as Christians – much of West Africa is evangelised by Africans.',
    },
    topic: 'Sierra Leone', topicEn: 'Sierra Leone Creole people',
  },
  {
    id: 'pacific', phase: 'century', year: 1820, when: { de: 'ab 1820', en: 'from 1820' },
    de: 'Pazifik: Hawaii, Tonga, Fidschi', en: 'Pacific: Hawaii, Tonga, Fiji',
    lat: -18.141, lon: 178.442, from: BOSTON,
    text: {
      de: 'Auf den Inseln übernehmen bald polynesische Christen selbst die Weiterreise – oft segeln sie in Kanus zu Inseln, die kein Europäer betreten hat.',
      en: 'On the islands, Polynesian Christians soon take over the onward journey – often sailing by canoe to islands no European has set foot on.',
    },
    topic: 'Christentum in Ozeanien', topicEn: 'Christianity in Oceania',
  },
  {
    id: 'crowther', phase: 'century', year: 1864, when: { de: '1864', en: '1864' },
    de: 'Samuel Ajayi Crowther', en: 'Samuel Ajayi Crowther',
    lat: 6.465, lon: 3.406,
    text: {
      de: 'Als Junge versklavt, befreit, in Freetown ausgebildet: Crowther übersetzt die Bibel ins Yoruba und wird der erste afrikanische anglikanische Bischof.',
      en: 'Enslaved as a boy, freed, trained in Freetown: Crowther translates the Bible into Yoruba and becomes the first African Anglican bishop.',
    },
    topic: 'Samuel Ajayi Crowther', topicEn: 'Samuel Ajayi Crowther',
  },
  {
    id: 'livingstone', phase: 'century', year: 1841, when: { de: 'ab 1841', en: 'from 1841' },
    de: 'David Livingstone quert Afrika', en: 'David Livingstone crosses Africa',
    lat: -17.925, lon: 25.856, from: LONDON,
    text: {
      de: 'Livingstones Reiseberichte machen den Sklavenhandel im Innern Afrikas öffentlich – und lösen eine Welle von Missionsgründungen aus, im Guten wie im Zwiespältigen.',
      en: 'Livingstone’s accounts expose the slave trade of Africa’s interior – and set off a wave of mission foundings, for better and for worse.',
    },
    topic: 'David Livingstone', topicEn: 'David Livingstone',
  },
  {
    id: 'taylor', phase: 'century', year: 1865, when: { de: '1865', en: '1865' },
    de: 'Hudson Taylor: ins Innere Chinas', en: 'Hudson Taylor: into inland China',
    lat: 31.23, lon: 121.474, from: LONDON,
    text: {
      de: 'Taylor trägt chinesische Kleidung, zieht in die Provinzen und gründet die China-Inland-Mission – ein Modell, das hunderte Gesellschaften kopieren.',
      en: 'Taylor wears Chinese dress, moves into the provinces and founds the China Inland Mission – a model hundreds of societies copy.',
    },
    topic: 'Hudson Taylor', topicEn: 'Hudson Taylor',
  },
  {
    id: 'uganda', phase: 'century', year: 1877, when: { de: '1877', en: '1877' },
    de: 'Buganda: eine Kirche aus Märtyrern', en: 'Buganda: a church of martyrs',
    lat: 0.318, lon: 32.581, from: LONDON,
    text: {
      de: 'Neun Jahre nach den ersten Missionaren sterben 1886 junge Christen am Hof des Kabaka. Uganda wird eines der christlichsten Länder Afrikas.',
      en: 'Nine years after the first missionaries, young Christians are killed at the kabaka’s court in 1886. Uganda becomes one of Africa’s most Christian countries.',
    },
    topic: 'Märtyrer von Uganda', topicEn: 'Uganda Martyrs',
  },
  {
    id: 'korea', phase: 'century', year: 1885, when: { de: '1885', en: '1885' },
    de: 'Seoul: Korea liest zuerst', en: 'Seoul: Korea reads first',
    lat: 37.567, lon: 126.978, from: BOSTON,
    text: {
      de: 'Bevor die ersten Missionare eintreffen, ist das Neue Testament schon auf Koreanisch übersetzt und im Land verbreitet – von Koreanern.',
      en: 'Before the first missionaries arrive, the New Testament has already been translated into Korean and circulated – by Koreans.',
    },
    topic: 'Christentum in Korea', topicEn: 'Christianity in Korea',
  },
  {
    id: 'svm', phase: 'century', year: 1886, when: { de: '1886', en: '1886' },
    de: 'Studentische Freiwilligenbewegung', en: 'Student Volunteer Movement',
    lat: 41.32, lon: -72.57,
    text: {
      de: '„Die Evangelisierung der Welt in dieser Generation“ – zehntausende Studierende melden sich; die Losung ist so mitreißend wie überzogen.',
      en: '"The evangelisation of the world in this generation" – tens of thousands of students sign up; the slogan is as stirring as it is overblown.',
    },
    topic: 'Studentische Freiwilligenbewegung', topicEn: 'Student Volunteer Movement',
  },

  // --- Moderne -----------------------------------------------------------
  {
    id: 'azusa', phase: 'modern', year: 1906, when: { de: '1906', en: '1906' },
    de: 'Azusa Street, Los Angeles', en: 'Azusa Street, Los Angeles',
    lat: 34.048, lon: -118.243,
    text: {
      de: 'Aus einer kleinen, gemischten Gemeinde unter William J. Seymour wird die Pfingstbewegung – heute die am schnellsten gewachsene christliche Strömung mit hunderten Millionen Anhängern.',
      en: 'A small, racially mixed congregation under William J. Seymour becomes the Pentecostal movement – today the fastest-growing Christian stream, with hundreds of millions of adherents.',
    },
    topic: 'Azusa-Street-Erweckung', topicEn: 'Azusa Street Revival',
  },
  {
    id: 'edinburgh', phase: 'modern', year: 1910, when: { de: '1910', en: '1910' },
    de: 'Edinburgh: Weltmissionskonferenz', en: 'Edinburgh: World Missionary Conference',
    lat: 55.953, lon: -3.188,
    text: {
      de: 'Die Missionsgesellschaften stimmen sich erstmals weltweit ab – und geben damit der ökumenischen Bewegung ihren Anstoß. Von 1200 Delegierten kommen nur wenige aus Asien und Afrika.',
      en: 'Mission societies coordinate globally for the first time – giving rise to the ecumenical movement. Of 1,200 delegates, only a handful come from Asia and Africa.',
    },
    topic: 'Weltmissionskonferenz Edinburgh 1910', topicEn: 'World Missionary Conference',
  },
  {
    id: 'kimbangu', phase: 'modern', year: 1921, when: { de: '1921', en: '1921' },
    de: 'Kongo: afrikanische Kirchen entstehen', en: 'Congo: African churches emerge',
    lat: -5.02, lon: 15.0,
    text: {
      de: 'Simon Kimbangu predigt und heilt; die Kolonialmacht sperrt ihn 30 Jahre ein. Seine Kirche zählt heute Millionen – eine von tausenden afrikanisch gegründeten Kirchen.',
      en: 'Simon Kimbangu preaches and heals; the colonial power jails him for 30 years. His church now numbers millions – one of thousands founded by Africans.',
    },
    topic: 'Kimbanguisten', topicEn: 'Kimbanguism',
  },
  {
    id: 'wycliffe', phase: 'modern', year: 1934, when: { de: '1934', en: '1934' },
    de: 'Bibelübersetzung wird zur Wissenschaft', en: 'Bible translation becomes a discipline',
    lat: 14.63, lon: -90.51,
    text: {
      de: 'Cameron Townsend, dem ein Cakchiquel-Sprecher entgegnet, sein Gott spreche wohl kein Cakchiquel, gründet eine Schule für Sprachforschung – heute stehen tausende Sprachen in Arbeit.',
      en: 'Cameron Townsend – told by a Cakchiquel speaker that his God apparently does not speak Cakchiquel – founds a school of linguistics; thousands of languages are now in progress.',
    },
    topic: 'Wycliff-Bibelübersetzer', topicEn: 'Wycliffe Bible Translators',
  },
  {
    id: 'china-house', phase: 'modern', year: 1949, when: { de: 'ab 1949', en: 'from 1949' },
    de: 'China: die Missionare gehen, die Kirche wächst', en: 'China: the missionaries leave, the church grows',
    lat: 30.5, lon: 112.0,
    text: {
      de: 'Nach 1949 müssen alle ausländischen Missionare das Land verlassen. Ohne sie – und durch die Kulturrevolution hindurch – wächst die chinesische Kirche auf ein Vielfaches.',
      en: 'After 1949 all foreign missionaries must leave. Without them – and right through the Cultural Revolution – the Chinese church multiplies.',
    },
    topic: 'Christentum in China', topicEn: 'Christianity in China',
  },
  {
    id: 'latin', phase: 'modern', year: 1960, when: { de: 'ab 1960', en: 'from 1960' },
    de: 'Lateinamerika: Basisgemeinden und Pfingstkirchen', en: 'Latin America: base communities and Pentecostals',
    lat: -23.55, lon: -46.633,
    text: {
      de: 'In den Städten Brasiliens, Chiles und Guatemalas wachsen pfingstliche Gemeinden rasant, während katholische Basisgemeinden die Bibel mit den Augen der Armen lesen.',
      en: 'In the cities of Brazil, Chile and Guatemala Pentecostal churches grow fast, while Catholic base communities read the Bible through the eyes of the poor.',
    },
    topic: 'Pfingstbewegung', topicEn: 'Pentecostalism',
  },
  {
    id: 'africa-shift', phase: 'modern', year: 1970, when: { de: 'ab 1970', en: 'from 1970' },
    de: 'Afrika: der neue Schwerpunkt', en: 'Africa: the new centre of gravity',
    lat: -1.286, lon: 36.817,
    text: {
      de: '1900 lebten etwa 9 Millionen Christen in Afrika, heute mehr als 700 Millionen. Kein Kontinent hat mehr – die Christenheit ist heute mehrheitlich nicht-westlich.',
      en: 'In 1900 some 9 million Christians lived in Africa; today more than 700 million. No continent has more – Christianity today is majority non-Western.',
    },
    topic: 'Christentum in Afrika', topicEn: 'Christianity in Africa',
  },
  {
    id: 'lausanne', phase: 'modern', year: 1974, when: { de: '1974', en: '1974' },
    de: 'Lausanne: die Welt vermisst sich neu', en: 'Lausanne: taking stock of the world',
    lat: 46.519, lon: 6.632,
    text: {
      de: 'Auf dem Kongress in Lausanne prägt Ralph Winter den Blick auf „unerreichte Volksgruppen“ – nicht mehr Länder, sondern Sprach- und Kulturgruppen werden gezählt.',
      en: 'At the Lausanne congress Ralph Winter reframes the task around "unreached people groups" – no longer countries but language and culture groups are counted.',
    },
    topic: 'Lausanner Bewegung', topicEn: 'Lausanne Movement',
  },
  {
    id: 'korea-sends', phase: 'modern', year: 1990, when: { de: 'ab 1990', en: 'from 1990' },
    de: 'Südkorea wird zum Sendeland', en: 'South Korea becomes a sending country',
    lat: 41.3, lon: 69.24, from: SEOUL,
    text: {
      de: 'Ein Jahrhundert nach den ersten Missionaren entsendet Korea selbst zehntausende – nach Zentralasien, in den Nahen Osten, nach Afrika.',
      en: 'A century after the first missionaries arrived, Korea sends out tens of thousands of its own – to Central Asia, the Middle East, Africa.',
    },
    topic: 'Christentum in Südkorea', topicEn: 'Christianity in South Korea',
  },
  {
    id: 'east-europe', phase: 'modern', year: 1991, when: { de: '1989–1991', en: '1989–1991' },
    de: 'Osteuropa öffnet sich', en: 'Eastern Europe opens',
    lat: 52.52, lon: 13.405,
    text: {
      de: 'Nach 70 Jahren staatlichem Atheismus treten Kirchen wieder öffentlich auf – von Berlin bis Wladiwostok, mit allen Konflikten des Neuanfangs.',
      en: 'After 70 years of state atheism, churches reappear in public – from Berlin to Vladivostok, with all the conflicts of a new beginning.',
    },
    topic: 'Religion in der Sowjetunion', topicEn: 'Religion in the Soviet Union',
  },
  {
    id: 'nigeria-sends', phase: 'modern', year: 2000, when: { de: 'ab 2000', en: 'from 2000' },
    de: 'Von überall nach überall', en: 'From everywhere to everywhere',
    lat: 51.507, lon: -0.128, from: [9.058, 7.495],
    text: {
      de: 'Nigerianische, brasilianische und philippinische Gemeinden senden Missionare – auch nach Europa. Die größte Gemeinde Londons wurde von einem Nigerianer gegründet.',
      en: 'Nigerian, Brazilian and Filipino churches send missionaries – including to Europe. London’s largest congregation was founded by a Nigerian.',
    },
    topic: 'Weltchristentum', topicEn: 'Global Christianity',
  },
  {
    id: 'translation-today', phase: 'modern', year: 2024, when: { de: 'heute', en: 'today' },
    de: 'Die Bibel in 3.700 Sprachen', en: 'The Bible in 3,700 languages',
    lat: 4.0, lon: 10.0,
    text: {
      de: 'Die vollständige Bibel gibt es in rund 750 Sprachen, das Neue Testament in etwa 1.700, einzelne Teile in weiteren 1.300 – bei rund 7.400 Sprachen der Welt. Rund 985 Sprachen haben noch keinen einzigen Vers.',
      en: 'The full Bible exists in some 750 languages, the New Testament in about 1,700, portions in a further 1,300 – out of roughly 7,400 languages worldwide. Around 985 languages still have not a single verse.',
    },
    topic: 'Bibelübersetzung', topicEn: 'Bible translations',
  },
];

/** Ereignisse einer Phase, chronologisch. */
export function eventsInPhase(phase: string): SpreadEvent[] {
  return SPREAD_EVENTS.filter((e) => e.phase === phase).sort((a, b) => a.year - b.year);
}

/**
 * Zahlen zur weltweiten Christenheit heute. Größenordnungen, gerundet –
 * verschiedene Zählungen kommen zu unterschiedlichen Ergebnissen.
 */
export interface MissionFact {
  label: Bilingual;
  value: Bilingual;
}

export const TODAY_FACTS: MissionFact[] = [
  {
    label: { de: 'Christen weltweit', en: 'Christians worldwide' },
    value: { de: '~2,6 Milliarden – knapp ein Drittel der Menschheit', en: '~2.6 billion – almost a third of humanity' },
  },
  {
    label: { de: 'Afrika südlich der Sahara', en: 'Sub-Saharan Africa' },
    value: { de: '~700 Mio. (1900: ~9 Mio.)', en: '~700 million (1900: ~9 million)' },
  },
  {
    label: { de: 'Lateinamerika', en: 'Latin America' },
    value: { de: '~600 Mio.', en: '~600 million' },
  },
  {
    label: { de: 'Europa', en: 'Europe' },
    value: { de: '~550 Mio. – anteilig rückläufig', en: '~550 million – declining as a share' },
  },
  {
    label: { de: 'Asien & Pazifik', en: 'Asia & Pacific' },
    value: { de: '~400 Mio. – am stärksten wachsend', en: '~400 million – growing fastest' },
  },
  {
    label: { de: 'Nordamerika', en: 'North America' },
    value: { de: '~270 Mio.', en: '~270 million' },
  },
  {
    label: { de: 'Sprachen mit Bibeltext', en: 'Languages with Scripture' },
    value: { de: '~3.700 von ~7.400 Sprachen', en: '~3,700 of ~7,400 languages' },
  },
];

/** Nachschlagen in der Wikipedia – exakte Titel landen direkt im Artikel. */
export function wikiUrl(topic: string, lang: 'de' | 'en'): string {
  const host = lang === 'de' ? 'de.wikipedia.org' : 'en.wikipedia.org';
  return `https://${host}/w/index.php?search=${encodeURIComponent(topic)}`;
}

/** BibleGateway-Link für eine Bibelstelle der Apostelgeschichte. */
export function passageUrl(passage: string, lang: 'de' | 'en'): string {
  const version = lang === 'de' ? 'LUTH1545' : 'ESV';
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(passage)}&version=${version}`;
}
