// Maps the German/English book abbreviations used in genealogy person refs
// (e.g. "Gen 5:1-5", "1Sam 16", "Apg 2") to the OSIS book codes used across
// the app. Returns null for anything unrecognised (e.g. apocrypha).

const ABBR: Record<string, string> = {
  // Pentateuch
  gen: 'Gen', '1mose': 'Gen', '1mo': 'Gen',
  ex: 'Exod', exod: 'Exod', '2mose': 'Exod', '2mo': 'Exod',
  lev: 'Lev', '3mose': 'Lev',
  num: 'Num', '4mose': 'Num',
  dtn: 'Deut', deut: 'Deut', '5mose': 'Deut',
  // History
  jos: 'Josh', josh: 'Josh',
  ri: 'Judg', judg: 'Judg', richt: 'Judg',
  rut: 'Ruth', ruth: 'Ruth',
  '1sam': '1Sam', '2sam': '2Sam',
  '1kön': '1Kgs', '1koen': '1Kgs', '1kge': '1Kgs', '1kgs': '1Kgs',
  '2kön': '2Kgs', '2koen': '2Kgs', '2kgs': '2Kgs',
  '1chr': '1Chr', '2chr': '2Chr',
  esra: 'Ezra', ezra: 'Ezra',
  neh: 'Neh',
  est: 'Esth', esth: 'Esth', ester: 'Esth',
  // Poetry / wisdom
  hi: 'Job', ijob: 'Job', job: 'Job',
  ps: 'Ps', psalm: 'Ps',
  spr: 'Prov', prov: 'Prov',
  pred: 'Eccl', koh: 'Eccl', eccl: 'Eccl',
  hld: 'Song', song: 'Song',
  // Prophets
  jes: 'Isa', isa: 'Isa',
  jer: 'Jer',
  klgl: 'Lam', lam: 'Lam',
  ez: 'Ezek', hes: 'Ezek', ezek: 'Ezek',
  dan: 'Dan',
  hos: 'Hos',
  joel: 'Joel',
  am: 'Amos', amos: 'Amos',
  obd: 'Obad', obad: 'Obad',
  jona: 'Jonah', jonah: 'Jonah',
  mi: 'Mic', mic: 'Mic',
  nah: 'Nah',
  hab: 'Hab',
  zef: 'Zeph', zeph: 'Zeph',
  hag: 'Hag',
  sach: 'Zech', zech: 'Zech',
  mal: 'Mal',
  // Gospels / Acts
  mt: 'Matt', matt: 'Matt',
  mk: 'Mark', mark: 'Mark',
  lk: 'Luke', luke: 'Luke',
  joh: 'John', john: 'John', jn: 'John',
  apg: 'Acts', acts: 'Acts',
  // Epistles
  röm: 'Rom', roem: 'Rom', rom: 'Rom',
  '1kor': '1Cor', '2kor': '2Cor',
  gal: 'Gal',
  eph: 'Eph',
  phil: 'Phil',
  kol: 'Col', col: 'Col',
  '1thess': '1Thess', '2thess': '2Thess',
  '1tim': '1Tim', '2tim': '2Tim',
  tit: 'Titus', titus: 'Titus',
  phlm: 'Phlm',
  hebr: 'Heb', heb: 'Heb',
  jak: 'Jas', jas: 'Jas',
  '1petr': '1Pet', '1pet': '1Pet',
  '2petr': '2Pet', '2pet': '2Pet',
  '1joh': '1John', '1john': '1John',
  '2joh': '2John', '2john': '2John',
  '3joh': '3John', '3john': '3John',
  jud: 'Jude', jude: 'Jude',
  offb: 'Rev', off: 'Rev', rev: 'Rev', apk: 'Rev',
};

/** OSIS book code for a human ref like "1Sam 16:1" or "Gen 5:1-5"; null if unknown. */
export function osisFromRef(ref: string): string | null {
  const m = ref.trim().match(/^([1-3]?\s*[A-Za-zäöüÄÖÜ]+)/);
  if (!m) return null;
  const key = m[1].toLowerCase().replace(/\s+/g, '');
  return ABBR[key] ?? null;
}
