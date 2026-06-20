/**
 * Comprehensive Multilingual Country Dictionary
 * Includes country names in: English, Arabic (العربية), Chinese (中文),
 * German (Deutsch), French (Français), Spanish (Español), Portuguese (Português),
 * Russian (Русский), Japanese (日本語), Korean (한국어), Hindi (हिन्दी),
 * Turkish (Türkçe), Persian/Farsi (فارسی), and more
 */

import { CountryData, Region } from './types';

// Helper function to create country data
const country = (canonical: string, region: Region, aliases: string[]): CountryData => ({
  canonical,
  region,
  aliases: [canonical, ...aliases],
});

export const COUNTRIES: CountryData[] = [
  // ============================================
  // MIDDLE EAST (الشرق الأوسط)
  // ============================================
  country('United Arab Emirates', 'Middle East', [
    'UAE', 'U.A.E.',
    // Arabic
    'الإمارات', 'الإمارات العربية المتحدة', 'الامارات', 'الامارات العربية المتحدة',
    // Persian/Farsi
    'امارات', 'امارات متحده عربی', 'ایالات متحده عربی',
    // Chinese
    '阿联酋', '阿拉伯联合酋长国',
    // German
    'Vereinigte Arabische Emirate',
    // French
    'Émirats arabes unis', 'Emirats arabes unis',
    // Spanish
    'Emiratos Árabes Unidos',
    // Russian
    'ОАЭ', 'Объединённые Арабские Эмираты',
    // Turkish
    'Birleşik Arap Emirlikleri', 'BAE',
    // Japanese
    'アラブ首長国連邦',
    // Korean
    '아랍에미리트',
    // Hindi
    'संयुक्त अरब अमीरात',
  ]),

  country('Saudi Arabia', 'Middle East', [
    'KSA', 'Kingdom of Saudi Arabia',
    // Arabic
    'السعودية', 'المملكة العربية السعودية', 'السعوديه',
    // Persian
    'عربستان سعودی', 'عربستان',
    // Chinese
    '沙特阿拉伯', '沙特',
    // German
    'Saudi-Arabien',
    // French
    'Arabie saoudite', 'Arabie Saoudite',
    // Spanish
    'Arabia Saudita', 'Arabia Saudí',
    // Russian
    'Саудовская Аравия',
    // Turkish
    'Suudi Arabistan',
    // Japanese
    'サウジアラビア',
    // Korean
    '사우디아라비아',
    // Hindi
    'सऊदी अरब',
  ]),

  country('Qatar', 'Middle East', [
    // Arabic
    'قطر',
    // Persian
    'قطر',
    // Chinese
    '卡塔尔',
    // German/French/Spanish
    'Katar',
    // Russian
    'Катар',
    // Turkish
    'Katar',
    // Japanese
    'カタール',
    // Korean
    '카타르',
    // Hindi
    'क़तर',
  ]),

  country('Kuwait', 'Middle East', [
    // Arabic
    'الكويت',
    // Persian
    'کویت',
    // Chinese
    '科威特',
    // German
    'Kuwait',
    // French
    'Koweït',
    // Spanish
    'Kuwait',
    // Russian
    'Кувейт',
    // Turkish
    'Kuveyt',
    // Japanese
    'クウェート',
    // Korean
    '쿠웨이트',
    // Hindi
    'कुवैत',
  ]),

  country('Bahrain', 'Middle East', [
    // Arabic
    'البحرين',
    // Persian
    'بحرین',
    // Chinese
    '巴林',
    // German
    'Bahrain',
    // French
    'Bahreïn', 'Bahrein',
    // Spanish
    'Baréin', 'Bahréin',
    // Russian
    'Бахрейн',
    // Turkish
    'Bahreyn',
    // Japanese
    'バーレーン',
    // Korean
    '바레인',
    // Hindi
    'बहरीन',
  ]),

  country('Oman', 'Middle East', [
    // Arabic
    'عمان', 'سلطنة عمان',
    // Persian
    'عمان',
    // Chinese
    '阿曼',
    // German/French/Spanish
    'Oman',
    // Russian
    'Оман',
    // Turkish
    'Umman',
    // Japanese
    'オマーン',
    // Korean
    '오만',
    // Hindi
    'ओमान',
  ]),

  country('Iran', 'Middle East', [
    'Islamic Republic of Iran', 'Persia',
    // Arabic
    'إيران', 'ايران',
    // Persian
    'ایران', 'جمهوری اسلامی ایران',
    // Chinese
    '伊朗',
    // German
    'Iran',
    // French
    'Iran',
    // Spanish
    'Irán',
    // Russian
    'Иран',
    // Turkish
    'İran',
    // Japanese
    'イラン',
    // Korean
    '이란',
    // Hindi
    'ईरान',
  ]),

  country('Iraq', 'Middle East', [
    // Arabic
    'العراق',
    // Persian
    'عراق',
    // Chinese
    '伊拉克',
    // German
    'Irak',
    // French
    'Irak', 'Iraq',
    // Spanish
    'Irak',
    // Russian
    'Ирак',
    // Turkish
    'Irak',
    // Japanese
    'イラク',
    // Korean
    '이라크',
    // Hindi
    'इराक़',
  ]),

  country('Israel', 'Middle East', [
    // Arabic
    'إسرائيل', 'اسرائيل',
    // Hebrew
    'ישראל',
    // Persian
    'اسرائیل',
    // Chinese
    '以色列',
    // German
    'Israel',
    // French
    'Israël',
    // Spanish
    'Israel',
    // Russian
    'Израиль',
    // Turkish
    'İsrail',
    // Japanese
    'イスラエル',
    // Korean
    '이스라엘',
    // Hindi
    'इज़राइल',
  ]),

  country('Palestine', 'Middle East', [
    'Palestinian Territories', 'State of Palestine',
    // Arabic
    'فلسطين',
    // Persian
    'فلسطین',
    // Chinese
    '巴勒斯坦',
    // German
    'Palästina',
    // French
    'Palestine',
    // Spanish
    'Palestina',
    // Russian
    'Палестина',
    // Turkish
    'Filistin',
    // Japanese
    'パレスチナ',
    // Korean
    '팔레스타인',
    // Hindi
    'फ़िलिस्तीन',
  ]),

  country('Jordan', 'Middle East', [
    // Arabic
    'الأردن', 'الاردن',
    // Persian
    'اردن',
    // Chinese
    '约旦',
    // German
    'Jordanien',
    // French
    'Jordanie',
    // Spanish
    'Jordania',
    // Russian
    'Иордания',
    // Turkish
    'Ürdün',
    // Japanese
    'ヨルダン',
    // Korean
    '요르단',
    // Hindi
    'जॉर्डन',
  ]),

  country('Lebanon', 'Middle East', [
    // Arabic
    'لبنان',
    // Persian
    'لبنان',
    // Chinese
    '黎巴嫩',
    // German
    'Libanon',
    // French
    'Liban',
    // Spanish
    'Líbano',
    // Russian
    'Ливан',
    // Turkish
    'Lübnan',
    // Japanese
    'レバノン',
    // Korean
    '레바논',
    // Hindi
    'लेबनान',
  ]),

  country('Syria', 'Middle East', [
    // Arabic
    'سوريا', 'سورية',
    // Persian
    'سوریه',
    // Chinese
    '叙利亚',
    // German
    'Syrien',
    // French
    'Syrie',
    // Spanish
    'Siria',
    // Russian
    'Сирия',
    // Turkish
    'Suriye',
    // Japanese
    'シリア',
    // Korean
    '시리아',
    // Hindi
    'सीरिया',
  ]),

  country('Yemen', 'Middle East', [
    // Arabic
    'اليمن',
    // Persian
    'یمن',
    // Chinese
    '也门',
    // German
    'Jemen',
    // French
    'Yémen',
    // Spanish
    'Yemen',
    // Russian
    'Йемен',
    // Turkish
    'Yemen',
    // Japanese
    'イエメン',
    // Korean
    '예멘',
    // Hindi
    'यमन',
  ]),

  country('Turkey', 'Middle East', [
    'Türkiye', 'Republic of Turkey',
    // Arabic
    'تركيا',
    // Persian
    'ترکیه',
    // Chinese
    '土耳其',
    // German
    'Türkei',
    // French
    'Turquie',
    // Spanish
    'Turquía',
    // Russian
    'Турция',
    // Turkish
    'Türkiye',
    // Japanese
    'トルコ',
    // Korean
    '터키', '튀르키예',
    // Hindi
    'तुर्की',
  ]),

  country('Egypt', 'Africa', [
    // Arabic
    'مصر',
    // Persian
    'مصر',
    // Chinese
    '埃及',
    // German
    'Ägypten',
    // French
    'Égypte', 'Egypte',
    // Spanish
    'Egipto',
    // Russian
    'Египет',
    // Turkish
    'Mısır',
    // Japanese
    'エジプト',
    // Korean
    '이집트',
    // Hindi
    'मिस्र',
  ]),

  country('Georgia', 'Middle East', [
    // Georgian
    'საქართველო',
    // Arabic
    'جورجيا',
    // Persian
    'گرجستان',
    // Chinese
    '格鲁吉亚',
    // German
    'Georgien',
    // French
    'Géorgie',
    // Spanish
    'Georgia',
    // Russian
    'Грузия',
    // Turkish
    'Gürcistan',
    // Japanese
    'ジョージア',
    // Korean
    '조지아',
  ]),

  country('Armenia', 'Middle East', [
    // Armenian
    'Հայdelays',
    // Arabic
    'أرمينيا',
    // Persian
    'ارمنستان',
    // Chinese
    '亚美尼亚',
    // German
    'Armenien',
    // French
    'Arménie',
    // Spanish
    'Armenia',
    // Russian
    'Армения',
    // Turkish
    'Ermenistan',
    // Japanese
    'アルメニア',
    // Korean
    '아르메니아',
  ]),

  country('Azerbaijan', 'Middle East', [
    // Azerbaijani
    'Azərbaycan',
    // Arabic
    'أذربيجان',
    // Persian
    'آذربایجان',
    // Chinese
    '阿塞拜疆',
    // German
    'Aserbaidschan',
    // French
    'Azerbaïdjan',
    // Spanish
    'Azerbaiyán',
    // Russian
    'Азербайджан',
    // Turkish
    'Azerbaycan',
    // Japanese
    'アゼルバイジャン',
    // Korean
    '아제르바이잔',
  ]),

  // ============================================
  // EUROPE (أوروبا / 欧洲)
  // ============================================
  country('United Kingdom', 'Europe', [
    'UK', 'U.K.', 'Britain', 'Great Britain', 'England', 'Scotland', 'Wales', 'Northern Ireland',
    // Arabic
    'المملكة المتحدة', 'بريطانيا', 'إنجلترا', 'انجلترا',
    // Persian
    'بریتانیا', 'انگلستان', 'انگلیس',
    // Chinese
    '英国', '联合王国', '英格兰',
    // German
    'Vereinigtes Königreich', 'Großbritannien', 'England',
    // French
    'Royaume-Uni', 'Grande-Bretagne', 'Angleterre',
    // Spanish
    'Reino Unido', 'Gran Bretaña', 'Inglaterra',
    // Russian
    'Великобритания', 'Англия',
    // Turkish
    'Birleşik Krallık', 'İngiltere',
    // Japanese
    'イギリス', '英国',
    // Korean
    '영국',
    // Hindi
    'ब्रिटेन', 'इंग्लैंड',
  ]),

  country('Germany', 'Europe', [
    // German
    'Deutschland', 'Bundesrepublik Deutschland',
    // Arabic
    'ألمانيا', 'المانيا',
    // Persian
    'آلمان',
    // Chinese
    '德国',
    // French
    'Allemagne',
    // Spanish
    'Alemania',
    // Russian
    'Германия',
    // Turkish
    'Almanya',
    // Japanese
    'ドイツ',
    // Korean
    '독일',
    // Hindi
    'जर्मनी',
    // Portuguese
    'Alemanha',
    // Italian
    'Germania',
  ]),

  country('France', 'Europe', [
    // French
    'République française',
    // Arabic
    'فرنسا',
    // Persian
    'فرانسه',
    // Chinese
    '法国',
    // German
    'Frankreich',
    // Spanish
    'Francia',
    // Russian
    'Франция',
    // Turkish
    'Fransa',
    // Japanese
    'フランス',
    // Korean
    '프랑스',
    // Hindi
    'फ्रांस',
    // Italian
    'Francia',
  ]),

  country('Italy', 'Europe', [
    // Italian
    'Italia',
    // Arabic
    'إيطاليا', 'ايطاليا',
    // Persian
    'ایتالیا',
    // Chinese
    '意大利',
    // German
    'Italien',
    // French
    'Italie',
    // Spanish
    'Italia',
    // Russian
    'Италия',
    // Turkish
    'İtalya',
    // Japanese
    'イタリア',
    // Korean
    '이탈리아',
    // Hindi
    'इटली',
  ]),

  country('Spain', 'Europe', [
    // Spanish
    'España',
    // Arabic
    'إسبانيا', 'اسبانيا',
    // Persian
    'اسپانیا',
    // Chinese
    '西班牙',
    // German
    'Spanien',
    // French
    'Espagne',
    // Russian
    'Испания',
    // Turkish
    'İspanya',
    // Japanese
    'スペイン',
    // Korean
    '스페인',
    // Hindi
    'स्पेन',
    // Portuguese
    'Espanha',
  ]),

  country('Netherlands', 'Europe', [
    'Holland', 'The Netherlands',
    // Dutch
    'Nederland',
    // Arabic
    'هولندا',
    // Persian
    'هلند',
    // Chinese
    '荷兰',
    // German
    'Niederlande',
    // French
    'Pays-Bas',
    // Spanish
    'Países Bajos', 'Holanda',
    // Russian
    'Нидерланды', 'Голландия',
    // Turkish
    'Hollanda',
    // Japanese
    'オランダ',
    // Korean
    '네덜란드',
    // Hindi
    'नीदरलैंड',
  ]),

  country('Belgium', 'Europe', [
    // Dutch
    'België',
    // French
    'Belgique',
    // German
    'Belgien',
    // Arabic
    'بلجيكا',
    // Persian
    'بلژیک',
    // Chinese
    '比利时',
    // Spanish
    'Bélgica',
    // Russian
    'Бельгия',
    // Turkish
    'Belçika',
    // Japanese
    'ベルギー',
    // Korean
    '벨기에',
    // Hindi
    'बेल्जियम',
  ]),

  country('Switzerland', 'Europe', [
    // German
    'Schweiz',
    // French
    'Suisse',
    // Italian
    'Svizzera',
    // Arabic
    'سويسرا',
    // Persian
    'سوئیس',
    // Chinese
    '瑞士',
    // Spanish
    'Suiza',
    // Russian
    'Швейцария',
    // Turkish
    'İsviçre',
    // Japanese
    'スイス',
    // Korean
    '스위스',
    // Hindi
    'स्विट्जरलैंड',
  ]),

  country('Austria', 'Europe', [
    // German
    'Österreich',
    // Arabic
    'النمسا',
    // Persian
    'اتریش',
    // Chinese
    '奥地利',
    // French
    'Autriche',
    // Spanish
    'Austria',
    // Russian
    'Австрия',
    // Turkish
    'Avusturya',
    // Japanese
    'オーストリア',
    // Korean
    '오스트리아',
    // Hindi
    'ऑस्ट्रिया',
  ]),

  country('Poland', 'Europe', [
    // Polish
    'Polska',
    // Arabic
    'بولندا',
    // Persian
    'لهستان',
    // Chinese
    '波兰',
    // German
    'Polen',
    // French
    'Pologne',
    // Spanish
    'Polonia',
    // Russian
    'Польша',
    // Turkish
    'Polonya',
    // Japanese
    'ポーランド',
    // Korean
    '폴란드',
    // Hindi
    'पोलैंड',
  ]),

  country('Czech Republic', 'Europe', [
    'Czechia',
    // Czech
    'Česká republika', 'Česko',
    // Arabic
    'التشيك', 'جمهورية التشيك',
    // Persian
    'چک', 'جمهوری چک',
    // Chinese
    '捷克',
    // German
    'Tschechien', 'Tschechische Republik',
    // French
    'Tchéquie', 'République tchèque',
    // Spanish
    'Chequia', 'República Checa',
    // Russian
    'Чехия',
    // Turkish
    'Çekya', 'Çek Cumhuriyeti',
    // Japanese
    'チェコ',
    // Korean
    '체코',
  ]),

  country('Sweden', 'Europe', [
    // Swedish
    'Sverige',
    // Arabic
    'السويد',
    // Persian
    'سوئد',
    // Chinese
    '瑞典',
    // German
    'Schweden',
    // French
    'Suède',
    // Spanish
    'Suecia',
    // Russian
    'Швеция',
    // Turkish
    'İsveç',
    // Japanese
    'スウェーデン',
    // Korean
    '스웨덴',
    // Hindi
    'स्वीडन',
  ]),

  country('Norway', 'Europe', [
    // Norwegian
    'Norge',
    // Arabic
    'النرويج',
    // Persian
    'نروژ',
    // Chinese
    '挪威',
    // German
    'Norwegen',
    // French
    'Norvège',
    // Spanish
    'Noruega',
    // Russian
    'Норвегия',
    // Turkish
    'Norveç',
    // Japanese
    'ノルウェー',
    // Korean
    '노르웨이',
    // Hindi
    'नॉर्वे',
  ]),

  country('Denmark', 'Europe', [
    // Danish
    'Danmark',
    // Arabic
    'الدنمارك',
    // Persian
    'دانمارک',
    // Chinese
    '丹麦',
    // German
    'Dänemark',
    // French
    'Danemark',
    // Spanish
    'Dinamarca',
    // Russian
    'Дания',
    // Turkish
    'Danimarka',
    // Japanese
    'デンマーク',
    // Korean
    '덴마크',
    // Hindi
    'डेनमार्क',
  ]),

  country('Finland', 'Europe', [
    // Finnish
    'Suomi',
    // Arabic
    'فنلندا',
    // Persian
    'فنلاند',
    // Chinese
    '芬兰',
    // German
    'Finnland',
    // French
    'Finlande',
    // Spanish
    'Finlandia',
    // Russian
    'Финляндия',
    // Turkish
    'Finlandiya',
    // Japanese
    'フィンランド',
    // Korean
    '핀란드',
    // Hindi
    'फ़िनलैंड',
  ]),

  country('Ireland', 'Europe', [
    // Irish
    'Éire',
    // Arabic
    'أيرلندا', 'ايرلندا',
    // Persian
    'ایرلند',
    // Chinese
    '爱尔兰',
    // German
    'Irland',
    // French
    'Irlande',
    // Spanish
    'Irlanda',
    // Russian
    'Ирландия',
    // Turkish
    'İrlanda',
    // Japanese
    'アイルランド',
    // Korean
    '아일랜드',
    // Hindi
    'आयरलैंड',
  ]),

  country('Portugal', 'Europe', [
    // Arabic
    'البرتغال',
    // Persian
    'پرتغال',
    // Chinese
    '葡萄牙',
    // German
    'Portugal',
    // French
    'Portugal',
    // Spanish
    'Portugal',
    // Russian
    'Португалия',
    // Turkish
    'Portekiz',
    // Japanese
    'ポルトガル',
    // Korean
    '포르투갈',
    // Hindi
    'पुर्तगाल',
  ]),

  country('Greece', 'Europe', [
    // Greek
    'Ελλάδα', 'Hellas',
    // Arabic
    'اليونان',
    // Persian
    'یونان',
    // Chinese
    '希腊',
    // German
    'Griechenland',
    // French
    'Grèce',
    // Spanish
    'Grecia',
    // Russian
    'Греция',
    // Turkish
    'Yunanistan',
    // Japanese
    'ギリシャ',
    // Korean
    '그리스',
    // Hindi
    'यूनान',
  ]),

  country('Hungary', 'Europe', [
    // Hungarian
    'Magyarország',
    // Arabic
    'المجر', 'هنغاريا',
    // Persian
    'مجارستان',
    // Chinese
    '匈牙利',
    // German
    'Ungarn',
    // French
    'Hongrie',
    // Spanish
    'Hungría',
    // Russian
    'Венгрия',
    // Turkish
    'Macaristan',
    // Japanese
    'ハンガリー',
    // Korean
    '헝가리',
    // Hindi
    'हंगरी',
  ]),

  country('Romania', 'Europe', [
    // Romanian
    'România',
    // Arabic
    'رومانيا',
    // Persian
    'رومانی',
    // Chinese
    '罗马尼亚',
    // German
    'Rumänien',
    // French
    'Roumanie',
    // Spanish
    'Rumania', 'Rumanía',
    // Russian
    'Румыния',
    // Turkish
    'Romanya',
    // Japanese
    'ルーマニア',
    // Korean
    '루마니아',
    // Hindi
    'रोमानिया',
  ]),

  country('Bulgaria', 'Europe', [
    // Bulgarian
    'България',
    // Arabic
    'بلغاريا',
    // Persian
    'بلغارستان',
    // Chinese
    '保加利亚',
    // German
    'Bulgarien',
    // French
    'Bulgarie',
    // Spanish
    'Bulgaria',
    // Russian
    'Болгария',
    // Turkish
    'Bulgaristan',
    // Japanese
    'ブルガリア',
    // Korean
    '불가리아',
    // Hindi
    'बुल्गारिया',
  ]),

  country('Ukraine', 'Europe', [
    // Ukrainian
    'Україна',
    // Arabic
    'أوكرانيا',
    // Persian
    'اوکراین',
    // Chinese
    '乌克兰',
    // German
    'Ukraine',
    // French
    'Ukraine',
    // Spanish
    'Ucrania',
    // Russian
    'Украина',
    // Turkish
    'Ukrayna',
    // Japanese
    'ウクライナ',
    // Korean
    '우크라이나',
    // Hindi
    'यूक्रेन',
  ]),

  country('Russia', 'Europe', [
    'Russian Federation',
    // Russian
    'Россия', 'Российская Федерация',
    // Arabic
    'روسيا',
    // Persian
    'روسیه',
    // Chinese
    '俄罗斯', '俄国',
    // German
    'Russland',
    // French
    'Russie',
    // Spanish
    'Rusia',
    // Turkish
    'Rusya',
    // Japanese
    'ロシア',
    // Korean
    '러시아',
    // Hindi
    'रूस',
  ]),

  country('Serbia', 'Europe', [
    // Serbian
    'Србија',
    // Arabic
    'صربيا',
    // Chinese
    '塞尔维亚',
    // German
    'Serbien',
    // French
    'Serbie',
    // Spanish
    'Serbia',
    // Russian
    'Сербия',
    // Turkish
    'Sırbistan',
    // Japanese
    'セルビア',
    // Korean
    '세르비아',
  ]),

  country('Croatia', 'Europe', [
    // Croatian
    'Hrvatska',
    // Arabic
    'كرواتيا',
    // Chinese
    '克罗地亚',
    // German
    'Kroatien',
    // French
    'Croatie',
    // Spanish
    'Croacia',
    // Russian
    'Хорватия',
    // Turkish
    'Hırvatistan',
    // Japanese
    'クロアチア',
    // Korean
    '크로아티아',
  ]),

  country('Slovenia', 'Europe', [
    // Slovenian
    'Slovenija',
    // Arabic
    'سلوفينيا',
    // Chinese
    '斯洛文尼亚',
    // German
    'Slowenien',
    // French
    'Slovénie',
    // Spanish
    'Eslovenia',
    // Russian
    'Словения',
    // Turkish
    'Slovenya',
    // Japanese
    'スロベニア',
    // Korean
    '슬로베니아',
  ]),

  country('Slovakia', 'Europe', [
    // Slovak
    'Slovensko',
    // Arabic
    'سلوفاكيا',
    // Chinese
    '斯洛伐克',
    // German
    'Slowakei',
    // French
    'Slovaquie',
    // Spanish
    'Eslovaquia',
    // Russian
    'Словакия',
    // Turkish
    'Slovakya',
    // Japanese
    'スロバキア',
    // Korean
    '슬로바키아',
  ]),

  country('Lithuania', 'Europe', [
    // Lithuanian
    'Lietuva',
    // Arabic
    'ليتوانيا',
    // Chinese
    '立陶宛',
    // German
    'Litauen',
    // French
    'Lituanie',
    // Spanish
    'Lituania',
    // Russian
    'Литва',
    // Turkish
    'Litvanya',
    // Japanese
    'リトアニア',
    // Korean
    '리투아니아',
  ]),

  country('Latvia', 'Europe', [
    // Latvian
    'Latvija',
    // Arabic
    'لاتفيا',
    // Chinese
    '拉脱维亚',
    // German
    'Lettland',
    // French
    'Lettonie',
    // Spanish
    'Letonia',
    // Russian
    'Латвия',
    // Turkish
    'Letonya',
    // Japanese
    'ラトビア',
    // Korean
    '라트비아',
  ]),

  country('Estonia', 'Europe', [
    // Estonian
    'Eesti',
    // Arabic
    'إستونيا',
    // Chinese
    '爱沙尼亚',
    // German
    'Estland',
    // French
    'Estonie',
    // Spanish
    'Estonia',
    // Russian
    'Эстония',
    // Turkish
    'Estonya',
    // Japanese
    'エストニア',
    // Korean
    '에스토니아',
  ]),

  country('Cyprus', 'Europe', [
    // Greek
    'Κύπρος',
    // Turkish
    'Kıbrıs',
    // Arabic
    'قبرص',
    // Chinese
    '塞浦路斯',
    // German
    'Zypern',
    // French
    'Chypre',
    // Spanish
    'Chipre',
    // Russian
    'Кипр',
    // Japanese
    'キプロス',
    // Korean
    '키프로스',
  ]),

  country('Malta', 'Europe', [
    // Maltese
    'Malta',
    // Arabic
    'مالطا',
    // Chinese
    '马耳他',
    // German
    'Malta',
    // French
    'Malte',
    // Spanish
    'Malta',
    // Russian
    'Мальта',
    // Turkish
    'Malta',
    // Japanese
    'マルタ',
    // Korean
    '몰타',
  ]),

  country('Iceland', 'Europe', [
    // Icelandic
    'Ísland',
    // Arabic
    'آيسلندا',
    // Chinese
    '冰岛',
    // German
    'Island',
    // French
    'Islande',
    // Spanish
    'Islandia',
    // Russian
    'Исландия',
    // Turkish
    'İzlanda',
    // Japanese
    'アイスランド',
    // Korean
    '아이슬란드',
  ]),

  country('Luxembourg', 'Europe', [
    // Luxembourgish
    'Lëtzebuerg',
    // Arabic
    'لوكسمبورغ',
    // Chinese
    '卢森堡',
    // German
    'Luxemburg',
    // French
    'Luxembourg',
    // Spanish
    'Luxemburgo',
    // Russian
    'Люксембург',
    // Turkish
    'Lüksemburg',
    // Japanese
    'ルクセンブルク',
    // Korean
    '룩셈부르크',
  ]),

  country('Monaco', 'Europe', [
    // Arabic
    'موناكو',
    // Chinese
    '摩纳哥',
    // German
    'Monaco',
    // French
    'Monaco',
    // Spanish
    'Mónaco',
    // Russian
    'Монако',
    // Turkish
    'Monako',
    // Japanese
    'モナコ',
    // Korean
    '모나코',
  ]),

  country('Andorra', 'Europe', [
    // Arabic
    'أندورا',
    // Chinese
    '安道尔',
    // German
    'Andorra',
    // French
    'Andorre',
    // Spanish
    'Andorra',
    // Russian
    'Андорра',
    // Turkish
    'Andorra',
    // Japanese
    'アンドラ',
    // Korean
    '안도라',
  ]),

  country('Liechtenstein', 'Europe', [
    // Arabic
    'ليختنشتاين',
    // Chinese
    '列支敦士登',
    // German
    'Liechtenstein',
    // French
    'Liechtenstein',
    // Spanish
    'Liechtenstein',
    // Russian
    'Лихтенштейн',
    // Turkish
    'Lihtenştayn',
    // Japanese
    'リヒテンシュタイン',
    // Korean
    '리히텐슈타인',
  ]),

  country('San Marino', 'Europe', [
    // Arabic
    'سان مارينو',
    // Chinese
    '圣马力诺',
    // German
    'San Marino',
    // French
    'Saint-Marin',
    // Spanish
    'San Marino',
    // Russian
    'Сан-Марино',
    // Turkish
    'San Marino',
    // Japanese
    'サンマリノ',
    // Korean
    '산마리노',
  ]),

  country('Vatican City', 'Europe', [
    'Vatican', 'Holy See',
    // Arabic
    'الفاتيكان', 'مدينة الفاتيكان',
    // Chinese
    '梵蒂冈',
    // German
    'Vatikanstadt',
    // French
    'Vatican', 'Cité du Vatican',
    // Spanish
    'Ciudad del Vaticano', 'Vaticano',
    // Russian
    'Ватикан',
    // Turkish
    'Vatikan',
    // Japanese
    'バチカン',
    // Korean
    '바티칸',
  ]),

  country('Albania', 'Europe', [
    // Albanian
    'Shqipëri', 'Shqipëria',
    // Arabic
    'ألبانيا',
    // Chinese
    '阿尔巴尼亚',
    // German
    'Albanien',
    // French
    'Albanie',
    // Spanish
    'Albania',
    // Russian
    'Албания',
    // Turkish
    'Arnavutluk',
    // Japanese
    'アルバニア',
    // Korean
    '알바니아',
  ]),

  country('North Macedonia', 'Europe', [
    'Macedonia',
    // Macedonian
    'Северна Македонија',
    // Arabic
    'مقدونيا الشمالية',
    // Chinese
    '北马其顿',
    // German
    'Nordmazedonien',
    // French
    'Macédoine du Nord',
    // Spanish
    'Macedonia del Norte',
    // Russian
    'Северная Македония',
    // Turkish
    'Kuzey Makedonya',
    // Japanese
    '北マケドニア',
    // Korean
    '북마케도니아',
  ]),

  country('Montenegro', 'Europe', [
    // Montenegrin
    'Crna Gora',
    // Arabic
    'الجبل الأسود', 'مونتينيغرو',
    // Chinese
    '黑山',
    // German
    'Montenegro',
    // French
    'Monténégro',
    // Spanish
    'Montenegro',
    // Russian
    'Черногория',
    // Turkish
    'Karadağ',
    // Japanese
    'モンテネグロ',
    // Korean
    '몬테네그로',
  ]),

  country('Bosnia and Herzegovina', 'Europe', [
    'Bosnia', 'BiH',
    // Bosnian
    'Bosna i Hercegovina',
    // Arabic
    'البوسنة والهرسك',
    // Chinese
    '波斯尼亚和黑塞哥维那',
    // German
    'Bosnien und Herzegowina',
    // French
    'Bosnie-Herzégovine',
    // Spanish
    'Bosnia y Herzegovina',
    // Russian
    'Босния и Герцеговина',
    // Turkish
    'Bosna-Hersek',
    // Japanese
    'ボスニア・ヘルツェゴビナ',
    // Korean
    '보스니아 헤르체고비나',
  ]),

  country('Moldova', 'Europe', [
    // Romanian
    'Moldova',
    // Arabic
    'مولدوفا',
    // Chinese
    '摩尔多瓦',
    // German
    'Moldau', 'Moldawien',
    // French
    'Moldavie',
    // Spanish
    'Moldavia',
    // Russian
    'Молдова', 'Молдавия',
    // Turkish
    'Moldova',
    // Japanese
    'モルドバ',
    // Korean
    '몰도바',
  ]),

  country('Belarus', 'Europe', [
    // Belarusian
    'Беларусь',
    // Arabic
    'بيلاروسيا',
    // Chinese
    '白俄罗斯',
    // German
    'Belarus', 'Weißrussland',
    // French
    'Biélorussie', 'Bélarus',
    // Spanish
    'Bielorrusia', 'Belarús',
    // Russian
    'Беларусь', 'Белоруссия',
    // Turkish
    'Belarus',
    // Japanese
    'ベラルーシ',
    // Korean
    '벨라루스',
  ]),

  // ============================================
  // ASIA (آسيا / 亚洲)
  // ============================================
  country('China', 'Asia', [
    'PRC', "People's Republic of China",
    // Chinese
    '中国', '中华人民共和国',
    // Arabic
    'الصين',
    // Persian
    'چین',
    // German
    'China',
    // French
    'Chine',
    // Spanish
    'China',
    // Russian
    'Китай',
    // Turkish
    'Çin',
    // Japanese
    '中国',
    // Korean
    '중국',
    // Hindi
    'चीन',
  ]),

  country('Japan', 'Asia', [
    // Japanese
    '日本', 'にほん', 'ニホン',
    // Arabic
    'اليابان',
    // Persian
    'ژاپن',
    // Chinese
    '日本',
    // German
    'Japan',
    // French
    'Japon',
    // Spanish
    'Japón',
    // Russian
    'Япония',
    // Turkish
    'Japonya',
    // Korean
    '일본',
    // Hindi
    'जापान',
  ]),

  country('South Korea', 'Asia', [
    'Korea', 'Republic of Korea', 'ROK',
    // Korean
    '대한민국', '한국',
    // Arabic
    'كوريا الجنوبية', 'كوريا',
    // Persian
    'کره جنوبی',
    // Chinese
    '韩国', '南韩',
    // German
    'Südkorea',
    // French
    'Corée du Sud',
    // Spanish
    'Corea del Sur',
    // Russian
    'Южная Корея',
    // Turkish
    'Güney Kore',
    // Japanese
    '韓国',
    // Hindi
    'दक्षिण कोरिया',
  ]),

  country('North Korea', 'Asia', [
    'DPRK',
    // Korean
    '조선민주주의인민공화국', '북한',
    // Arabic
    'كوريا الشمالية',
    // Chinese
    '朝鲜', '北韩',
    // German
    'Nordkorea',
    // French
    'Corée du Nord',
    // Spanish
    'Corea del Norte',
    // Russian
    'Северная Корея',
    // Turkish
    'Kuzey Kore',
    // Japanese
    '北朝鮮',
  ]),

  country('India', 'Asia', [
    'Bharat',
    // Hindi
    'भारत',
    // Arabic
    'الهند',
    // Persian
    'هند',
    // Chinese
    '印度',
    // German
    'Indien',
    // French
    'Inde',
    // Spanish
    'India',
    // Russian
    'Индия',
    // Turkish
    'Hindistan',
    // Japanese
    'インド',
    // Korean
    '인도',
  ]),

  country('Pakistan', 'Asia', [
    // Urdu
    'پاکستان',
    // Arabic
    'باكستان',
    // Chinese
    '巴基斯坦',
    // German
    'Pakistan',
    // French
    'Pakistan',
    // Spanish
    'Pakistán',
    // Russian
    'Пакистан',
    // Turkish
    'Pakistan',
    // Japanese
    'パキスタン',
    // Korean
    '파키스탄',
    // Hindi
    'पाकिस्तान',
  ]),

  country('Bangladesh', 'Asia', [
    // Bengali
    'বাংলাদেশ',
    // Arabic
    'بنغلاديش',
    // Chinese
    '孟加拉国',
    // German
    'Bangladesch',
    // French
    'Bangladesh',
    // Spanish
    'Bangladés',
    // Russian
    'Бангладеш',
    // Turkish
    'Bangladeş',
    // Japanese
    'バングラデシュ',
    // Korean
    '방글라데시',
    // Hindi
    'बांग्लादेश',
  ]),

  country('Indonesia', 'Asia', [
    // Indonesian
    'Indonesia',
    // Arabic
    'إندونيسيا',
    // Chinese
    '印度尼西亚', '印尼',
    // German
    'Indonesien',
    // French
    'Indonésie',
    // Spanish
    'Indonesia',
    // Russian
    'Индонезия',
    // Turkish
    'Endonezya',
    // Japanese
    'インドネシア',
    // Korean
    '인도네시아',
    // Hindi
    'इंडोनेशिया',
  ]),

  country('Malaysia', 'Asia', [
    // Malay
    'Malaysia',
    // Arabic
    'ماليزيا',
    // Chinese
    '马来西亚',
    // German
    'Malaysia',
    // French
    'Malaisie',
    // Spanish
    'Malasia',
    // Russian
    'Малайзия',
    // Turkish
    'Malezya',
    // Japanese
    'マレーシア',
    // Korean
    '말레이시아',
    // Hindi
    'मलेशिया',
  ]),

  country('Singapore', 'Asia', [
    // Chinese
    '新加坡',
    // Malay
    'Singapura',
    // Tamil
    'சிங்கப்பூர்',
    // Arabic
    'سنغافورة',
    // German
    'Singapur',
    // French
    'Singapour',
    // Spanish
    'Singapur',
    // Russian
    'Сингапур',
    // Turkish
    'Singapur',
    // Japanese
    'シンガポール',
    // Korean
    '싱가포르',
    // Hindi
    'सिंगापुर',
  ]),

  country('Thailand', 'Asia', [
    // Thai
    'ประเทศไทย', 'ไทย',
    // Arabic
    'تايلاند',
    // Persian
    'تایلند',
    // Chinese
    '泰国',
    // German
    'Thailand',
    // French
    'Thaïlande',
    // Spanish
    'Tailandia',
    // Russian
    'Таиланд',
    // Turkish
    'Tayland',
    // Japanese
    'タイ',
    // Korean
    '태국',
    // Hindi
    'थाईलैंड',
  ]),

  country('Vietnam', 'Asia', [
    // Vietnamese
    'Việt Nam',
    // Arabic
    'فيتنام',
    // Chinese
    '越南',
    // German
    'Vietnam',
    // French
    'Viêt Nam', 'Vietnam',
    // Spanish
    'Vietnam',
    // Russian
    'Вьетнам',
    // Turkish
    'Vietnam',
    // Japanese
    'ベトナム',
    // Korean
    '베트남',
    // Hindi
    'वियतनाम',
  ]),

  country('Philippines', 'Asia', [
    // Filipino
    'Pilipinas',
    // Arabic
    'الفلبين',
    // Chinese
    '菲律宾',
    // German
    'Philippinen',
    // French
    'Philippines',
    // Spanish
    'Filipinas',
    // Russian
    'Филиппины',
    // Turkish
    'Filipinler',
    // Japanese
    'フィリピン',
    // Korean
    '필리핀',
    // Hindi
    'फिलीपींस',
  ]),

  country('Taiwan', 'Asia', [
    'Republic of China', 'ROC',
    // Chinese
    '台湾', '臺灣', '中華民國',
    // Arabic
    'تايوان',
    // German
    'Taiwan',
    // French
    'Taïwan',
    // Spanish
    'Taiwán',
    // Russian
    'Тайвань',
    // Turkish
    'Tayvan',
    // Japanese
    '台湾',
    // Korean
    '대만', '타이완',
    // Hindi
    'ताइवान',
  ]),

  country('Hong Kong', 'Asia', [
    'HK',
    // Chinese
    '香港',
    // Arabic
    'هونغ كونغ',
    // German
    'Hongkong',
    // French
    'Hong Kong',
    // Spanish
    'Hong Kong',
    // Russian
    'Гонконг',
    // Turkish
    'Hong Kong',
    // Japanese
    '香港',
    // Korean
    '홍콩',
    // Hindi
    'हांगकांग',
  ]),

  country('Macau', 'Asia', [
    'Macao',
    // Chinese
    '澳门', '澳門',
    // Portuguese
    'Macau',
    // Arabic
    'ماكاو',
    // German
    'Macau',
    // French
    'Macao',
    // Spanish
    'Macao',
    // Russian
    'Макао',
    // Turkish
    'Makao',
    // Japanese
    'マカオ',
    // Korean
    '마카오',
  ]),

  country('Myanmar', 'Asia', [
    'Burma',
    // Burmese
    'မြန်မာ',
    // Arabic
    'ميانمار', 'بورما',
    // Chinese
    '缅甸',
    // German
    'Myanmar',
    // French
    'Birmanie', 'Myanmar',
    // Spanish
    'Birmania', 'Myanmar',
    // Russian
    'Мьянма',
    // Turkish
    'Myanmar',
    // Japanese
    'ミャンマー',
    // Korean
    '미얀마',
    // Hindi
    'म्यांमार',
  ]),

  country('Cambodia', 'Asia', [
    // Khmer
    'កម្ពុជា',
    // Arabic
    'كمبوديا',
    // Chinese
    '柬埔寨',
    // German
    'Kambodscha',
    // French
    'Cambodge',
    // Spanish
    'Camboya',
    // Russian
    'Камбоджа',
    // Turkish
    'Kamboçya',
    // Japanese
    'カンボジア',
    // Korean
    '캄보디아',
    // Hindi
    'कंबोडिया',
  ]),

  country('Laos', 'Asia', [
    // Lao
    'ລາວ',
    // Arabic
    'لاوس',
    // Chinese
    '老挝',
    // German
    'Laos',
    // French
    'Laos',
    // Spanish
    'Laos',
    // Russian
    'Лаос',
    // Turkish
    'Laos',
    // Japanese
    'ラオス',
    // Korean
    '라오스',
    // Hindi
    'लाओस',
  ]),

  country('Brunei', 'Asia', [
    'Brunei Darussalam',
    // Malay
    'Brunei',
    // Arabic
    'بروناي',
    // Chinese
    '文莱',
    // German
    'Brunei',
    // French
    'Brunei',
    // Spanish
    'Brunéi',
    // Russian
    'Бруней',
    // Turkish
    'Brunei',
    // Japanese
    'ブルネイ',
    // Korean
    '브루나이',
  ]),

  country('Timor-Leste', 'Asia', [
    'East Timor',
    // Portuguese
    'Timor-Leste',
    // Arabic
    'تيمور الشرقية',
    // Chinese
    '东帝汶',
    // German
    'Osttimor',
    // French
    'Timor oriental',
    // Spanish
    'Timor Oriental',
    // Russian
    'Восточный Тимор',
    // Japanese
    '東ティモール',
    // Korean
    '동티모르',
  ]),

  country('Mongolia', 'Asia', [
    // Mongolian
    'Монгол улс',
    // Arabic
    'منغوليا',
    // Chinese
    '蒙古',
    // German
    'Mongolei',
    // French
    'Mongolie',
    // Spanish
    'Mongolia',
    // Russian
    'Монголия',
    // Turkish
    'Moğolistan',
    // Japanese
    'モンゴル',
    // Korean
    '몽골',
    // Hindi
    'मंगोलिया',
  ]),

  country('Nepal', 'Asia', [
    // Nepali
    'नेपाल',
    // Arabic
    'نيبال',
    // Chinese
    '尼泊尔',
    // German
    'Nepal',
    // French
    'Népal',
    // Spanish
    'Nepal',
    // Russian
    'Непал',
    // Turkish
    'Nepal',
    // Japanese
    'ネパール',
    // Korean
    '네팔',
  ]),

  country('Bhutan', 'Asia', [
    // Dzongkha
    'འབྲུག་ཡུལ།',
    // Arabic
    'بوتان',
    // Chinese
    '不丹',
    // German
    'Bhutan',
    // French
    'Bhoutan',
    // Spanish
    'Bután',
    // Russian
    'Бутан',
    // Turkish
    'Butan',
    // Japanese
    'ブータン',
    // Korean
    '부탄',
    // Hindi
    'भूटान',
  ]),

  country('Sri Lanka', 'Asia', [
    'Ceylon',
    // Sinhala
    'ශ්‍රී ලංකාව',
    // Tamil
    'இலங்கை',
    // Arabic
    'سريلانكا',
    // Chinese
    '斯里兰卡',
    // German
    'Sri Lanka',
    // French
    'Sri Lanka',
    // Spanish
    'Sri Lanka',
    // Russian
    'Шри-Ланка',
    // Turkish
    'Sri Lanka',
    // Japanese
    'スリランカ',
    // Korean
    '스리랑카',
    // Hindi
    'श्रीलंका',
  ]),

  country('Maldives', 'Asia', [
    // Dhivehi
    'ދިވެހިރާއްޖެ',
    // Arabic
    'المالديف', 'جزر المالديف',
    // Chinese
    '马尔代夫',
    // German
    'Malediven',
    // French
    'Maldives',
    // Spanish
    'Maldivas',
    // Russian
    'Мальдивы',
    // Turkish
    'Maldivler',
    // Japanese
    'モルディブ',
    // Korean
    '몰디브',
    // Hindi
    'मालदीव',
  ]),

  country('Afghanistan', 'Asia', [
    // Pashto
    'افغانستان',
    // Dari/Persian
    'افغانستان',
    // Arabic
    'أفغانستان',
    // Chinese
    '阿富汗',
    // German
    'Afghanistan',
    // French
    'Afghanistan',
    // Spanish
    'Afganistán',
    // Russian
    'Афганистан',
    // Turkish
    'Afganistan',
    // Japanese
    'アフガニスタン',
    // Korean
    '아프가니스탄',
    // Hindi
    'अफ़ग़ानिस्तान',
  ]),

  country('Kazakhstan', 'Asia', [
    // Kazakh
    'Қазақстан',
    // Russian
    'Казахстан',
    // Arabic
    'كازاخستان',
    // Chinese
    '哈萨克斯坦',
    // German
    'Kasachstan',
    // French
    'Kazakhstan',
    // Spanish
    'Kazajistán',
    // Turkish
    'Kazakistan',
    // Japanese
    'カザフスタン',
    // Korean
    '카자흐스탄',
  ]),

  country('Uzbekistan', 'Asia', [
    // Uzbek
    "O'zbekiston",
    // Russian
    'Узбекистан',
    // Arabic
    'أوزبكستان',
    // Chinese
    '乌兹别克斯坦',
    // German
    'Usbekistan',
    // French
    'Ouzbékistan',
    // Spanish
    'Uzbekistán',
    // Turkish
    'Özbekistan',
    // Japanese
    'ウズベキスタン',
    // Korean
    '우즈베키스탄',
  ]),

  country('Turkmenistan', 'Asia', [
    // Turkmen
    'Türkmenistan',
    // Russian
    'Туркменистан',
    // Arabic
    'تركمانستان',
    // Chinese
    '土库曼斯坦',
    // German
    'Turkmenistan',
    // French
    'Turkménistan',
    // Spanish
    'Turkmenistán',
    // Turkish
    'Türkmenistan',
    // Japanese
    'トルクメニスタン',
    // Korean
    '투르크메니스탄',
  ]),

  country('Tajikistan', 'Asia', [
    // Tajik
    'Тоҷикистон',
    // Russian
    'Таджикистан',
    // Arabic
    'طاجيكستان',
    // Chinese
    '塔吉克斯坦',
    // German
    'Tadschikistan',
    // French
    'Tadjikistan',
    // Spanish
    'Tayikistán',
    // Turkish
    'Tacikistan',
    // Japanese
    'タジキスタン',
    // Korean
    '타지키스탄',
  ]),

  country('Kyrgyzstan', 'Asia', [
    // Kyrgyz
    'Кыргызстан',
    // Russian
    'Киргизия',
    // Arabic
    'قيرغيزستان',
    // Chinese
    '吉尔吉斯斯坦',
    // German
    'Kirgisistan',
    // French
    'Kirghizistan',
    // Spanish
    'Kirguistán',
    // Turkish
    'Kırgızistan',
    // Japanese
    'キルギス',
    // Korean
    '키르기스스탄',
  ]),

  // ============================================
  // AMERICAS (الأمريكيتان / 美洲)
  // ============================================
  country('United States', 'America', [
    'USA', 'U.S.A.', 'U.S.', 'US', 'America', 'United States of America',
    // Arabic
    'الولايات المتحدة', 'الولايات المتحدة الأمريكية', 'أمريكا', 'امريكا',
    // Persian
    'آمریکا', 'ایالات متحده', 'ایالات متحده آمریکا',
    // Chinese
    '美国', '美利坚',
    // German
    'Vereinigte Staaten', 'USA',
    // French
    'États-Unis', 'Etats-Unis', 'USA',
    // Spanish
    'Estados Unidos', 'EE.UU.', 'EEUU',
    // Russian
    'США', 'Соединённые Штаты Америки',
    // Turkish
    'Amerika Birleşik Devletleri', 'ABD', 'Amerika',
    // Japanese
    'アメリカ', '米国',
    // Korean
    '미국',
    // Hindi
    'अमेरिका', 'संयुक्त राज्य अमेरिका',
    // Portuguese
    'Estados Unidos', 'EUA',
  ]),

  country('Canada', 'America', [
    // Arabic
    'كندا',
    // Persian
    'کانادا',
    // Chinese
    '加拿大',
    // German
    'Kanada',
    // French
    'Canada',
    // Spanish
    'Canadá',
    // Russian
    'Канада',
    // Turkish
    'Kanada',
    // Japanese
    'カナダ',
    // Korean
    '캐나다',
    // Hindi
    'कनाडा',
  ]),

  country('Mexico', 'America', [
    // Spanish
    'México',
    // Arabic
    'المكسيك',
    // Chinese
    '墨西哥',
    // German
    'Mexiko',
    // French
    'Mexique',
    // Russian
    'Мексика',
    // Turkish
    'Meksika',
    // Japanese
    'メキシコ',
    // Korean
    '멕시코',
    // Hindi
    'मैक्सिको',
  ]),

  country('Brazil', 'America', [
    // Portuguese
    'Brasil',
    // Arabic
    'البرازيل',
    // Chinese
    '巴西',
    // German
    'Brasilien',
    // French
    'Brésil',
    // Spanish
    'Brasil',
    // Russian
    'Бразилия',
    // Turkish
    'Brezilya',
    // Japanese
    'ブラジル',
    // Korean
    '브라질',
    // Hindi
    'ब्राज़ील',
  ]),

  country('Argentina', 'America', [
    // Arabic
    'الأرجنتين',
    // Chinese
    '阿根廷',
    // German
    'Argentinien',
    // French
    'Argentine',
    // Spanish
    'Argentina',
    // Russian
    'Аргентина',
    // Turkish
    'Arjantin',
    // Japanese
    'アルゼンチン',
    // Korean
    '아르헨티나',
    // Hindi
    'अर्जेंटीना',
  ]),

  country('Colombia', 'America', [
    // Arabic
    'كولومبيا',
    // Chinese
    '哥伦比亚',
    // German
    'Kolumbien',
    // French
    'Colombie',
    // Spanish
    'Colombia',
    // Russian
    'Колумбия',
    // Turkish
    'Kolombiya',
    // Japanese
    'コロンビア',
    // Korean
    '콜롬비아',
    // Hindi
    'कोलंबिया',
  ]),

  country('Peru', 'America', [
    // Spanish
    'Perú',
    // Arabic
    'بيرو',
    // Chinese
    '秘鲁',
    // German
    'Peru',
    // French
    'Pérou',
    // Russian
    'Перу',
    // Turkish
    'Peru',
    // Japanese
    'ペルー',
    // Korean
    '페루',
    // Hindi
    'पेरू',
  ]),

  country('Venezuela', 'America', [
    // Arabic
    'فنزويلا',
    // Chinese
    '委内瑞拉',
    // German
    'Venezuela',
    // French
    'Venezuela',
    // Spanish
    'Venezuela',
    // Russian
    'Венесуэла',
    // Turkish
    'Venezuela',
    // Japanese
    'ベネズエラ',
    // Korean
    '베네수엘라',
    // Hindi
    'वेनेज़ुएला',
  ]),

  country('Chile', 'America', [
    // Arabic
    'تشيلي',
    // Chinese
    '智利',
    // German
    'Chile',
    // French
    'Chili',
    // Spanish
    'Chile',
    // Russian
    'Чили',
    // Turkish
    'Şili',
    // Japanese
    'チリ',
    // Korean
    '칠레',
    // Hindi
    'चिली',
  ]),

  country('Ecuador', 'America', [
    // Arabic
    'الإكوادور',
    // Chinese
    '厄瓜多尔',
    // German
    'Ecuador',
    // French
    'Équateur',
    // Spanish
    'Ecuador',
    // Russian
    'Эквадор',
    // Turkish
    'Ekvador',
    // Japanese
    'エクアドル',
    // Korean
    '에콰도르',
    // Hindi
    'इक्वाडोर',
  ]),

  country('Bolivia', 'America', [
    // Arabic
    'بوليفيا',
    // Chinese
    '玻利维亚',
    // German
    'Bolivien',
    // French
    'Bolivie',
    // Spanish
    'Bolivia',
    // Russian
    'Боливия',
    // Turkish
    'Bolivya',
    // Japanese
    'ボリビア',
    // Korean
    '볼리비아',
    // Hindi
    'बोलीविया',
  ]),

  country('Paraguay', 'America', [
    // Arabic
    'باراغواي',
    // Chinese
    '巴拉圭',
    // German
    'Paraguay',
    // French
    'Paraguay',
    // Spanish
    'Paraguay',
    // Russian
    'Парагвай',
    // Turkish
    'Paraguay',
    // Japanese
    'パラグアイ',
    // Korean
    '파라과이',
    // Hindi
    'पैराग्वे',
  ]),

  country('Uruguay', 'America', [
    // Arabic
    'أوروغواي',
    // Chinese
    '乌拉圭',
    // German
    'Uruguay',
    // French
    'Uruguay',
    // Spanish
    'Uruguay',
    // Russian
    'Уругвай',
    // Turkish
    'Uruguay',
    // Japanese
    'ウルグアイ',
    // Korean
    '우루과이',
    // Hindi
    'उरुग्वे',
  ]),

  country('Cuba', 'America', [
    // Arabic
    'كوبا',
    // Chinese
    '古巴',
    // German
    'Kuba',
    // French
    'Cuba',
    // Spanish
    'Cuba',
    // Russian
    'Куба',
    // Turkish
    'Küba',
    // Japanese
    'キューバ',
    // Korean
    '쿠바',
    // Hindi
    'क्यूबा',
  ]),

  country('Dominican Republic', 'America', [
    // Spanish
    'República Dominicana',
    // Arabic
    'جمهورية الدومينيكان',
    // Chinese
    '多米尼加',
    // German
    'Dominikanische Republik',
    // French
    'République dominicaine',
    // Russian
    'Доминиканская Республика',
    // Turkish
    'Dominik Cumhuriyeti',
    // Japanese
    'ドミニカ共和国',
    // Korean
    '도미니카 공화국',
  ]),

  country('Haiti', 'America', [
    // French
    'Haïti',
    // Arabic
    'هايتي',
    // Chinese
    '海地',
    // German
    'Haiti',
    // Spanish
    'Haití',
    // Russian
    'Гаити',
    // Turkish
    'Haiti',
    // Japanese
    'ハイチ',
    // Korean
    '아이티',
  ]),

  country('Guatemala', 'America', [
    // Arabic
    'غواتيمالا',
    // Chinese
    '危地马拉',
    // German
    'Guatemala',
    // French
    'Guatemala',
    // Spanish
    'Guatemala',
    // Russian
    'Гватемала',
    // Turkish
    'Guatemala',
    // Japanese
    'グアテマラ',
    // Korean
    '과테말라',
  ]),

  country('Honduras', 'America', [
    // Arabic
    'هندوراس',
    // Chinese
    '洪都拉斯',
    // German
    'Honduras',
    // French
    'Honduras',
    // Spanish
    'Honduras',
    // Russian
    'Гондурас',
    // Turkish
    'Honduras',
    // Japanese
    'ホンジュラス',
    // Korean
    '온두라스',
  ]),

  country('Nicaragua', 'America', [
    // Arabic
    'نيكاراغوا',
    // Chinese
    '尼加拉瓜',
    // German
    'Nicaragua',
    // French
    'Nicaragua',
    // Spanish
    'Nicaragua',
    // Russian
    'Никарагуа',
    // Turkish
    'Nikaragua',
    // Japanese
    'ニカラグア',
    // Korean
    '니카라과',
  ]),

  country('El Salvador', 'America', [
    // Arabic
    'السلفادور',
    // Chinese
    '萨尔瓦多',
    // German
    'El Salvador',
    // French
    'Salvador',
    // Spanish
    'El Salvador',
    // Russian
    'Сальвадор',
    // Turkish
    'El Salvador',
    // Japanese
    'エルサルバドル',
    // Korean
    '엘살바도르',
  ]),

  country('Costa Rica', 'America', [
    // Arabic
    'كوستاريكا',
    // Chinese
    '哥斯达黎加',
    // German
    'Costa Rica',
    // French
    'Costa Rica',
    // Spanish
    'Costa Rica',
    // Russian
    'Коста-Рика',
    // Turkish
    'Kosta Rika',
    // Japanese
    'コスタリカ',
    // Korean
    '코스타리카',
  ]),

  country('Panama', 'America', [
    // Spanish
    'Panamá',
    // Arabic
    'بنما',
    // Chinese
    '巴拿马',
    // German
    'Panama',
    // French
    'Panama',
    // Russian
    'Панама',
    // Turkish
    'Panama',
    // Japanese
    'パナマ',
    // Korean
    '파나마',
  ]),

  country('Jamaica', 'America', [
    // Arabic
    'جامايكا',
    // Chinese
    '牙买加',
    // German
    'Jamaika',
    // French
    'Jamaïque',
    // Spanish
    'Jamaica',
    // Russian
    'Ямайка',
    // Turkish
    'Jamaika',
    // Japanese
    'ジャマイカ',
    // Korean
    '자메이카',
  ]),

  country('Trinidad and Tobago', 'America', [
    // Arabic
    'ترينيداد وتوباغو',
    // Chinese
    '特立尼达和多巴哥',
    // German
    'Trinidad und Tobago',
    // French
    'Trinité-et-Tobago',
    // Spanish
    'Trinidad y Tobago',
    // Russian
    'Тринидад и Тобаго',
    // Japanese
    'トリニダード・トバゴ',
    // Korean
    '트리니다드 토바고',
  ]),

  country('Bahamas', 'America', [
    'The Bahamas',
    // Arabic
    'جزر البهاما',
    // Chinese
    '巴哈马',
    // German
    'Bahamas',
    // French
    'Bahamas',
    // Spanish
    'Bahamas',
    // Russian
    'Багамы',
    // Japanese
    'バハマ',
    // Korean
    '바하마',
  ]),

  country('Barbados', 'America', [
    // Arabic
    'باربادوس',
    // Chinese
    '巴巴多斯',
    // German
    'Barbados',
    // French
    'Barbade',
    // Spanish
    'Barbados',
    // Russian
    'Барбадос',
    // Japanese
    'バルバドス',
    // Korean
    '바베이도스',
  ]),

  country('Belize', 'America', [
    // Arabic
    'بليز',
    // Chinese
    '伯利兹',
    // German
    'Belize',
    // French
    'Belize',
    // Spanish
    'Belice',
    // Russian
    'Белиз',
    // Japanese
    'ベリーズ',
    // Korean
    '벨리즈',
  ]),

  country('Guyana', 'America', [
    // Arabic
    'غيانا',
    // Chinese
    '圭亚那',
    // German
    'Guyana',
    // French
    'Guyana',
    // Spanish
    'Guyana',
    // Russian
    'Гайана',
    // Japanese
    'ガイアナ',
    // Korean
    '가이아나',
  ]),

  country('Suriname', 'America', [
    // Dutch
    'Suriname',
    // Arabic
    'سورينام',
    // Chinese
    '苏里南',
    // German
    'Surinam',
    // French
    'Suriname',
    // Spanish
    'Surinam',
    // Russian
    'Суринам',
    // Japanese
    'スリナム',
    // Korean
    '수리남',
  ]),

  // ============================================
  // AFRICA (أفريقيا / 非洲)
  // ============================================
  country('Nigeria', 'Africa', [
    // Arabic
    'نيجيريا',
    // Chinese
    '尼日利亚',
    // German
    'Nigeria',
    // French
    'Nigéria',
    // Spanish
    'Nigeria',
    // Russian
    'Нигерия',
    // Turkish
    'Nijerya',
    // Japanese
    'ナイジェリア',
    // Korean
    '나이지리아',
    // Hindi
    'नाइजीरिया',
  ]),

  country('South Africa', 'Africa', [
    // Arabic
    'جنوب أفريقيا',
    // Chinese
    '南非',
    // German
    'Südafrika',
    // French
    'Afrique du Sud',
    // Spanish
    'Sudáfrica',
    // Russian
    'Южная Африка',
    // Turkish
    'Güney Afrika',
    // Japanese
    '南アフリカ',
    // Korean
    '남아프리카',
    // Hindi
    'दक्षिण अफ्रीका',
    // Afrikaans
    'Suid-Afrika',
  ]),

  country('Kenya', 'Africa', [
    // Arabic
    'كينيا',
    // Swahili
    'Kenya',
    // Chinese
    '肯尼亚',
    // German
    'Kenia',
    // French
    'Kenya',
    // Spanish
    'Kenia',
    // Russian
    'Кения',
    // Turkish
    'Kenya',
    // Japanese
    'ケニア',
    // Korean
    '케냐',
    // Hindi
    'केन्या',
  ]),

  country('Ethiopia', 'Africa', [
    // Amharic
    'ኢትዮጵያ',
    // Arabic
    'إثيوبيا',
    // Chinese
    '埃塞俄比亚',
    // German
    'Äthiopien',
    // French
    'Éthiopie',
    // Spanish
    'Etiopía',
    // Russian
    'Эфиопия',
    // Turkish
    'Etiyopya',
    // Japanese
    'エチオピア',
    // Korean
    '에티오피아',
  ]),

  country('Ghana', 'Africa', [
    // Arabic
    'غانا',
    // Chinese
    '加纳',
    // German
    'Ghana',
    // French
    'Ghana',
    // Spanish
    'Ghana',
    // Russian
    'Гана',
    // Turkish
    'Gana',
    // Japanese
    'ガーナ',
    // Korean
    '가나',
    // Hindi
    'घाना',
  ]),

  country('Tanzania', 'Africa', [
    // Swahili
    'Tanzania',
    // Arabic
    'تنزانيا',
    // Chinese
    '坦桑尼亚',
    // German
    'Tansania',
    // French
    'Tanzanie',
    // Spanish
    'Tanzania',
    // Russian
    'Танзания',
    // Turkish
    'Tanzanya',
    // Japanese
    'タンザニア',
    // Korean
    '탄자니아',
  ]),

  country('Morocco', 'Africa', [
    // Arabic
    'المغرب',
    // French
    'Maroc',
    // Chinese
    '摩洛哥',
    // German
    'Marokko',
    // Spanish
    'Marruecos',
    // Russian
    'Марокко',
    // Turkish
    'Fas',
    // Japanese
    'モロッコ',
    // Korean
    '모로코',
    // Hindi
    'मोरक्को',
  ]),

  country('Algeria', 'Africa', [
    // Arabic
    'الجزائر',
    // French
    'Algérie',
    // Chinese
    '阿尔及利亚',
    // German
    'Algerien',
    // Spanish
    'Argelia',
    // Russian
    'Алжир',
    // Turkish
    'Cezayir',
    // Japanese
    'アルジェリア',
    // Korean
    '알제리',
    // Hindi
    'अल्जीरिया',
  ]),

  country('Tunisia', 'Africa', [
    // Arabic
    'تونس',
    // French
    'Tunisie',
    // Chinese
    '突尼斯',
    // German
    'Tunesien',
    // Spanish
    'Túnez',
    // Russian
    'Тунис',
    // Turkish
    'Tunus',
    // Japanese
    'チュニジア',
    // Korean
    '튀니지',
    // Hindi
    'ट्यूनीशिया',
  ]),

  country('Libya', 'Africa', [
    // Arabic
    'ليبيا',
    // Chinese
    '利比亚',
    // German
    'Libyen',
    // French
    'Libye',
    // Spanish
    'Libia',
    // Russian
    'Ливия',
    // Turkish
    'Libya',
    // Japanese
    'リビア',
    // Korean
    '리비아',
  ]),

  country('Sudan', 'Africa', [
    // Arabic
    'السودان',
    // Chinese
    '苏丹',
    // German
    'Sudan',
    // French
    'Soudan',
    // Spanish
    'Sudán',
    // Russian
    'Судан',
    // Turkish
    'Sudan',
    // Japanese
    'スーダン',
    // Korean
    '수단',
  ]),

  country('South Sudan', 'Africa', [
    // Arabic
    'جنوب السودان',
    // Chinese
    '南苏丹',
    // German
    'Südsudan',
    // French
    'Soudan du Sud',
    // Spanish
    'Sudán del Sur',
    // Russian
    'Южный Судан',
    // Turkish
    'Güney Sudan',
    // Japanese
    '南スーダン',
    // Korean
    '남수단',
  ]),

  country('Uganda', 'Africa', [
    // Arabic
    'أوغندا',
    // Chinese
    '乌干达',
    // German
    'Uganda',
    // French
    'Ouganda',
    // Spanish
    'Uganda',
    // Russian
    'Уганда',
    // Turkish
    'Uganda',
    // Japanese
    'ウガンダ',
    // Korean
    '우간다',
  ]),

  country('Rwanda', 'Africa', [
    // Arabic
    'رواندا',
    // Chinese
    '卢旺达',
    // German
    'Ruanda',
    // French
    'Rwanda',
    // Spanish
    'Ruanda',
    // Russian
    'Руанда',
    // Turkish
    'Ruanda',
    // Japanese
    'ルワンダ',
    // Korean
    '르완다',
  ]),

  country('Senegal', 'Africa', [
    // French
    'Sénégal',
    // Arabic
    'السنغال',
    // Chinese
    '塞内加尔',
    // German
    'Senegal',
    // Spanish
    'Senegal',
    // Russian
    'Сенегал',
    // Turkish
    'Senegal',
    // Japanese
    'セネガル',
    // Korean
    '세네갈',
  ]),

  country('Ivory Coast', 'Africa', [
    "Côte d'Ivoire",
    // French
    "Côte d'Ivoire",
    // Arabic
    'ساحل العاج',
    // Chinese
    '科特迪瓦',
    // German
    'Elfenbeinküste',
    // Spanish
    'Costa de Marfil',
    // Russian
    'Кот-д\'Ивуар',
    // Turkish
    'Fildişi Sahili',
    // Japanese
    'コートジボワール',
    // Korean
    '코트디부아르',
  ]),

  country('Cameroon', 'Africa', [
    // French
    'Cameroun',
    // Arabic
    'الكاميرون',
    // Chinese
    '喀麦隆',
    // German
    'Kamerun',
    // Spanish
    'Camerún',
    // Russian
    'Камерун',
    // Turkish
    'Kamerun',
    // Japanese
    'カメルーン',
    // Korean
    '카메룬',
  ]),

  country('Angola', 'Africa', [
    // Portuguese
    'Angola',
    // Arabic
    'أنغولا',
    // Chinese
    '安哥拉',
    // German
    'Angola',
    // French
    'Angola',
    // Spanish
    'Angola',
    // Russian
    'Ангола',
    // Turkish
    'Angola',
    // Japanese
    'アンゴラ',
    // Korean
    '앙골라',
  ]),

  country('Mozambique', 'Africa', [
    // Portuguese
    'Moçambique',
    // Arabic
    'موزمبيق',
    // Chinese
    '莫桑比克',
    // German
    'Mosambik',
    // French
    'Mozambique',
    // Spanish
    'Mozambique',
    // Russian
    'Мозамбик',
    // Turkish
    'Mozambik',
    // Japanese
    'モザンビーク',
    // Korean
    '모잠비크',
  ]),

  country('Zimbabwe', 'Africa', [
    // Arabic
    'زيمبابوي',
    // Chinese
    '津巴布韦',
    // German
    'Simbabwe',
    // French
    'Zimbabwe',
    // Spanish
    'Zimbabue',
    // Russian
    'Зимбабве',
    // Turkish
    'Zimbabve',
    // Japanese
    'ジンバブエ',
    // Korean
    '짐바브웨',
  ]),

  country('Zambia', 'Africa', [
    // Arabic
    'زامبيا',
    // Chinese
    '赞比亚',
    // German
    'Sambia',
    // French
    'Zambie',
    // Spanish
    'Zambia',
    // Russian
    'Замбия',
    // Turkish
    'Zambiya',
    // Japanese
    'ザンビア',
    // Korean
    '잠비아',
  ]),

  country('Botswana', 'Africa', [
    // Arabic
    'بوتسوانا',
    // Chinese
    '博茨瓦纳',
    // German
    'Botswana',
    // French
    'Botswana',
    // Spanish
    'Botsuana',
    // Russian
    'Ботсвана',
    // Turkish
    'Botsvana',
    // Japanese
    'ボツワナ',
    // Korean
    '보츠와나',
  ]),

  country('Namibia', 'Africa', [
    // Arabic
    'ناميبيا',
    // Chinese
    '纳米比亚',
    // German
    'Namibia',
    // French
    'Namibie',
    // Spanish
    'Namibia',
    // Russian
    'Намибия',
    // Turkish
    'Namibya',
    // Japanese
    'ナミビア',
    // Korean
    '나미비아',
  ]),

  country('Madagascar', 'Africa', [
    // Malagasy
    'Madagasikara',
    // Arabic
    'مدغشقر',
    // Chinese
    '马达加斯加',
    // German
    'Madagaskar',
    // French
    'Madagascar',
    // Spanish
    'Madagascar',
    // Russian
    'Мадагаскар',
    // Turkish
    'Madagaskar',
    // Japanese
    'マダガスカル',
    // Korean
    '마다가스카르',
  ]),

  country('Mauritius', 'Africa', [
    // Arabic
    'موريشيوس',
    // Chinese
    '毛里求斯',
    // German
    'Mauritius',
    // French
    'Maurice', 'Île Maurice',
    // Spanish
    'Mauricio',
    // Russian
    'Маврикий',
    // Turkish
    'Mauritius',
    // Japanese
    'モーリシャス',
    // Korean
    '모리셔스',
  ]),

  country('Democratic Republic of the Congo', 'Africa', [
    'DRC', 'DR Congo', 'Congo-Kinshasa',
    // French
    'République démocratique du Congo',
    // Arabic
    'جمهورية الكونغو الديمقراطية',
    // Chinese
    '刚果民主共和国',
    // German
    'Demokratische Republik Kongo',
    // Spanish
    'República Democrática del Congo',
    // Russian
    'Демократическая Республика Конго',
    // Japanese
    'コンゴ民主共和国',
    // Korean
    '콩고 민주 공화국',
  ]),

  country('Republic of the Congo', 'Africa', [
    'Congo', 'Congo-Brazzaville',
    // French
    'République du Congo',
    // Arabic
    'جمهورية الكونغو',
    // Chinese
    '刚果共和国',
    // German
    'Republik Kongo',
    // Spanish
    'República del Congo',
    // Russian
    'Республика Конго',
    // Japanese
    'コンゴ共和国',
    // Korean
    '콩고 공화국',
  ]),

  country('Mali', 'Africa', [
    // Arabic
    'مالي',
    // Chinese
    '马里',
    // German
    'Mali',
    // French
    'Mali',
    // Spanish
    'Malí',
    // Russian
    'Мали',
    // Turkish
    'Mali',
    // Japanese
    'マリ',
    // Korean
    '말리',
  ]),

  country('Burkina Faso', 'Africa', [
    // Arabic
    'بوركينا فاسو',
    // Chinese
    '布基纳法索',
    // German
    'Burkina Faso',
    // French
    'Burkina Faso',
    // Spanish
    'Burkina Faso',
    // Russian
    'Буркина-Фасо',
    // Turkish
    'Burkina Faso',
    // Japanese
    'ブルキナファソ',
    // Korean
    '부르키나파소',
  ]),

  country('Niger', 'Africa', [
    // Arabic
    'النيجر',
    // Chinese
    '尼日尔',
    // German
    'Niger',
    // French
    'Niger',
    // Spanish
    'Níger',
    // Russian
    'Нигер',
    // Turkish
    'Nijer',
    // Japanese
    'ニジェール',
    // Korean
    '니제르',
  ]),

  country('Chad', 'Africa', [
    // French
    'Tchad',
    // Arabic
    'تشاد',
    // Chinese
    '乍得',
    // German
    'Tschad',
    // Spanish
    'Chad',
    // Russian
    'Чад',
    // Turkish
    'Çad',
    // Japanese
    'チャド',
    // Korean
    '차드',
  ]),

  country('Somalia', 'Africa', [
    // Somali
    'Soomaaliya',
    // Arabic
    'الصومال',
    // Chinese
    '索马里',
    // German
    'Somalia',
    // French
    'Somalie',
    // Spanish
    'Somalia',
    // Russian
    'Сомали',
    // Turkish
    'Somali',
    // Japanese
    'ソマリア',
    // Korean
    '소말리아',
  ]),

  country('Eritrea', 'Africa', [
    // Tigrinya
    'ኤርትራ',
    // Arabic
    'إريتريا',
    // Chinese
    '厄立特里亚',
    // German
    'Eritrea',
    // French
    'Érythrée',
    // Spanish
    'Eritrea',
    // Russian
    'Эритрея',
    // Turkish
    'Eritre',
    // Japanese
    'エリトリア',
    // Korean
    '에리트레아',
  ]),

  country('Djibouti', 'Africa', [
    // French
    'Djibouti',
    // Arabic
    'جيبوتي',
    // Chinese
    '吉布提',
    // German
    'Dschibuti',
    // Spanish
    'Yibuti',
    // Russian
    'Джибути',
    // Turkish
    'Cibuti',
    // Japanese
    'ジブチ',
    // Korean
    '지부티',
  ]),

  country('Malawi', 'Africa', [
    // Arabic
    'مالاوي',
    // Chinese
    '马拉维',
    // German
    'Malawi',
    // French
    'Malawi',
    // Spanish
    'Malaui',
    // Russian
    'Малави',
    // Turkish
    'Malavi',
    // Japanese
    'マラウイ',
    // Korean
    '말라위',
  ]),

  country('Benin', 'Africa', [
    // French
    'Bénin',
    // Arabic
    'بنين',
    // Chinese
    '贝宁',
    // German
    'Benin',
    // Spanish
    'Benín',
    // Russian
    'Бенин',
    // Turkish
    'Benin',
    // Japanese
    'ベナン',
    // Korean
    '베냉',
  ]),

  country('Togo', 'Africa', [
    // Arabic
    'توغو',
    // Chinese
    '多哥',
    // German
    'Togo',
    // French
    'Togo',
    // Spanish
    'Togo',
    // Russian
    'Того',
    // Turkish
    'Togo',
    // Japanese
    'トーゴ',
    // Korean
    '토고',
  ]),

  country('Sierra Leone', 'Africa', [
    // Arabic
    'سيراليون',
    // Chinese
    '塞拉利昂',
    // German
    'Sierra Leone',
    // French
    'Sierra Leone',
    // Spanish
    'Sierra Leona',
    // Russian
    'Сьерра-Леоне',
    // Turkish
    'Sierra Leone',
    // Japanese
    'シエラレオネ',
    // Korean
    '시에라리온',
  ]),

  country('Liberia', 'Africa', [
    // Arabic
    'ليبيريا',
    // Chinese
    '利比里亚',
    // German
    'Liberia',
    // French
    'Libéria',
    // Spanish
    'Liberia',
    // Russian
    'Либерия',
    // Turkish
    'Liberya',
    // Japanese
    'リベリア',
    // Korean
    '라이베리아',
  ]),

  country('Guinea', 'Africa', [
    // French
    'Guinée',
    // Arabic
    'غينيا',
    // Chinese
    '几内亚',
    // German
    'Guinea',
    // Spanish
    'Guinea',
    // Russian
    'Гвинея',
    // Turkish
    'Gine',
    // Japanese
    'ギニア',
    // Korean
    '기니',
  ]),

  country('Guinea-Bissau', 'Africa', [
    // Portuguese
    'Guiné-Bissau',
    // Arabic
    'غينيا بيساو',
    // Chinese
    '几内亚比绍',
    // German
    'Guinea-Bissau',
    // French
    'Guinée-Bissau',
    // Spanish
    'Guinea-Bisáu',
    // Russian
    'Гвинея-Бисау',
    // Japanese
    'ギニアビサウ',
    // Korean
    '기니비사우',
  ]),

  country('Equatorial Guinea', 'Africa', [
    // Spanish
    'Guinea Ecuatorial',
    // Arabic
    'غينيا الاستوائية',
    // Chinese
    '赤道几内亚',
    // German
    'Äquatorialguinea',
    // French
    'Guinée équatoriale',
    // Russian
    'Экваториальная Гвинея',
    // Japanese
    '赤道ギニア',
    // Korean
    '적도 기니',
  ]),

  country('Gabon', 'Africa', [
    // Arabic
    'الغابون',
    // Chinese
    '加蓬',
    // German
    'Gabun',
    // French
    'Gabon',
    // Spanish
    'Gabón',
    // Russian
    'Габон',
    // Turkish
    'Gabon',
    // Japanese
    'ガボン',
    // Korean
    '가봉',
  ]),

  country('Central African Republic', 'Africa', [
    'CAR',
    // French
    'République centrafricaine',
    // Arabic
    'جمهورية أفريقيا الوسطى',
    // Chinese
    '中非共和国',
    // German
    'Zentralafrikanische Republik',
    // Spanish
    'República Centroafricana',
    // Russian
    'Центральноафриканская Республика',
    // Japanese
    '中央アフリカ共和国',
    // Korean
    '중앙아프리카 공화국',
  ]),

  country('Burundi', 'Africa', [
    // Arabic
    'بوروندي',
    // Chinese
    '布隆迪',
    // German
    'Burundi',
    // French
    'Burundi',
    // Spanish
    'Burundi',
    // Russian
    'Бурунди',
    // Turkish
    'Burundi',
    // Japanese
    'ブルンジ',
    // Korean
    '부룬디',
  ]),

  country('Mauritania', 'Africa', [
    // Arabic
    'موريتانيا',
    // Chinese
    '毛里塔尼亚',
    // German
    'Mauretanien',
    // French
    'Mauritanie',
    // Spanish
    'Mauritania',
    // Russian
    'Мавритания',
    // Turkish
    'Moritanya',
    // Japanese
    'モーリタニア',
    // Korean
    '모리타니',
  ]),

  country('Gambia', 'Africa', [
    'The Gambia',
    // Arabic
    'غامبيا',
    // Chinese
    '冈比亚',
    // German
    'Gambia',
    // French
    'Gambie',
    // Spanish
    'Gambia',
    // Russian
    'Гамбия',
    // Turkish
    'Gambiya',
    // Japanese
    'ガンビア',
    // Korean
    '감비아',
  ]),

  country('Cape Verde', 'Africa', [
    'Cabo Verde',
    // Portuguese
    'Cabo Verde',
    // Arabic
    'الرأس الأخضر',
    // Chinese
    '佛得角',
    // German
    'Kap Verde',
    // French
    'Cap-Vert',
    // Spanish
    'Cabo Verde',
    // Russian
    'Кабо-Верде',
    // Japanese
    'カーボベルデ',
    // Korean
    '카보베르데',
  ]),

  country('Sao Tome and Principe', 'Africa', [
    // Portuguese
    'São Tomé e Príncipe',
    // Arabic
    'ساو تومي وبرينسيبي',
    // Chinese
    '圣多美和普林西比',
    // German
    'São Tomé und Príncipe',
    // French
    'Sao Tomé-et-Príncipe',
    // Spanish
    'Santo Tomé y Príncipe',
    // Russian
    'Сан-Томе и Принсипи',
    // Japanese
    'サントメ・プリンシペ',
    // Korean
    '상투메 프린시페',
  ]),

  country('Seychelles', 'Africa', [
    // French
    'Seychelles',
    // Arabic
    'سيشل',
    // Chinese
    '塞舌尔',
    // German
    'Seychellen',
    // Spanish
    'Seychelles',
    // Russian
    'Сейшельские Острова',
    // Japanese
    'セーシェル',
    // Korean
    '세이셸',
  ]),

  country('Comoros', 'Africa', [
    // French
    'Comores',
    // Arabic
    'جزر القمر',
    // Chinese
    '科摩罗',
    // German
    'Komoren',
    // Spanish
    'Comoras',
    // Russian
    'Коморские Острова',
    // Japanese
    'コモロ',
    // Korean
    '코모로',
  ]),

  country('Lesotho', 'Africa', [
    // Arabic
    'ليسوتو',
    // Chinese
    '莱索托',
    // German
    'Lesotho',
    // French
    'Lesotho',
    // Spanish
    'Lesoto',
    // Russian
    'Лесото',
    // Japanese
    'レソト',
    // Korean
    '레소토',
  ]),

  country('Eswatini', 'Africa', [
    'Swaziland',
    // Arabic
    'إسواتيني',
    // Chinese
    '斯威士兰',
    // German
    'Eswatini',
    // French
    'Eswatini',
    // Spanish
    'Suazilandia',
    // Russian
    'Эсватини',
    // Japanese
    'エスワティニ',
    // Korean
    '에스와티니',
  ]),

  // ============================================
  // OCEANIA (أوقيانوسيا / 大洋洲)
  // ============================================
  country('Australia', 'Oceania', [
    // Arabic
    'أستراليا',
    // Chinese
    '澳大利亚', '澳洲',
    // German
    'Australien',
    // French
    'Australie',
    // Spanish
    'Australia',
    // Russian
    'Австралия',
    // Turkish
    'Avustralya',
    // Japanese
    'オーストラリア',
    // Korean
    '호주',
    // Hindi
    'ऑस्ट्रेलिया',
  ]),

  country('New Zealand', 'Oceania', [
    'Aotearoa',
    // Arabic
    'نيوزيلندا',
    // Chinese
    '新西兰',
    // German
    'Neuseeland',
    // French
    'Nouvelle-Zélande',
    // Spanish
    'Nueva Zelanda',
    // Russian
    'Новая Зеландия',
    // Turkish
    'Yeni Zelanda',
    // Japanese
    'ニュージーランド',
    // Korean
    '뉴질랜드',
    // Hindi
    'न्यूज़ीलैंड',
  ]),

  country('Papua New Guinea', 'Oceania', [
    // Arabic
    'بابوا غينيا الجديدة',
    // Chinese
    '巴布亚新几内亚',
    // German
    'Papua-Neuguinea',
    // French
    'Papouasie-Nouvelle-Guinée',
    // Spanish
    'Papúa Nueva Guinea',
    // Russian
    'Папуа — Новая Гвинея',
    // Japanese
    'パプアニューギニア',
    // Korean
    '파푸아뉴기니',
  ]),

  country('Fiji', 'Oceania', [
    // Arabic
    'فيجي',
    // Chinese
    '斐济',
    // German
    'Fidschi',
    // French
    'Fidji',
    // Spanish
    'Fiyi',
    // Russian
    'Фиджи',
    // Turkish
    'Fiji',
    // Japanese
    'フィジー',
    // Korean
    '피지',
  ]),

  country('Samoa', 'Oceania', [
    // Arabic
    'ساموا',
    // Chinese
    '萨摩亚',
    // German
    'Samoa',
    // French
    'Samoa',
    // Spanish
    'Samoa',
    // Russian
    'Самоа',
    // Japanese
    'サモア',
    // Korean
    '사모아',
  ]),

  country('Tonga', 'Oceania', [
    // Arabic
    'تونغا',
    // Chinese
    '汤加',
    // German
    'Tonga',
    // French
    'Tonga',
    // Spanish
    'Tonga',
    // Russian
    'Тонга',
    // Japanese
    'トンガ',
    // Korean
    '통가',
  ]),

  country('Vanuatu', 'Oceania', [
    // Arabic
    'فانواتو',
    // Chinese
    '瓦努阿图',
    // German
    'Vanuatu',
    // French
    'Vanuatu',
    // Spanish
    'Vanuatu',
    // Russian
    'Вануату',
    // Japanese
    'バヌアツ',
    // Korean
    '바누아투',
  ]),

  country('Solomon Islands', 'Oceania', [
    // Arabic
    'جزر سليمان',
    // Chinese
    '所罗门群岛',
    // German
    'Salomonen',
    // French
    'Îles Salomon',
    // Spanish
    'Islas Salomón',
    // Russian
    'Соломоновы Острова',
    // Japanese
    'ソロモン諸島',
    // Korean
    '솔로몬 제도',
  ]),

  country('Kiribati', 'Oceania', [
    // Arabic
    'كيريباتي',
    // Chinese
    '基里巴斯',
    // German
    'Kiribati',
    // French
    'Kiribati',
    // Spanish
    'Kiribati',
    // Russian
    'Кирибати',
    // Japanese
    'キリバス',
    // Korean
    '키리바시',
  ]),

  country('Micronesia', 'Oceania', [
    'Federated States of Micronesia', 'FSM',
    // Arabic
    'ميكرونيزيا',
    // Chinese
    '密克罗尼西亚',
    // German
    'Mikronesien',
    // French
    'Micronésie',
    // Spanish
    'Micronesia',
    // Russian
    'Микронезия',
    // Japanese
    'ミクロネシア',
    // Korean
    '미크로네시아',
  ]),

  country('Palau', 'Oceania', [
    // Arabic
    'بالاو',
    // Chinese
    '帕劳',
    // German
    'Palau',
    // French
    'Palaos',
    // Spanish
    'Palaos',
    // Russian
    'Палау',
    // Japanese
    'パラオ',
    // Korean
    '팔라우',
  ]),

  country('Marshall Islands', 'Oceania', [
    // Arabic
    'جزر مارشال',
    // Chinese
    '马绍尔群岛',
    // German
    'Marshallinseln',
    // French
    'Îles Marshall',
    // Spanish
    'Islas Marshall',
    // Russian
    'Маршалловы Острова',
    // Japanese
    'マーシャル諸島',
    // Korean
    '마셜 제도',
  ]),

  country('Nauru', 'Oceania', [
    // Arabic
    'ناورو',
    // Chinese
    '瑙鲁',
    // German
    'Nauru',
    // French
    'Nauru',
    // Spanish
    'Nauru',
    // Russian
    'Науру',
    // Japanese
    'ナウル',
    // Korean
    '나우루',
  ]),

  country('Tuvalu', 'Oceania', [
    // Arabic
    'توفالو',
    // Chinese
    '图瓦卢',
    // German
    'Tuvalu',
    // French
    'Tuvalu',
    // Spanish
    'Tuvalu',
    // Russian
    'Тувалу',
    // Japanese
    'ツバル',
    // Korean
    '투발루',
  ]),

  country('French Polynesia', 'Oceania', [
    // French
    'Polynésie française',
    // Arabic
    'بولينزيا الفرنسية',
    // Chinese
    '法属波利尼西亚',
    // German
    'Französisch-Polynesien',
    // Spanish
    'Polinesia Francesa',
    // Russian
    'Французская Полинезия',
    // Japanese
    'フランス領ポリネシア',
    // Korean
    '프랑스령 폴리네시아',
  ]),

  country('New Caledonia', 'Oceania', [
    // French
    'Nouvelle-Calédonie',
    // Arabic
    'كاليدونيا الجديدة',
    // Chinese
    '新喀里多尼亚',
    // German
    'Neukaledonien',
    // Spanish
    'Nueva Caledonia',
    // Russian
    'Новая Каледония',
    // Japanese
    'ニューカレドニア',
    // Korean
    '누벨칼레도니',
  ]),

  country('Cook Islands', 'Oceania', [
    // Arabic
    'جزر كوك',
    // Chinese
    '库克群岛',
    // German
    'Cookinseln',
    // French
    'Îles Cook',
    // Spanish
    'Islas Cook',
    // Russian
    'Острова Кука',
    // Japanese
    'クック諸島',
    // Korean
    '쿡 제도',
  ]),
];

// Build lookup maps for efficient access
export const COUNTRY_BY_ALIAS: Map<string, CountryData> = new Map();
export const COUNTRY_BY_CANONICAL: Map<string, CountryData> = new Map();

// Initialize lookup maps
for (const country of COUNTRIES) {
  COUNTRY_BY_CANONICAL.set(country.canonical.toLowerCase(), country);
  for (const alias of country.aliases) {
    COUNTRY_BY_ALIAS.set(alias.toLowerCase(), country);
  }
}

/**
 * Look up a country by any of its names (case-insensitive)
 */
export function findCountry(name: string): CountryData | undefined {
  return COUNTRY_BY_ALIAS.get(name.toLowerCase());
}
