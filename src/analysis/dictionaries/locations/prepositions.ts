/**
 * Multilingual Location Prepositions
 * Patterns that indicate "in", "at", "from" in different languages
 * Used to detect location context in text
 */

import { PrepositionPattern } from './types';

/**
 * Preposition patterns for location detection in various languages
 * These patterns match words like "in", "at", "from", "based in" etc.
 */
export const LOCATION_PREPOSITIONS: PrepositionPattern[] = [
  // ============================================
  // English
  // ============================================
  {
    language: 'English',
    patterns: [
      /\bin\s+/gi,
      /\bat\s+/gi,
      /\bfrom\s+/gi,
      /\bbased\s+in\s+/gi,
      /\blocated\s+in\s+/gi,
      /\bworking\s+in\s+/gi,
      /\bworking\s+from\s+/gi,
      /\bposition\s+in\s+/gi,
      /\bjob\s+in\s+/gi,
      /\boffice\s+in\s+/gi,
      /\bliving\s+in\s+/gi,
      /\bresiding\s+in\s+/gi,
    ],
  },

  // ============================================
  // Arabic (العربية)
  // ============================================
  {
    language: 'Arabic',
    patterns: [
      /\bفي\s+/gi,        // fi (in)
      /\bفى\s+/gi,        // fi (alternate)
      /\bب\s*/gi,         // bi (in/at) - attached prefix
      /\bمن\s+/gi,        // min (from)
      /\bإلى\s+/gi,       // ila (to)
      /\bالى\s+/gi,       // ila (alternate)
      /\bعند\s+/gi,       // 'ind (at)
      /\bيقع\s+في\s+/gi,  // located in
      /\bمقره?\s+في\s+/gi, // based in
      /\bمقرها\s+في\s+/gi, // its base in
      /\bالموقع[:\s]+/gi,  // location:
      /\bالمكان[:\s]+/gi,  // place:
      /\bالمدينة[:\s]+/gi, // city:
      /\bالدولة[:\s]+/gi,  // country:
      /\bالبلد[:\s]+/gi,   // country:
    ],
  },

  // ============================================
  // Persian/Farsi (فارسی)
  // ============================================
  {
    language: 'Persian',
    patterns: [
      /\bدر\s+/gi,         // dar (in)
      /\bاز\s+/gi,         // az (from)
      /\bبه\s+/gi,         // be (to)
      /\bمستقر\s+در\s+/gi, // based in
      /\bواقع\s+در\s+/gi,  // located in
      /\bموقعیت[:\s]+/gi,  // location:
      /\bمکان[:\s]+/gi,    // place:
      /\bشهر[:\s]+/gi,     // city:
      /\bکشور[:\s]+/gi,    // country:
    ],
  },

  // ============================================
  // Chinese (中文)
  // ============================================
  {
    language: 'Chinese',
    patterns: [
      /在\s*/gi,          // zai (in/at)
      /于\s*/gi,          // yu (in/at)
      /於\s*/gi,          // yu (traditional)
      /位于\s*/gi,        // located in
      /位於\s*/gi,        // located in (traditional)
      /来自\s*/gi,        // from
      /來自\s*/gi,        // from (traditional)
      /地点[：:]\s*/gi,   // location:
      /地點[：:]\s*/gi,   // location: (traditional)
      /城市[：:]\s*/gi,   // city:
      /国家[：:]\s*/gi,   // country:
      /國家[：:]\s*/gi,   // country: (traditional)
      /工作地点\s*/gi,    // work location
      /工作地點\s*/gi,    // work location (traditional)
    ],
  },

  // ============================================
  // German (Deutsch)
  // ============================================
  {
    language: 'German',
    patterns: [
      /\bin\s+/gi,            // in
      /\bim\s+/gi,            // in the (masculine/neuter)
      /\baus\s+/gi,           // from
      /\bbei\s+/gi,           // at
      /\bzu\s+/gi,            // to
      /\bzum\s+/gi,           // to the
      /\bzur\s+/gi,           // to the
      /\bansässig\s+in\s+/gi, // based in
      /\bmit\s+Sitz\s+in\s+/gi, // headquartered in
      /\bStandort[:\s]+/gi,   // location:
      /\bOrt[:\s]+/gi,        // place:
      /\bStadt[:\s]+/gi,      // city:
      /\bLand[:\s]+/gi,       // country:
      /\bArbeitsort[:\s]+/gi, // work location:
    ],
  },

  // ============================================
  // French (Français)
  // ============================================
  {
    language: 'French',
    patterns: [
      /\bà\s+/gi,             // à (in/at)
      /\ba\s+/gi,             // a (without accent)
      /\bau\s+/gi,            // au (in the - masculine)
      /\baux\s+/gi,           // aux (in the - plural)
      /\ben\s+/gi,            // en (in)
      /\bde\s+/gi,            // de (from)
      /\bdu\s+/gi,            // du (from the)
      /\bdes\s+/gi,           // des (from the - plural)
      /\bdans\s+/gi,          // dans (in)
      /\bchez\s+/gi,          // chez (at)
      /\bbasé\s+à\s+/gi,      // based in
      /\bbasée\s+à\s+/gi,     // based in (feminine)
      /\bsitué\s+à\s+/gi,     // located in
      /\bsituée\s+à\s+/gi,    // located in (feminine)
      /\blieu[:\s]+/gi,       // location:
      /\bville[:\s]+/gi,      // city:
      /\bpays[:\s]+/gi,       // country:
      /\blocalisation[:\s]+/gi, // location:
      /\bposte\s+à\s+/gi,     // position in
    ],
  },

  // ============================================
  // Spanish (Español)
  // ============================================
  {
    language: 'Spanish',
    patterns: [
      /\ben\s+/gi,            // en (in)
      /\bde\s+/gi,            // de (from)
      /\bdel\s+/gi,           // del (from the)
      /\ba\s+/gi,             // a (to)
      /\bal\s+/gi,            // al (to the)
      /\bdesde\s+/gi,         // desde (from)
      /\bcon\s+sede\s+en\s+/gi, // headquartered in
      /\bubicado\s+en\s+/gi,  // located in
      /\bubicada\s+en\s+/gi,  // located in (feminine)
      /\blugar[:\s]+/gi,      // place:
      /\bciudad[:\s]+/gi,     // city:
      /\bpaís[:\s]+/gi,       // country:
      /\bpais[:\s]+/gi,       // country: (no accent)
      /\bubicación[:\s]+/gi,  // location:
      /\bpuesto\s+en\s+/gi,   // position in
    ],
  },

  // ============================================
  // Portuguese (Português)
  // ============================================
  {
    language: 'Portuguese',
    patterns: [
      /\bem\s+/gi,            // em (in)
      /\bno\s+/gi,            // no (in the - masculine)
      /\bna\s+/gi,            // na (in the - feminine)
      /\bnos\s+/gi,           // nos (in the - masculine plural)
      /\bnas\s+/gi,           // nas (in the - feminine plural)
      /\bde\s+/gi,            // de (from)
      /\bdo\s+/gi,            // do (from the - masculine)
      /\bda\s+/gi,            // da (from the - feminine)
      /\bdos\s+/gi,           // dos (from the - masculine plural)
      /\bdas\s+/gi,           // das (from the - feminine plural)
      /\bpara\s+/gi,          // para (to)
      /\bcom\s+sede\s+em\s+/gi, // headquartered in
      /\blocalizado\s+em\s+/gi, // located in
      /\blocalizada\s+em\s+/gi, // located in (feminine)
      /\blugar[:\s]+/gi,      // place:
      /\bcidade[:\s]+/gi,     // city:
      /\bpaís[:\s]+/gi,       // country:
      /\blocalização[:\s]+/gi, // location:
    ],
  },

  // ============================================
  // Russian (Русский)
  // ============================================
  {
    language: 'Russian',
    patterns: [
      /\bв\s+/gi,             // v (in)
      /\bво\s+/gi,            // vo (in - before certain consonants)
      /\bна\s+/gi,            // na (on/in)
      /\bиз\s+/gi,            // iz (from)
      /\bот\s+/gi,            // ot (from)
      /\bу\s+/gi,             // u (at)
      /\bрасположен\s+в\s+/gi,  // located in (masculine)
      /\bрасположена\s+в\s+/gi, // located in (feminine)
      /\bбазируется\s+в\s+/gi,  // based in
      /\bместо[:\s]+/gi,      // place:
      /\bгород[:\s]+/gi,      // city:
      /\bстрана[:\s]+/gi,     // country:
      /\bлокация[:\s]+/gi,    // location:
      /\bместоположение[:\s]+/gi, // location:
    ],
  },

  // ============================================
  // Turkish (Türkçe)
  // ============================================
  {
    language: 'Turkish',
    patterns: [
      /\bde\s*/gi,           // de/da (in - suffix, but sometimes separate)
      /\bda\s*/gi,           // da (in)
      /\b['']de\b/gi,        // 'de (in - with apostrophe)
      /\b['']da\b/gi,        // 'da (in - with apostrophe)
      /\b['']te\b/gi,        // 'te (in)
      /\b['']ta\b/gi,        // 'ta (in)
      /\b['']den\b/gi,       // 'den (from)
      /\b['']dan\b/gi,       // 'dan (from)
      /\b['']ten\b/gi,       // 'ten (from)
      /\b['']tan\b/gi,       // 'tan (from)
      /\bkonumu[:\s]+/gi,    // location:
      /\bşehir[:\s]+/gi,     // city:
      /\bülke[:\s]+/gi,      // country:
      /\byer[:\s]+/gi,       // place:
      /\bmerkezli\b/gi,      // based (in)
    ],
  },

  // ============================================
  // Japanese (日本語)
  // ============================================
  {
    language: 'Japanese',
    patterns: [
      /に\s*/gi,             // ni (in/at)
      /で\s*/gi,             // de (at/in)
      /へ\s*/gi,             // e (to)
      /から\s*/gi,           // kara (from)
      /より\s*/gi,           // yori (from)
      /にある\s*/gi,         // located in
      /に位置する\s*/gi,     // located in
      /拠点[：:]\s*/gi,      // base/location:
      /所在地[：:]\s*/gi,    // location:
      /勤務地[：:]\s*/gi,    // work location:
      /都市[：:]\s*/gi,      // city:
      /国[：:]\s*/gi,        // country:
    ],
  },

  // ============================================
  // Korean (한국어)
  // ============================================
  {
    language: 'Korean',
    patterns: [
      /에\s*/gi,             // e (in/at)
      /에서\s*/gi,           // eseo (in/at)
      /로\s*/gi,             // ro (to)
      /으로\s*/gi,           // euro (to)
      /에서\s+일\s*/gi,      // working in
      /위치[:\s]+/gi,        // location:
      /도시[:\s]+/gi,        // city:
      /국가[:\s]+/gi,        // country:
      /근무지[:\s]+/gi,      // work location:
    ],
  },

  // ============================================
  // Hindi (हिन्दी)
  // ============================================
  {
    language: 'Hindi',
    patterns: [
      /\bमें\s+/gi,          // mein (in)
      /\bपर\s+/gi,           // par (on/at)
      /\bसे\s+/gi,           // se (from)
      /\bको\s+/gi,           // ko (to)
      /\bके\s+/gi,           // ke (of)
      /\bकी\s+/gi,           // ki (of)
      /\bस्थित\s+/gi,        // located
      /\bस्थान[:\s]+/gi,     // place/location:
      /\bशहर[:\s]+/gi,       // city:
      /\bदेश[:\s]+/gi,       // country:
    ],
  },

  // ============================================
  // Italian (Italiano)
  // ============================================
  {
    language: 'Italian',
    patterns: [
      /\bin\s+/gi,           // in
      /\ba\s+/gi,            // a (in/at)
      /\bda\s+/gi,           // da (from)
      /\bdi\s+/gi,           // di (of/from)
      /\bnel\s+/gi,          // nel (in the - masculine)
      /\bnella\s+/gi,        // nella (in the - feminine)
      /\bnei\s+/gi,          // nei (in the - masculine plural)
      /\bnelle\s+/gi,        // nelle (in the - feminine plural)
      /\bdal\s+/gi,          // dal (from the)
      /\bdalla\s+/gi,        // dalla (from the - feminine)
      /\bcon\s+sede\s+a\s+/gi,  // headquartered in
      /\bsituato\s+a\s+/gi,  // located in
      /\bsituata\s+a\s+/gi,  // located in (feminine)
      /\bluogo[:\s]+/gi,     // place:
      /\bcittà[:\s]+/gi,     // city:
      /\bpaese[:\s]+/gi,     // country:
      /\bposizione[:\s]+/gi, // position/location:
    ],
  },

  // ============================================
  // Dutch (Nederlands)
  // ============================================
  {
    language: 'Dutch',
    patterns: [
      /\bin\s+/gi,            // in
      /\bop\s+/gi,            // on/in
      /\buit\s+/gi,           // from
      /\bvan\s+/gi,           // from/of
      /\bbij\s+/gi,           // at
      /\bnaar\s+/gi,          // to
      /\bgevestigd\s+in\s+/gi, // based in
      /\bplaats[:\s]+/gi,     // place:
      /\bstad[:\s]+/gi,       // city:
      /\bland[:\s]+/gi,       // country:
      /\blocatie[:\s]+/gi,    // location:
    ],
  },

  // ============================================
  // Polish (Polski)
  // ============================================
  {
    language: 'Polish',
    patterns: [
      /\bw\s+/gi,             // w (in)
      /\bwe\s+/gi,            // we (in - before certain consonants)
      /\bna\s+/gi,            // na (on/in)
      /\bz\s+/gi,             // z (from)
      /\bze\s+/gi,            // ze (from)
      /\bdo\s+/gi,            // do (to)
      /\bu\s+/gi,             // u (at)
      /\bpołożony\s+w\s+/gi,  // located in
      /\bz\s+siedzibą\s+w\s+/gi, // headquartered in
      /\bmiejsce[:\s]+/gi,    // place:
      /\bmiasto[:\s]+/gi,     // city:
      /\bkraj[:\s]+/gi,       // country:
      /\blokalizacja[:\s]+/gi, // location:
    ],
  },

  // ============================================
  // Hebrew (עברית)
  // ============================================
  {
    language: 'Hebrew',
    patterns: [
      /\bב\s*/gi,             // be (in)
      /\bמ\s*/gi,             // mi (from)
      /\bל\s*/gi,             // le (to)
      /\bאצל\s+/gi,           // etzel (at)
      /\bממוקם\s+ב\s*/gi,     // located in
      /\bמיקום[:\s]+/gi,      // location:
      /\bעיר[:\s]+/gi,        // city:
      /\bמדינה[:\s]+/gi,      // country:
    ],
  },

  // ============================================
  // Vietnamese (Tiếng Việt)
  // ============================================
  {
    language: 'Vietnamese',
    patterns: [
      /\btại\s+/gi,           // tai (at/in)
      /\bở\s+/gi,             // o (at/in)
      /\btừ\s+/gi,            // tu (from)
      /\bđến\s+/gi,           // den (to)
      /\bđặt\s+tại\s+/gi,     // located at
      /\bvị\s+trí[:\s]+/gi,   // position/location:
      /\bthành\s+phố[:\s]+/gi, // city:
      /\bquốc\s+gia[:\s]+/gi, // country:
    ],
  },

  // ============================================
  // Thai (ภาษาไทย)
  // ============================================
  {
    language: 'Thai',
    patterns: [
      /ใน\s*/gi,              // nai (in)
      /ที่\s*/gi,             // thi (at)
      /จาก\s*/gi,             // jak (from)
      /ไป\s*/gi,              // pai (to)
      /ตั้งอยู่\s*/gi,         // located
      /สถานที่[:\s]*/gi,      // location:
      /เมือง[:\s]*/gi,        // city:
      /ประเทศ[:\s]*/gi,       // country:
    ],
  },

  // ============================================
  // Indonesian/Malay (Bahasa Indonesia/Melayu)
  // ============================================
  {
    language: 'Indonesian',
    patterns: [
      /\bdi\s+/gi,            // di (in/at)
      /\bdari\s+/gi,          // dari (from)
      /\bke\s+/gi,            // ke (to)
      /\bpada\s+/gi,          // pada (on/at)
      /\bterletak\s+di\s+/gi, // located in
      /\bberpusat\s+di\s+/gi, // based in
      /\blokasi[:\s]+/gi,     // location:
      /\bkota[:\s]+/gi,       // city:
      /\bnegara[:\s]+/gi,     // country:
    ],
  },

  // ============================================
  // Swedish (Svenska)
  // ============================================
  {
    language: 'Swedish',
    patterns: [
      /\bi\s+/gi,             // i (in)
      /\bpå\s+/gi,            // på (on/at)
      /\bfrån\s+/gi,          // från (from)
      /\btill\s+/gi,          // till (to)
      /\bbelägen\s+i\s+/gi,   // located in
      /\bmed\s+säte\s+i\s+/gi, // headquartered in
      /\bplats[:\s]+/gi,      // place:
      /\bstad[:\s]+/gi,       // city:
      /\bland[:\s]+/gi,       // country:
    ],
  },

  // ============================================
  // Greek (Ελληνικά)
  // ============================================
  {
    language: 'Greek',
    patterns: [
      /\bστην?\s+/gi,         // stin/sto (in the)
      /\bσε\s+/gi,            // se (in)
      /\bαπό\s+/gi,           // apo (from)
      /\bπρος\s+/gi,          // pros (to)
      /\bτοποθεσία[:\s]+/gi,  // location:
      /\bπόλη[:\s]+/gi,       // city:
      /\bχώρα[:\s]+/gi,       // country:
    ],
  },

  // ============================================
  // Romanian (Română)
  // ============================================
  {
    language: 'Romanian',
    patterns: [
      /\bîn\s+/gi,            // în (in)
      /\bla\s+/gi,            // la (at)
      /\bdin\s+/gi,           // din (from)
      /\bde\s+la\s+/gi,       // de la (from)
      /\bsituat\s+în\s+/gi,   // located in
      /\bcu\s+sediul\s+în\s+/gi, // headquartered in
      /\bloc[:\s]+/gi,        // place:
      /\boraș[:\s]+/gi,       // city:
      /\bțară[:\s]+/gi,       // country:
      /\blocație[:\s]+/gi,    // location:
    ],
  },

  // ============================================
  // Czech (Čeština)
  // ============================================
  {
    language: 'Czech',
    patterns: [
      /\bv\s+/gi,             // v (in)
      /\bve\s+/gi,            // ve (in)
      /\bna\s+/gi,            // na (on/at)
      /\bz\s+/gi,             // z (from)
      /\bze\s+/gi,            // ze (from)
      /\bdo\s+/gi,            // do (to)
      /\bsídlo\s+v\s+/gi,     // headquartered in
      /\bmísto[:\s]+/gi,      // place:
      /\bměsto[:\s]+/gi,      // city:
      /\bzemě[:\s]+/gi,       // country:
    ],
  },

  // ============================================
  // Hungarian (Magyar)
  // ============================================
  {
    language: 'Hungarian',
    patterns: [
      /\bban\b/gi,            // -ban (in - suffix)
      /\bben\b/gi,            // -ben (in - suffix)
      /\bból\b/gi,            // -ból (from - suffix)
      /\bből\b/gi,            // -ből (from - suffix)
      /\bba\b/gi,             // -ba (into - suffix)
      /\bbe\b/gi,             // -be (into - suffix)
      /\bhely[:\s]+/gi,       // place:
      /\bváros[:\s]+/gi,      // city:
      /\bország[:\s]+/gi,     // country:
    ],
  },

  // ============================================
  // Finnish (Suomi)
  // ============================================
  {
    language: 'Finnish',
    patterns: [
      /\bssa\b/gi,            // -ssa (in - suffix)
      /\bssä\b/gi,            // -ssä (in - suffix)
      /\bsta\b/gi,            // -sta (from - suffix)
      /\bstä\b/gi,            // -stä (from - suffix)
      /\baan\b/gi,            // -aan (to - suffix)
      /\bään\b/gi,            // -ään (to - suffix)
      /\bpaikka[:\s]+/gi,     // place:
      /\bkaupunki[:\s]+/gi,   // city:
      /\bmaa[:\s]+/gi,        // country:
      /\bsijainti[:\s]+/gi,   // location:
    ],
  },

  // ============================================
  // Norwegian (Norsk)
  // ============================================
  {
    language: 'Norwegian',
    patterns: [
      /\bi\s+/gi,             // i (in)
      /\bpå\s+/gi,            // på (on/at)
      /\bfra\s+/gi,           // fra (from)
      /\btil\s+/gi,           // til (to)
      /\bsted[:\s]+/gi,       // place:
      /\bby[:\s]+/gi,         // city:
      /\bland[:\s]+/gi,       // country:
    ],
  },

  // ============================================
  // Danish (Dansk)
  // ============================================
  {
    language: 'Danish',
    patterns: [
      /\bi\s+/gi,             // i (in)
      /\bpå\s+/gi,            // på (on/at)
      /\bfra\s+/gi,           // fra (from)
      /\btil\s+/gi,           // til (to)
      /\bsted[:\s]+/gi,       // place:
      /\bby[:\s]+/gi,         // city:
      /\bland[:\s]+/gi,       // country:
    ],
  },

  // ============================================
  // Urdu (اردو)
  // ============================================
  {
    language: 'Urdu',
    patterns: [
      /\bمیں\s+/gi,           // mein (in)
      /\bپر\s+/gi,            // par (on/at)
      /\bسے\s+/gi,            // se (from)
      /\bکو\s+/gi,            // ko (to)
      /\bواقع\s+/gi,          // located
      /\bجگہ[:\s]+/gi,        // place:
      /\bشہر[:\s]+/gi,        // city:
      /\bملک[:\s]+/gi,        // country:
    ],
  },

  // ============================================
  // Bengali (বাংলা)
  // ============================================
  {
    language: 'Bengali',
    patterns: [
      /\bতে\s*/gi,            // -te (in - suffix)
      /\bএ\s*/gi,             // -e (in - suffix)
      /\bথেকে\s+/gi,          // theke (from)
      /\bঅবস্থিত\s*/gi,       // located
      /\bস্থান[:\s]+/gi,      // place:
      /\bশহর[:\s]+/gi,        // city:
      /\bদেশ[:\s]+/gi,        // country:
    ],
  },

  // ============================================
  // Swahili (Kiswahili)
  // ============================================
  {
    language: 'Swahili',
    patterns: [
      /\bkatika\s+/gi,        // katika (in)
      /\bkwa\s+/gi,           // kwa (at/for)
      /\bkutoka\s+/gi,        // kutoka (from)
      /\bmahali[:\s]+/gi,     // place:
      /\bjiji[:\s]+/gi,       // city:
      /\bnchi[:\s]+/gi,       // country:
    ],
  },
];

/**
 * Combined regex for all prepositions (for quick matching)
 * Use this for performance when you just need to know if ANY preposition exists
 */
export const ALL_PREPOSITIONS_PATTERN = new RegExp(
  LOCATION_PREPOSITIONS.flatMap(lp => lp.patterns.map(p => p.source)).join('|'),
  'gi'
);

/**
 * Extract potential location after a preposition
 * Returns the text that follows a location preposition
 */
export function extractAfterPreposition(text: string): string[] {
  const results: string[] = [];

  for (const { patterns } of LOCATION_PREPOSITIONS) {
    for (const pattern of patterns) {
      // Create a new pattern that captures text after the preposition
      const capturePattern = new RegExp(
        pattern.source + '([\\p{L}\\p{M}\\s,.-]+)',
        'giu'
      );

      const matches = Array.from(text.matchAll(capturePattern));
      for (const match of matches) {
        if (match[1]) {
          // Clean up and add the captured location
          const location = match[1].trim();
          if (location.length > 1 && location.length < 100) {
            results.push(location);
          }
        }
      }
    }
  }

  return Array.from(new Set(results)); // Remove duplicates
}
