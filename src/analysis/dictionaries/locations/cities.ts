/**
 * Comprehensive Multilingual City Dictionary
 * Includes city names in multiple languages for major cities worldwide
 */

import { CityData } from './types';

// Helper function to create city data
const city = (canonical: string, country: string, aliases: string[]): CityData => ({
  canonical,
  country,
  aliases: [canonical, ...aliases],
});

export const CITIES: CityData[] = [
  // ============================================
  // MIDDLE EAST CITIES
  // ============================================

  // UAE Cities
  city('Dubai', 'United Arab Emirates', [
    // Arabic
    'دبي', 'دبى',
    // Persian
    'دبی',
    // Chinese
    '迪拜',
    // Japanese
    'ドバイ',
    // Korean
    '두바이',
    // Russian
    'Дубай',
    // German
    'Dubai',
    // French
    'Dubaï',
    // Hindi
    'दुबई',
  ]),

  city('Abu Dhabi', 'United Arab Emirates', [
    // Arabic
    'أبو ظبي', 'أبوظبي', 'ابو ظبي', 'ابوظبي',
    // Persian
    'ابوظبی',
    // Chinese
    '阿布扎比',
    // Japanese
    'アブダビ',
    // Korean
    '아부다비',
    // Russian
    'Абу-Даби',
    // French
    'Abou Dabi', 'Abou Dhabi',
    // Hindi
    'अबू धाबी',
  ]),

  city('Sharjah', 'United Arab Emirates', [
    // Arabic
    'الشارقة',
    // Persian
    'شارجه',
    // Chinese
    '沙迦',
    // Russian
    'Шарджа',
  ]),

  city('Ajman', 'United Arab Emirates', [
    // Arabic
    'عجمان',
    // Chinese
    '阿治曼',
  ]),

  city('Ras Al Khaimah', 'United Arab Emirates', [
    'RAK',
    // Arabic
    'رأس الخيمة',
    // Chinese
    '拉斯海马',
  ]),

  city('Fujairah', 'United Arab Emirates', [
    // Arabic
    'الفجيرة',
  ]),

  city('Al Ain', 'United Arab Emirates', [
    // Arabic
    'العين',
  ]),

  // Saudi Arabia Cities
  city('Riyadh', 'Saudi Arabia', [
    // Arabic
    'الرياض',
    // Persian
    'ریاض',
    // Chinese
    '利雅得',
    // Japanese
    'リヤド',
    // Korean
    '리야드',
    // Russian
    'Эр-Рияд',
    // French
    'Riyad',
    // Hindi
    'रियाद',
  ]),

  city('Jeddah', 'Saudi Arabia', [
    'Jiddah',
    // Arabic
    'جدة',
    // Persian
    'جده',
    // Chinese
    '吉达',
    // Japanese
    'ジッダ',
    // Russian
    'Джидда',
    // Hindi
    'जेद्दा',
  ]),

  city('Mecca', 'Saudi Arabia', [
    'Makkah',
    // Arabic
    'مكة', 'مكة المكرمة',
    // Persian
    'مکه',
    // Chinese
    '麦加',
    // Japanese
    'メッカ',
    // Korean
    '메카',
    // Russian
    'Мекка',
    // French
    'La Mecque',
    // Hindi
    'मक्का',
  ]),

  city('Medina', 'Saudi Arabia', [
    'Madinah', 'Al Madinah',
    // Arabic
    'المدينة المنورة', 'المدينة',
    // Persian
    'مدینه',
    // Chinese
    '麦地那',
    // Japanese
    'メディナ',
    // Russian
    'Медина',
    // French
    'Médine',
    // Hindi
    'मदीना',
  ]),

  city('Dammam', 'Saudi Arabia', [
    // Arabic
    'الدمام',
    // Chinese
    '达曼',
  ]),

  city('Khobar', 'Saudi Arabia', [
    'Al Khobar',
    // Arabic
    'الخبر',
  ]),

  city('Dhahran', 'Saudi Arabia', [
    // Arabic
    'الظهران',
  ]),

  // Qatar Cities
  city('Doha', 'Qatar', [
    // Arabic
    'الدوحة',
    // Persian
    'دوحه',
    // Chinese
    '多哈',
    // Japanese
    'ドーハ',
    // Korean
    '도하',
    // Russian
    'Доха',
    // Hindi
    'दोहा',
  ]),

  // Kuwait Cities
  city('Kuwait City', 'Kuwait', [
    'Kuwait',
    // Arabic
    'مدينة الكويت', 'الكويت',
    // Chinese
    '科威特城',
    // Japanese
    'クウェート市',
    // Russian
    'Эль-Кувейт',
    // Hindi
    'कुवैत शहर',
  ]),

  // Bahrain Cities
  city('Manama', 'Bahrain', [
    // Arabic
    'المنامة',
    // Chinese
    '麦纳麦',
    // Japanese
    'マナーマ',
    // Russian
    'Манама',
    // Hindi
    'मनामा',
  ]),

  // Oman Cities
  city('Muscat', 'Oman', [
    // Arabic
    'مسقط',
    // Chinese
    '马斯喀特',
    // Japanese
    'マスカット',
    // Russian
    'Маскат',
    // Hindi
    'मस्कट',
  ]),

  // Iran Cities
  city('Tehran', 'Iran', [
    'Teheran',
    // Persian
    'تهران',
    // Arabic
    'طهران',
    // Chinese
    '德黑兰',
    // Japanese
    'テヘラン',
    // Korean
    '테헤란',
    // Russian
    'Тегеран',
    // French
    'Téhéran',
    // Hindi
    'तेहरान',
  ]),

  city('Isfahan', 'Iran', [
    'Esfahan',
    // Persian
    'اصفهان',
    // Arabic
    'أصفهان',
    // Chinese
    '伊斯法罕',
    // Russian
    'Исфахан',
  ]),

  city('Shiraz', 'Iran', [
    // Persian
    'شیراز',
    // Arabic
    'شيراز',
    // Chinese
    '设拉子',
    // Russian
    'Шираз',
  ]),

  city('Tabriz', 'Iran', [
    // Persian
    'تبریز',
    // Arabic
    'تبريز',
    // Chinese
    '大不里士',
    // Russian
    'Тебриз',
  ]),

  city('Mashhad', 'Iran', [
    // Persian
    'مشهد',
    // Arabic
    'مشهد',
    // Chinese
    '马什哈德',
    // Russian
    'Мешхед',
  ]),

  // Iraq Cities
  city('Baghdad', 'Iraq', [
    // Arabic
    'بغداد',
    // Persian
    'بغداد',
    // Chinese
    '巴格达',
    // Japanese
    'バグダッド',
    // Russian
    'Багдад',
    // Hindi
    'बगदाद',
  ]),

  city('Basra', 'Iraq', [
    // Arabic
    'البصرة',
    // Chinese
    '巴士拉',
    // Russian
    'Басра',
  ]),

  city('Erbil', 'Iraq', [
    'Irbil', 'Arbil',
    // Arabic
    'أربيل',
    // Kurdish
    'هەولێر',
    // Chinese
    '埃尔比勒',
    // Russian
    'Эрбиль',
  ]),

  // Israel Cities
  city('Tel Aviv', 'Israel', [
    'Tel-Aviv', 'Tel Aviv-Yafo',
    // Hebrew
    'תל אביב', 'תל אביב-יפו',
    // Arabic
    'تل أبيب',
    // Chinese
    '特拉维夫',
    // Japanese
    'テルアビブ',
    // Russian
    'Тель-Авив',
    // Hindi
    'तेल अवीव',
  ]),

  city('Jerusalem', 'Israel', [
    // Hebrew
    'ירושלים',
    // Arabic
    'القدس',
    // Chinese
    '耶路撒冷',
    // Japanese
    'エルサレム',
    // Russian
    'Иерусалим',
    // French
    'Jérusalem',
    // Hindi
    'यरूशलेम',
  ]),

  city('Haifa', 'Israel', [
    // Hebrew
    'חיפה',
    // Arabic
    'حيفا',
    // Chinese
    '海法',
    // Russian
    'Хайфа',
  ]),

  // Jordan Cities
  city('Amman', 'Jordan', [
    // Arabic
    'عمان',
    // Chinese
    '安曼',
    // Japanese
    'アンマン',
    // Russian
    'Амман',
    // Hindi
    'अम्मान',
  ]),

  // Lebanon Cities
  city('Beirut', 'Lebanon', [
    // Arabic
    'بيروت',
    // French
    'Beyrouth',
    // Chinese
    '贝鲁特',
    // Japanese
    'ベイルート',
    // Russian
    'Бейрут',
    // Hindi
    'बेरूत',
  ]),

  // Syria Cities
  city('Damascus', 'Syria', [
    // Arabic
    'دمشق',
    // Chinese
    '大马士革',
    // Japanese
    'ダマスカス',
    // Russian
    'Дамаск',
    // French
    'Damas',
    // Hindi
    'दमिश्क',
  ]),

  city('Aleppo', 'Syria', [
    // Arabic
    'حلب',
    // Chinese
    '阿勒颇',
    // Russian
    'Алеппо',
    // French
    'Alep',
  ]),

  // Turkey Cities
  city('Istanbul', 'Turkey', [
    'Constantinople',
    // Turkish
    'İstanbul',
    // Arabic
    'إسطنبول', 'اسطنبول',
    // Persian
    'استانبول',
    // Chinese
    '伊斯坦布尔',
    // Japanese
    'イスタンブール',
    // Korean
    '이스탄불',
    // Russian
    'Стамбул',
    // Greek
    'Κωνσταντινούπολη',
    // Hindi
    'इस्तांबुल',
  ]),

  city('Ankara', 'Turkey', [
    // Turkish
    'Ankara',
    // Arabic
    'أنقرة',
    // Chinese
    '安卡拉',
    // Japanese
    'アンカラ',
    // Russian
    'Анкара',
    // Hindi
    'अंकारा',
  ]),

  city('Izmir', 'Turkey', [
    'Smyrna',
    // Turkish
    'İzmir',
    // Arabic
    'إزمير',
    // Chinese
    '伊兹密尔',
    // Russian
    'Измир',
  ]),

  city('Antalya', 'Turkey', [
    // Arabic
    'أنطاليا',
    // Chinese
    '安塔利亚',
    // Russian
    'Анталья',
  ]),

  city('Bursa', 'Turkey', [
    // Arabic
    'بورصة',
    // Chinese
    '布尔萨',
    // Russian
    'Бурса',
  ]),

  // Egypt Cities
  city('Cairo', 'Egypt', [
    // Arabic
    'القاهرة',
    // Chinese
    '开罗',
    // Japanese
    'カイロ',
    // Korean
    '카이로',
    // Russian
    'Каир',
    // French
    'Le Caire',
    // Spanish
    'El Cairo',
    // Hindi
    'काहिरा',
  ]),

  city('Alexandria', 'Egypt', [
    // Arabic
    'الإسكندرية',
    // Chinese
    '亚历山大',
    // Japanese
    'アレクサンドリア',
    // Russian
    'Александрия',
    // French
    'Alexandrie',
    // Hindi
    'सिकंदरिया',
  ]),

  city('Giza', 'Egypt', [
    // Arabic
    'الجيزة',
    // Chinese
    '吉萨',
    // Russian
    'Гиза',
  ]),

  city('Luxor', 'Egypt', [
    // Arabic
    'الأقصر',
    // Chinese
    '卢克索',
    // Russian
    'Луксор',
  ]),

  city('Aswan', 'Egypt', [
    // Arabic
    'أسوان',
    // Chinese
    '阿斯旺',
    // Russian
    'Асуан',
  ]),

  // ============================================
  // EUROPEAN CITIES
  // ============================================

  // UK Cities
  city('London', 'United Kingdom', [
    // Arabic
    'لندن',
    // Persian
    'لندن',
    // Chinese
    '伦敦',
    // Japanese
    'ロンドン',
    // Korean
    '런던',
    // Russian
    'Лондон',
    // German
    'London',
    // French
    'Londres',
    // Spanish
    'Londres',
    // Hindi
    'लंदन',
  ]),

  city('Manchester', 'United Kingdom', [
    // Arabic
    'مانشستر',
    // Chinese
    '曼彻斯特',
    // Japanese
    'マンチェスター',
    // Russian
    'Манчестер',
    // Hindi
    'मैनचेस्टर',
  ]),

  city('Birmingham', 'United Kingdom', [
    // Arabic
    'برمنغهام',
    // Chinese
    '伯明翰',
    // Japanese
    'バーミンガム',
    // Russian
    'Бирмингем',
  ]),

  city('Liverpool', 'United Kingdom', [
    // Arabic
    'ليفربول',
    // Chinese
    '利物浦',
    // Japanese
    'リヴァプール',
    // Russian
    'Ливерпуль',
  ]),

  city('Edinburgh', 'United Kingdom', [
    // Arabic
    'إدنبرة',
    // Chinese
    '爱丁堡',
    // Japanese
    'エディンバラ',
    // Russian
    'Эдинбург',
    // French
    'Édimbourg',
  ]),

  city('Glasgow', 'United Kingdom', [
    // Arabic
    'غلاسكو',
    // Chinese
    '格拉斯哥',
    // Russian
    'Глазго',
  ]),

  city('Leeds', 'United Kingdom', [
    // Chinese
    '利兹',
    // Russian
    'Лидс',
  ]),

  city('Bristol', 'United Kingdom', [
    // Chinese
    '布里斯托尔',
    // Russian
    'Бристоль',
  ]),

  city('Cambridge', 'United Kingdom', [
    // Arabic
    'كامبريدج',
    // Chinese
    '剑桥',
    // Japanese
    'ケンブリッジ',
    // Russian
    'Кембридж',
  ]),

  city('Oxford', 'United Kingdom', [
    // Arabic
    'أكسفورد',
    // Chinese
    '牛津',
    // Japanese
    'オックスフォード',
    // Russian
    'Оксфорд',
  ]),

  // Germany Cities
  city('Berlin', 'Germany', [
    // Arabic
    'برلين',
    // Persian
    'برلین',
    // Chinese
    '柏林',
    // Japanese
    'ベルリン',
    // Korean
    '베를린',
    // Russian
    'Берлин',
    // Hindi
    'बर्लिन',
  ]),

  city('Munich', 'Germany', [
    // German
    'München',
    // Arabic
    'ميونخ', 'ميونيخ',
    // Chinese
    '慕尼黑',
    // Japanese
    'ミュンヘン',
    // Russian
    'Мюнхен',
    // French
    'Munich',
    // Italian
    'Monaco di Baviera',
    // Hindi
    'म्यूनिख',
  ]),

  city('Frankfurt', 'Germany', [
    'Frankfurt am Main',
    // Arabic
    'فرانكفورت',
    // Chinese
    '法兰克福',
    // Japanese
    'フランクフルト',
    // Russian
    'Франкфурт',
    // Hindi
    'फ्रैंकफर्ट',
  ]),

  city('Hamburg', 'Germany', [
    // Arabic
    'هامبورغ',
    // Chinese
    '汉堡',
    // Japanese
    'ハンブルク',
    // Russian
    'Гамбург',
    // French
    'Hambourg',
  ]),

  city('Cologne', 'Germany', [
    // German
    'Köln',
    // Arabic
    'كولونيا',
    // Chinese
    '科隆',
    // Japanese
    'ケルン',
    // Russian
    'Кёльн',
    // French
    'Cologne',
  ]),

  city('Düsseldorf', 'Germany', [
    'Dusseldorf',
    // Arabic
    'دوسلدورف',
    // Chinese
    '杜塞尔多夫',
    // Japanese
    'デュッセルドルフ',
    // Russian
    'Дюссельдорф',
  ]),

  city('Stuttgart', 'Germany', [
    // Arabic
    'شتوتغارت',
    // Chinese
    '斯图加特',
    // Russian
    'Штутгарт',
  ]),

  // France Cities
  city('Paris', 'France', [
    // Arabic
    'باريس',
    // Persian
    'پاریس',
    // Chinese
    '巴黎',
    // Japanese
    'パリ',
    // Korean
    '파리',
    // Russian
    'Париж',
    // Hindi
    'पेरिस',
  ]),

  city('Lyon', 'France', [
    'Lyons',
    // Arabic
    'ليون',
    // Chinese
    '里昂',
    // Japanese
    'リヨン',
    // Russian
    'Лион',
  ]),

  city('Marseille', 'France', [
    // Arabic
    'مرسيليا',
    // Chinese
    '马赛',
    // Japanese
    'マルセイユ',
    // Russian
    'Марсель',
    // English alternate
    'Marseilles',
  ]),

  city('Nice', 'France', [
    // Arabic
    'نيس',
    // Chinese
    '尼斯',
    // Japanese
    'ニース',
    // Russian
    'Ницца',
    // Italian
    'Nizza',
  ]),

  city('Toulouse', 'France', [
    // Arabic
    'تولوز',
    // Chinese
    '图卢兹',
    // Russian
    'Тулуза',
  ]),

  city('Bordeaux', 'France', [
    // Arabic
    'بوردو',
    // Chinese
    '波尔多',
    // Russian
    'Бордо',
  ]),

  city('Strasbourg', 'France', [
    // German
    'Straßburg',
    // Arabic
    'ستراسبورغ',
    // Chinese
    '斯特拉斯堡',
    // Russian
    'Страсбург',
  ]),

  // Italy Cities
  city('Rome', 'Italy', [
    // Italian
    'Roma',
    // Arabic
    'روما',
    // Chinese
    '罗马',
    // Japanese
    'ローマ',
    // Korean
    '로마',
    // Russian
    'Рим',
    // Hindi
    'रोम',
  ]),

  city('Milan', 'Italy', [
    // Italian
    'Milano',
    // Arabic
    'ميلانو', 'ميلان',
    // Chinese
    '米兰',
    // Japanese
    'ミラノ',
    // Russian
    'Милан',
    // Hindi
    'मिलान',
  ]),

  city('Naples', 'Italy', [
    // Italian
    'Napoli',
    // Arabic
    'نابولي',
    // Chinese
    '那不勒斯',
    // Japanese
    'ナポリ',
    // Russian
    'Неаполь',
  ]),

  city('Florence', 'Italy', [
    // Italian
    'Firenze',
    // Arabic
    'فلورنسا',
    // Chinese
    '佛罗伦萨',
    // Japanese
    'フィレンツェ',
    // Russian
    'Флоренция',
    // German
    'Florenz',
  ]),

  city('Venice', 'Italy', [
    // Italian
    'Venezia',
    // Arabic
    'البندقية', 'فينيسيا',
    // Chinese
    '威尼斯',
    // Japanese
    'ヴェネツィア',
    // Russian
    'Венеция',
    // German
    'Venedig',
  ]),

  city('Turin', 'Italy', [
    // Italian
    'Torino',
    // Arabic
    'تورينو',
    // Chinese
    '都灵',
    // Russian
    'Турин',
  ]),

  city('Bologna', 'Italy', [
    // Arabic
    'بولونيا',
    // Chinese
    '博洛尼亚',
    // Russian
    'Болонья',
  ]),

  // Spain Cities
  city('Madrid', 'Spain', [
    // Arabic
    'مدريد',
    // Chinese
    '马德里',
    // Japanese
    'マドリード',
    // Korean
    '마드리드',
    // Russian
    'Мадрид',
    // Hindi
    'मैड्रिड',
  ]),

  city('Barcelona', 'Spain', [
    // Catalan
    'Barcelona',
    // Arabic
    'برشلونة',
    // Chinese
    '巴塞罗那',
    // Japanese
    'バルセロナ',
    // Russian
    'Барселона',
    // Hindi
    'बार्सिलोना',
  ]),

  city('Valencia', 'Spain', [
    // Catalan
    'València',
    // Arabic
    'فالنسيا',
    // Chinese
    '瓦伦西亚',
    // Russian
    'Валенсия',
  ]),

  city('Seville', 'Spain', [
    // Spanish
    'Sevilla',
    // Arabic
    'إشبيلية',
    // Chinese
    '塞维利亚',
    // Russian
    'Севилья',
  ]),

  city('Bilbao', 'Spain', [
    // Basque
    'Bilbo',
    // Arabic
    'بلباو',
    // Chinese
    '毕尔巴鄂',
    // Russian
    'Бильбао',
  ]),

  city('Malaga', 'Spain', [
    // Spanish
    'Málaga',
    // Arabic
    'مالقة',
    // Chinese
    '马拉加',
    // Russian
    'Малага',
  ]),

  // Netherlands Cities
  city('Amsterdam', 'Netherlands', [
    // Arabic
    'أمستردام',
    // Chinese
    '阿姆斯特丹',
    // Japanese
    'アムステルダム',
    // Korean
    '암스테르담',
    // Russian
    'Амстердам',
    // Hindi
    'एम्स्टर्डम',
  ]),

  city('Rotterdam', 'Netherlands', [
    // Arabic
    'روتردام',
    // Chinese
    '鹿特丹',
    // Japanese
    'ロッテルダム',
    // Russian
    'Роттердам',
  ]),

  city('The Hague', 'Netherlands', [
    // Dutch
    'Den Haag', "'s-Gravenhage",
    // Arabic
    'لاهاي',
    // Chinese
    '海牙',
    // Japanese
    'ハーグ',
    // Russian
    'Гаага',
    // French
    'La Haye',
  ]),

  city('Utrecht', 'Netherlands', [
    // Arabic
    'أوتريخت',
    // Chinese
    '乌得勒支',
    // Russian
    'Утрехт',
  ]),

  city('Eindhoven', 'Netherlands', [
    // Chinese
    '埃因霍温',
    // Russian
    'Эйндховен',
  ]),

  // Belgium Cities
  city('Brussels', 'Belgium', [
    // French
    'Bruxelles',
    // Dutch
    'Brussel',
    // Arabic
    'بروكسل',
    // Chinese
    '布鲁塞尔',
    // Japanese
    'ブリュッセル',
    // Russian
    'Брюссель',
    // Hindi
    'ब्रुसेल्स',
  ]),

  city('Antwerp', 'Belgium', [
    // Dutch
    'Antwerpen',
    // French
    'Anvers',
    // Arabic
    'أنتويرب',
    // Chinese
    '安特卫普',
    // Russian
    'Антверпен',
  ]),

  city('Ghent', 'Belgium', [
    // Dutch
    'Gent',
    // French
    'Gand',
    // Arabic
    'غنت',
    // Chinese
    '根特',
    // Russian
    'Гент',
  ]),

  // Switzerland Cities
  city('Zurich', 'Switzerland', [
    // German
    'Zürich',
    // Arabic
    'زيورخ',
    // Chinese
    '苏黎世',
    // Japanese
    'チューリッヒ',
    // Russian
    'Цюрих',
    // French
    'Zurich',
    // Hindi
    'ज्यूरिख',
  ]),

  city('Geneva', 'Switzerland', [
    // French
    'Genève',
    // German
    'Genf',
    // Arabic
    'جنيف',
    // Chinese
    '日内瓦',
    // Japanese
    'ジュネーブ',
    // Russian
    'Женева',
    // Italian
    'Ginevra',
    // Hindi
    'जिनेवा',
  ]),

  city('Basel', 'Switzerland', [
    // French
    'Bâle',
    // Italian
    'Basilea',
    // Arabic
    'بازل',
    // Chinese
    '巴塞尔',
    // Russian
    'Базель',
  ]),

  city('Bern', 'Switzerland', [
    // French
    'Berne',
    // Italian
    'Berna',
    // Arabic
    'برن',
    // Chinese
    '伯尔尼',
    // Russian
    'Берн',
  ]),

  // Austria Cities
  city('Vienna', 'Austria', [
    // German
    'Wien',
    // Arabic
    'فيينا',
    // Chinese
    '维也纳',
    // Japanese
    'ウィーン',
    // Korean
    '비엔나',
    // Russian
    'Вена',
    // French
    'Vienne',
    // Hindi
    'वियना',
  ]),

  city('Salzburg', 'Austria', [
    // Arabic
    'سالزبورغ',
    // Chinese
    '萨尔茨堡',
    // Russian
    'Зальцбург',
  ]),

  city('Innsbruck', 'Austria', [
    // Arabic
    'إنسبروك',
    // Chinese
    '因斯布鲁克',
    // Russian
    'Инсбрук',
  ]),

  // Poland Cities
  city('Warsaw', 'Poland', [
    // Polish
    'Warszawa',
    // Arabic
    'وارسو',
    // Chinese
    '华沙',
    // Japanese
    'ワルシャワ',
    // Russian
    'Варшава',
    // German
    'Warschau',
    // French
    'Varsovie',
    // Hindi
    'वॉर्सा',
  ]),

  city('Krakow', 'Poland', [
    // Polish
    'Kraków',
    // Arabic
    'كراكوف',
    // Chinese
    '克拉科夫',
    // Russian
    'Краков',
    // German
    'Krakau',
  ]),

  city('Wroclaw', 'Poland', [
    // Polish
    'Wrocław',
    // German
    'Breslau',
    // Arabic
    'فروتسواف',
    // Chinese
    '弗罗茨瓦夫',
    // Russian
    'Вроцлав',
  ]),

  city('Gdansk', 'Poland', [
    // Polish
    'Gdańsk',
    // German
    'Danzig',
    // Arabic
    'غدانسك',
    // Chinese
    '格但斯克',
    // Russian
    'Гданьск',
  ]),

  city('Poznan', 'Poland', [
    // Polish
    'Poznań',
    // German
    'Posen',
    // Arabic
    'بوزنان',
    // Chinese
    '波兹南',
    // Russian
    'Познань',
  ]),

  // Czech Republic Cities
  city('Prague', 'Czech Republic', [
    // Czech
    'Praha',
    // Arabic
    'براغ',
    // Chinese
    '布拉格',
    // Japanese
    'プラハ',
    // Russian
    'Прага',
    // German
    'Prag',
    // French
    'Prague',
    // Hindi
    'प्राग',
  ]),

  city('Brno', 'Czech Republic', [
    // German
    'Brünn',
    // Arabic
    'برنو',
    // Chinese
    '布尔诺',
    // Russian
    'Брно',
  ]),

  // Hungary Cities
  city('Budapest', 'Hungary', [
    // Arabic
    'بودابست',
    // Chinese
    '布达佩斯',
    // Japanese
    'ブダペスト',
    // Russian
    'Будапешт',
    // Hindi
    'बुडापेस्ट',
  ]),

  // Romania Cities
  city('Bucharest', 'Romania', [
    // Romanian
    'București',
    // Arabic
    'بوخارست',
    // Chinese
    '布加勒斯特',
    // Russian
    'Бухарест',
    // German
    'Bukarest',
    // French
    'Bucarest',
  ]),

  city('Cluj-Napoca', 'Romania', [
    'Cluj',
    // German
    'Klausenburg',
    // Hungarian
    'Kolozsvár',
    // Chinese
    '克卢日-纳波卡',
    // Russian
    'Клуж-Напока',
  ]),

  // Bulgaria Cities
  city('Sofia', 'Bulgaria', [
    // Bulgarian
    'София',
    // Arabic
    'صوفيا',
    // Chinese
    '索非亚',
    // Russian
    'София',
    // German
    'Sofia',
  ]),

  // Greece Cities
  city('Athens', 'Greece', [
    // Greek
    'Αθήνα', 'Athina',
    // Arabic
    'أثينا',
    // Chinese
    '雅典',
    // Japanese
    'アテネ',
    // Russian
    'Афины',
    // French
    'Athènes',
    // German
    'Athen',
    // Hindi
    'एथेंस',
  ]),

  city('Thessaloniki', 'Greece', [
    // Greek
    'Θεσσαλονίκη',
    // Arabic
    'سالونيك',
    // Chinese
    '塞萨洛尼基',
    // Russian
    'Салоники',
    // French
    'Thessalonique',
  ]),

  // Portugal Cities
  city('Lisbon', 'Portugal', [
    // Portuguese
    'Lisboa',
    // Arabic
    'لشبونة',
    // Chinese
    '里斯本',
    // Japanese
    'リスボン',
    // Russian
    'Лиссабон',
    // French
    'Lisbonne',
    // Hindi
    'लिस्बन',
  ]),

  city('Porto', 'Portugal', [
    'Oporto',
    // Arabic
    'بورتو',
    // Chinese
    '波尔图',
    // Russian
    'Порту',
  ]),

  // Denmark Cities
  city('Copenhagen', 'Denmark', [
    // Danish
    'København',
    // Arabic
    'كوبنهاغن',
    // Chinese
    '哥本哈根',
    // Japanese
    'コペンハーゲン',
    // Russian
    'Копенгаген',
    // German
    'Kopenhagen',
    // French
    'Copenhague',
    // Hindi
    'कोपेनहेगन',
  ]),

  // Sweden Cities
  city('Stockholm', 'Sweden', [
    // Arabic
    'ستوكهولم',
    // Chinese
    '斯德哥尔摩',
    // Japanese
    'ストックホルム',
    // Russian
    'Стокгольм',
    // Hindi
    'स्टॉकहोम',
  ]),

  city('Gothenburg', 'Sweden', [
    // Swedish
    'Göteborg',
    // Arabic
    'غوتنبرغ',
    // Chinese
    '哥德堡',
    // Russian
    'Гётеборг',
  ]),

  city('Malmo', 'Sweden', [
    // Swedish
    'Malmö',
    // Arabic
    'مالمو',
    // Chinese
    '马尔默',
    // Russian
    'Мальмё',
  ]),

  // Norway Cities
  city('Oslo', 'Norway', [
    // Arabic
    'أوسلو',
    // Chinese
    '奥斯陆',
    // Japanese
    'オスロ',
    // Russian
    'Осло',
    // Hindi
    'ओस्लो',
  ]),

  city('Bergen', 'Norway', [
    // Arabic
    'بيرغن',
    // Chinese
    '卑尔根',
    // Russian
    'Берген',
  ]),

  // Finland Cities
  city('Helsinki', 'Finland', [
    // Finnish
    'Helsinki',
    // Swedish
    'Helsingfors',
    // Arabic
    'هلسنكي',
    // Chinese
    '赫尔辛基',
    // Japanese
    'ヘルシンキ',
    // Russian
    'Хельсинки',
    // Hindi
    'हेलसिंकी',
  ]),

  // Ireland Cities
  city('Dublin', 'Ireland', [
    // Irish
    'Baile Átha Cliath',
    // Arabic
    'دبلن',
    // Chinese
    '都柏林',
    // Japanese
    'ダブリン',
    // Russian
    'Дублин',
    // Hindi
    'डबलिन',
  ]),

  city('Cork', 'Ireland', [
    // Irish
    'Corcaigh',
    // Arabic
    'كورك',
    // Chinese
    '科克',
    // Russian
    'Корк',
  ]),

  // Russia Cities
  city('Moscow', 'Russia', [
    // Russian
    'Москва',
    // Arabic
    'موسكو',
    // Chinese
    '莫斯科',
    // Japanese
    'モスクワ',
    // Korean
    '모스크바',
    // German
    'Moskau',
    // French
    'Moscou',
    // Spanish
    'Moscú',
    // Hindi
    'मास्को',
  ]),

  city('Saint Petersburg', 'Russia', [
    'St. Petersburg', 'St Petersburg',
    // Russian
    'Санкт-Петербург', 'Питер',
    // Arabic
    'سانت بطرسبرغ',
    // Chinese
    '圣彼得堡',
    // Japanese
    'サンクトペテルブルク',
    // German
    'Sankt Petersburg',
    // French
    'Saint-Pétersbourg',
    // Hindi
    'सेंट पीटर्सबर्ग',
  ]),

  city('Novosibirsk', 'Russia', [
    // Russian
    'Новосибирск',
    // Chinese
    '新西伯利亚',
  ]),

  city('Yekaterinburg', 'Russia', [
    // Russian
    'Екатеринбург',
    // Chinese
    '叶卡捷琳堡',
  ]),

  city('Kazan', 'Russia', [
    // Russian
    'Казань',
    // Chinese
    '喀山',
    // Arabic
    'قازان',
  ]),

  // Ukraine Cities
  city('Kyiv', 'Ukraine', [
    'Kiev',
    // Ukrainian
    'Київ',
    // Russian
    'Киев',
    // Arabic
    'كييف',
    // Chinese
    '基辅',
    // Japanese
    'キエフ',
    // German
    'Kiew',
    // Hindi
    'कीव',
  ]),

  city('Kharkiv', 'Ukraine', [
    'Kharkov',
    // Ukrainian
    'Харків',
    // Russian
    'Харьков',
    // Chinese
    '哈尔科夫',
  ]),

  city('Odesa', 'Ukraine', [
    'Odessa',
    // Ukrainian
    'Одеса',
    // Russian
    'Одесса',
    // Chinese
    '敖德萨',
  ]),

  city('Lviv', 'Ukraine', [
    // Ukrainian
    'Львів',
    // Russian
    'Львов',
    // German
    'Lemberg',
    // Polish
    'Lwów',
    // Chinese
    '利沃夫',
  ]),

  // ============================================
  // ASIAN CITIES
  // ============================================

  // China Cities
  city('Beijing', 'China', [
    'Peking',
    // Chinese
    '北京',
    // Arabic
    'بكين',
    // Japanese
    '北京', 'ペキン',
    // Korean
    '베이징',
    // Russian
    'Пекин',
    // Hindi
    'बीजिंग',
  ]),

  city('Shanghai', 'China', [
    // Chinese
    '上海',
    // Arabic
    'شنغهاي',
    // Japanese
    '上海', 'シャンハイ',
    // Korean
    '상하이',
    // Russian
    'Шанхай',
    // Hindi
    'शंघाई',
  ]),

  city('Shenzhen', 'China', [
    // Chinese
    '深圳',
    // Arabic
    'شنجن',
    // Japanese
    '深セン',
    // Russian
    'Шэньчжэнь',
  ]),

  city('Guangzhou', 'China', [
    'Canton',
    // Chinese
    '广州',
    // Arabic
    'غوانزو',
    // Japanese
    '広州',
    // Russian
    'Гуанчжоу',
  ]),

  city('Hangzhou', 'China', [
    // Chinese
    '杭州',
    // Japanese
    '杭州',
    // Russian
    'Ханчжоу',
  ]),

  city('Chengdu', 'China', [
    // Chinese
    '成都',
    // Japanese
    '成都',
    // Russian
    'Чэнду',
  ]),

  city('Wuhan', 'China', [
    // Chinese
    '武汉',
    // Arabic
    'ووهان',
    // Japanese
    '武漢',
    // Russian
    'Ухань',
  ]),

  city('Nanjing', 'China', [
    'Nanking',
    // Chinese
    '南京',
    // Japanese
    '南京',
    // Russian
    'Нанкин',
  ]),

  city("Xi'an", 'China', [
    'Xian',
    // Chinese
    '西安',
    // Japanese
    '西安',
    // Russian
    'Сиань',
  ]),

  city('Tianjin', 'China', [
    // Chinese
    '天津',
    // Japanese
    '天津',
    // Russian
    'Тяньцзинь',
  ]),

  city('Chongqing', 'China', [
    // Chinese
    '重庆',
    // Japanese
    '重慶',
    // Russian
    'Чунцин',
  ]),

  city('Suzhou', 'China', [
    // Chinese
    '苏州',
    // Japanese
    '蘇州',
    // Russian
    'Сучжоу',
  ]),

  city('Dongguan', 'China', [
    // Chinese
    '东莞',
    // Russian
    'Дунгуань',
  ]),

  city('Qingdao', 'China', [
    // Chinese
    '青岛',
    // Russian
    'Циндао',
  ]),

  city('Dalian', 'China', [
    // Chinese
    '大连',
    // Russian
    'Далянь',
  ]),

  // Japan Cities
  city('Tokyo', 'Japan', [
    // Japanese
    '東京', 'とうきょう',
    // Arabic
    'طوكيو',
    // Chinese
    '东京',
    // Korean
    '도쿄',
    // Russian
    'Токио',
    // Hindi
    'टोक्यो',
  ]),

  city('Osaka', 'Japan', [
    // Japanese
    '大阪', 'おおさか',
    // Arabic
    'أوساكا',
    // Chinese
    '大阪',
    // Korean
    '오사카',
    // Russian
    'Осака',
  ]),

  city('Kyoto', 'Japan', [
    // Japanese
    '京都', 'きょうと',
    // Arabic
    'كيوتو',
    // Chinese
    '京都',
    // Korean
    '교토',
    // Russian
    'Киото',
  ]),

  city('Yokohama', 'Japan', [
    // Japanese
    '横浜', 'よこはま',
    // Chinese
    '横滨',
    // Russian
    'Йокогама',
  ]),

  city('Nagoya', 'Japan', [
    // Japanese
    '名古屋', 'なごや',
    // Chinese
    '名古屋',
    // Russian
    'Нагоя',
  ]),

  city('Fukuoka', 'Japan', [
    // Japanese
    '福岡', 'ふくおか',
    // Chinese
    '福冈',
    // Russian
    'Фукуока',
  ]),

  city('Sapporo', 'Japan', [
    // Japanese
    '札幌', 'さっぽろ',
    // Chinese
    '札幌',
    // Russian
    'Саппоро',
  ]),

  city('Kobe', 'Japan', [
    // Japanese
    '神戸', 'こうべ',
    // Chinese
    '神户',
    // Russian
    'Кобе',
  ]),

  city('Hiroshima', 'Japan', [
    // Japanese
    '広島', 'ひろしま',
    // Arabic
    'هيروشيما',
    // Chinese
    '广岛',
    // Russian
    'Хиросима',
  ]),

  // South Korea Cities
  city('Seoul', 'South Korea', [
    // Korean
    '서울',
    // Arabic
    'سيول',
    // Chinese
    '首尔',
    // Japanese
    'ソウル',
    // Russian
    'Сеул',
    // Hindi
    'सियोल',
  ]),

  city('Busan', 'South Korea', [
    'Pusan',
    // Korean
    '부산',
    // Chinese
    '釜山',
    // Japanese
    '釜山', 'プサン',
    // Russian
    'Пусан',
  ]),

  city('Incheon', 'South Korea', [
    // Korean
    '인천',
    // Chinese
    '仁川',
    // Japanese
    'インチョン',
    // Russian
    'Инчхон',
  ]),

  city('Daegu', 'South Korea', [
    // Korean
    '대구',
    // Chinese
    '大邱',
    // Japanese
    'テグ',
    // Russian
    'Тэгу',
  ]),

  city('Daejeon', 'South Korea', [
    // Korean
    '대전',
    // Chinese
    '大田',
    // Russian
    'Тэджон',
  ]),

  // Taiwan Cities
  city('Taipei', 'Taiwan', [
    // Chinese
    '台北', '臺北',
    // Arabic
    'تايبيه',
    // Japanese
    '台北', 'タイペイ',
    // Korean
    '타이베이',
    // Russian
    'Тайбэй',
    // Hindi
    'ताइपे',
  ]),

  city('Kaohsiung', 'Taiwan', [
    // Chinese
    '高雄',
    // Japanese
    '高雄',
    // Russian
    'Гаосюн',
  ]),

  city('Taichung', 'Taiwan', [
    // Chinese
    '台中', '臺中',
    // Japanese
    '台中',
    // Russian
    'Тайчжун',
  ]),

  // Hong Kong
  city('Hong Kong', 'Hong Kong', [
    // Chinese
    '香港',
    // Arabic
    'هونغ كونغ',
    // Japanese
    '香港', 'ホンコン',
    // Korean
    '홍콩',
    // Russian
    'Гонконг',
    // Hindi
    'हांगकांग',
  ]),

  // Singapore
  city('Singapore', 'Singapore', [
    // Chinese
    '新加坡',
    // Malay
    'Singapura',
    // Tamil
    'சிங்கப்பூர்',
    // Arabic
    'سنغافورة',
    // Japanese
    'シンガポール',
    // Korean
    '싱가포르',
    // Russian
    'Сингапур',
    // Hindi
    'सिंगापुर',
  ]),

  // India Cities
  city('Mumbai', 'India', [
    'Bombay',
    // Hindi
    'मुंबई',
    // Marathi
    'मुंबई',
    // Arabic
    'مومباي',
    // Chinese
    '孟买',
    // Japanese
    'ムンバイ',
    // Korean
    '뭄바이',
    // Russian
    'Мумбаи',
  ]),

  city('Delhi', 'India', [
    'New Delhi',
    // Hindi
    'दिल्ली', 'नई दिल्ली',
    // Arabic
    'دلهي', 'نيودلهي',
    // Chinese
    '德里', '新德里',
    // Japanese
    'デリー',
    // Korean
    '델리',
    // Russian
    'Дели',
  ]),

  city('Bangalore', 'India', [
    'Bengaluru',
    // Kannada
    'ಬೆಂಗಳೂರು',
    // Hindi
    'बेंगलुरु', 'बंगलौर',
    // Arabic
    'بنغالور',
    // Chinese
    '班加罗尔',
    // Japanese
    'バンガロール',
    // Russian
    'Бангалор',
  ]),

  city('Hyderabad', 'India', [
    // Telugu
    'హైదరాబాద్',
    // Hindi
    'हैदराबाद',
    // Arabic
    'حيدر أباد',
    // Chinese
    '海得拉巴',
    // Russian
    'Хайдарабад',
  ]),

  city('Chennai', 'India', [
    'Madras',
    // Tamil
    'சென்னை',
    // Hindi
    'चेन्नई',
    // Arabic
    'تشيناي',
    // Chinese
    '金奈',
    // Russian
    'Ченнаи',
  ]),

  city('Kolkata', 'India', [
    'Calcutta',
    // Bengali
    'কলকাতা',
    // Hindi
    'कोलकाता',
    // Arabic
    'كولكاتا',
    // Chinese
    '加尔各答',
    // Russian
    'Калькутта',
  ]),

  city('Pune', 'India', [
    // Marathi
    'पुणे',
    // Hindi
    'पुणे',
    // Chinese
    '浦那',
    // Russian
    'Пуна',
  ]),

  city('Ahmedabad', 'India', [
    // Gujarati
    'અમદાવાદ',
    // Hindi
    'अहमदाबाद',
    // Arabic
    'أحمد آباد',
    // Chinese
    '艾哈迈达巴德',
    // Russian
    'Ахмадабад',
  ]),

  city('Jaipur', 'India', [
    // Hindi
    'जयपुर',
    // Arabic
    'جايبور',
    // Chinese
    '斋浦尔',
    // Russian
    'Джайпур',
  ]),

  city('Lucknow', 'India', [
    // Hindi
    'लखनऊ',
    // Chinese
    '勒克瑙',
    // Russian
    'Лакхнау',
  ]),

  city('Surat', 'India', [
    // Gujarati
    'સુરત',
    // Hindi
    'सूरत',
    // Chinese
    '苏拉特',
    // Russian
    'Сурат',
  ]),

  city('Chandigarh', 'India', [
    // Hindi
    'चंडीगढ़',
    // Punjabi
    'ਚੰਡੀਗੜ੍ਹ',
    // Chinese
    '昌迪加尔',
  ]),

  city('Gurgaon', 'India', [
    'Gurugram',
    // Hindi
    'गुरुग्राम', 'गुड़गाँव',
    // Chinese
    '古尔冈',
  ]),

  city('Noida', 'India', [
    // Hindi
    'नोएडा',
    // Chinese
    '诺伊达',
  ]),

  // Pakistan Cities
  city('Karachi', 'Pakistan', [
    // Urdu
    'کراچی',
    // Arabic
    'كراتشي',
    // Chinese
    '卡拉奇',
    // Russian
    'Карачи',
  ]),

  city('Lahore', 'Pakistan', [
    // Urdu
    'لاہور',
    // Arabic
    'لاهور',
    // Chinese
    '拉合尔',
    // Russian
    'Лахор',
  ]),

  city('Islamabad', 'Pakistan', [
    // Urdu
    'اسلام آباد',
    // Arabic
    'إسلام أباد',
    // Chinese
    '伊斯兰堡',
    // Russian
    'Исламабад',
  ]),

  city('Rawalpindi', 'Pakistan', [
    // Urdu
    'راولپنڈی',
    // Chinese
    '拉瓦尔品第',
  ]),

  city('Faisalabad', 'Pakistan', [
    // Urdu
    'فیصل آباد',
    // Chinese
    '费萨拉巴德',
  ]),

  // Bangladesh Cities
  city('Dhaka', 'Bangladesh', [
    'Dacca',
    // Bengali
    'ঢাকা',
    // Arabic
    'دكا',
    // Chinese
    '达卡',
    // Russian
    'Дакка',
  ]),

  city('Chittagong', 'Bangladesh', [
    // Bengali
    'চট্টগ্রাম',
    // Chinese
    '吉大港',
  ]),

  // Indonesia Cities
  city('Jakarta', 'Indonesia', [
    // Arabic
    'جاكرتا',
    // Chinese
    '雅加达',
    // Japanese
    'ジャカルタ',
    // Russian
    'Джакарта',
    // Hindi
    'जकार्ता',
  ]),

  city('Surabaya', 'Indonesia', [
    // Chinese
    '泗水',
    // Russian
    'Сурабая',
  ]),

  city('Bandung', 'Indonesia', [
    // Chinese
    '万隆',
    // Russian
    'Бандунг',
  ]),

  city('Bali', 'Indonesia', [
    // Chinese
    '巴厘岛',
    // Japanese
    'バリ',
    // Russian
    'Бали',
  ]),

  city('Medan', 'Indonesia', [
    // Chinese
    '棉兰',
    // Russian
    'Медан',
  ]),

  city('Yogyakarta', 'Indonesia', [
    // Chinese
    '日惹',
    // Russian
    'Джокьякарта',
  ]),

  // Malaysia Cities
  city('Kuala Lumpur', 'Malaysia', [
    'KL',
    // Arabic
    'كوالالمبور',
    // Chinese
    '吉隆坡',
    // Japanese
    'クアラルンプール',
    // Russian
    'Куала-Лумпур',
    // Hindi
    'क्वालालंपुर',
  ]),

  city('Penang', 'Malaysia', [
    'George Town',
    // Chinese
    '槟城',
    // Russian
    'Пинанг',
  ]),

  city('Johor Bahru', 'Malaysia', [
    // Chinese
    '新山',
    // Russian
    'Джохор-Бару',
  ]),

  // Thailand Cities
  city('Bangkok', 'Thailand', [
    // Thai
    'กรุงเทพมหานคร', 'กรุงเทพฯ',
    // Arabic
    'بانكوك',
    // Chinese
    '曼谷',
    // Japanese
    'バンコク',
    // Korean
    '방콕',
    // Russian
    'Бангкок',
    // Hindi
    'बैंकॉक',
  ]),

  city('Chiang Mai', 'Thailand', [
    // Thai
    'เชียงใหม่',
    // Chinese
    '清迈',
    // Japanese
    'チェンマイ',
    // Russian
    'Чиангмай',
  ]),

  city('Phuket', 'Thailand', [
    // Thai
    'ภูเก็ต',
    // Chinese
    '普吉岛',
    // Japanese
    'プーケット',
    // Russian
    'Пхукет',
  ]),

  city('Pattaya', 'Thailand', [
    // Thai
    'พัทยา',
    // Chinese
    '芭提雅',
    // Russian
    'Паттайя',
  ]),

  // Vietnam Cities
  city('Ho Chi Minh City', 'Vietnam', [
    'Saigon', 'HCMC',
    // Vietnamese
    'Thành phố Hồ Chí Minh', 'Sài Gòn',
    // Arabic
    'مدينة هوشي منه',
    // Chinese
    '胡志明市', '西贡',
    // Japanese
    'ホーチミン市',
    // Russian
    'Хошимин',
  ]),

  city('Hanoi', 'Vietnam', [
    // Vietnamese
    'Hà Nội',
    // Arabic
    'هانوي',
    // Chinese
    '河内',
    // Japanese
    'ハノイ',
    // Russian
    'Ханой',
    // Hindi
    'हनोई',
  ]),

  city('Da Nang', 'Vietnam', [
    // Vietnamese
    'Đà Nẵng',
    // Chinese
    '岘港',
    // Russian
    'Дананг',
  ]),

  // Philippines Cities
  city('Manila', 'Philippines', [
    'Metro Manila',
    // Filipino
    'Maynila',
    // Arabic
    'مانيلا',
    // Chinese
    '马尼拉',
    // Japanese
    'マニラ',
    // Russian
    'Манила',
    // Hindi
    'मनीला',
  ]),

  city('Cebu', 'Philippines', [
    'Cebu City',
    // Chinese
    '宿务',
    // Russian
    'Себу',
  ]),

  city('Davao', 'Philippines', [
    'Davao City',
    // Chinese
    '达沃',
    // Russian
    'Давао',
  ]),

  city('Makati', 'Philippines', [
    // Chinese
    '马卡蒂',
  ]),

  city('Quezon City', 'Philippines', [
    // Chinese
    '奎松城',
  ]),

  // ============================================
  // AMERICAN CITIES
  // ============================================

  // USA Cities
  city('New York', 'United States', [
    'New York City', 'NYC', 'Manhattan',
    // Arabic
    'نيويورك',
    // Chinese
    '纽约',
    // Japanese
    'ニューヨーク',
    // Korean
    '뉴욕',
    // Russian
    'Нью-Йорк',
    // French
    'New York',
    // Spanish
    'Nueva York',
    // Hindi
    'न्यूयॉर्क',
  ]),

  city('Los Angeles', 'United States', [
    'LA', 'L.A.',
    // Arabic
    'لوس أنجلوس',
    // Chinese
    '洛杉矶',
    // Japanese
    'ロサンゼルス',
    // Korean
    '로스앤젤레스',
    // Russian
    'Лос-Анджелес',
    // Hindi
    'लॉस एंजिल्स',
  ]),

  city('Chicago', 'United States', [
    // Arabic
    'شيكاغو',
    // Chinese
    '芝加哥',
    // Japanese
    'シカゴ',
    // Russian
    'Чикаго',
    // Hindi
    'शिकागो',
  ]),

  city('Houston', 'United States', [
    // Arabic
    'هيوستن',
    // Chinese
    '休斯顿',
    // Japanese
    'ヒューストン',
    // Russian
    'Хьюстон',
  ]),

  city('Phoenix', 'United States', [
    // Arabic
    'فينيكس',
    // Chinese
    '凤凰城',
    // Russian
    'Финикс',
  ]),

  city('Philadelphia', 'United States', [
    'Philly',
    // Arabic
    'فيلادلفيا',
    // Chinese
    '费城',
    // Russian
    'Филадельфия',
  ]),

  city('San Antonio', 'United States', [
    // Chinese
    '圣安东尼奥',
    // Russian
    'Сан-Антонио',
  ]),

  city('San Diego', 'United States', [
    // Arabic
    'سان دييغو',
    // Chinese
    '圣地亚哥',
    // Russian
    'Сан-Диего',
  ]),

  city('Dallas', 'United States', [
    // Arabic
    'دالاس',
    // Chinese
    '达拉斯',
    // Russian
    'Даллас',
  ]),

  city('San Jose', 'United States', [
    // Chinese
    '圣何塞',
    // Russian
    'Сан-Хосе',
  ]),

  city('Austin', 'United States', [
    // Arabic
    'أوستن',
    // Chinese
    '奥斯汀',
    // Russian
    'Остин',
  ]),

  city('San Francisco', 'United States', [
    'SF',
    // Arabic
    'سان فرانسيسكو',
    // Chinese
    '旧金山', '三藩市',
    // Japanese
    'サンフランシスコ',
    // Korean
    '샌프란시스코',
    // Russian
    'Сан-Франциско',
    // Hindi
    'सैन फ्रांसिस्को',
  ]),

  city('Seattle', 'United States', [
    // Arabic
    'سياتل',
    // Chinese
    '西雅图',
    // Japanese
    'シアトル',
    // Russian
    'Сиэтл',
    // Hindi
    'सिएटल',
  ]),

  city('Denver', 'United States', [
    // Arabic
    'دنفر',
    // Chinese
    '丹佛',
    // Russian
    'Денвер',
  ]),

  city('Washington', 'United States', [
    'Washington D.C.', 'Washington DC', 'D.C.', 'DC',
    // Arabic
    'واشنطن',
    // Chinese
    '华盛顿',
    // Japanese
    'ワシントン',
    // Russian
    'Вашингтон',
    // Hindi
    'वाशिंगटन',
  ]),

  city('Boston', 'United States', [
    // Arabic
    'بوسطن',
    // Chinese
    '波士顿',
    // Japanese
    'ボストン',
    // Russian
    'Бостон',
    // Hindi
    'बोस्टन',
  ]),

  city('Miami', 'United States', [
    // Arabic
    'ميامي',
    // Chinese
    '迈阿密',
    // Japanese
    'マイアミ',
    // Russian
    'Майами',
    // Hindi
    'मियामी',
  ]),

  city('Atlanta', 'United States', [
    // Arabic
    'أتلانتا',
    // Chinese
    '亚特兰大',
    // Japanese
    'アトランタ',
    // Russian
    'Атланта',
  ]),

  city('Detroit', 'United States', [
    // Arabic
    'ديترويت',
    // Chinese
    '底特律',
    // Russian
    'Детройт',
  ]),

  city('Minneapolis', 'United States', [
    // Chinese
    '明尼阿波利斯',
    // Russian
    'Миннеаполис',
  ]),

  city('Portland', 'United States', [
    // Chinese
    '波特兰',
    // Russian
    'Портленд',
  ]),

  city('Las Vegas', 'United States', [
    // Arabic
    'لاس فيغاس',
    // Chinese
    '拉斯维加斯',
    // Japanese
    'ラスベガス',
    // Russian
    'Лас-Вегас',
  ]),

  city('San Mateo', 'United States', [
    // Chinese
    '圣马特奥',
  ]),

  city('Palo Alto', 'United States', [
    // Chinese
    '帕洛阿尔托',
  ]),

  city('Mountain View', 'United States', [
    // Chinese
    '山景城',
  ]),

  city('Sunnyvale', 'United States', [
    // Chinese
    '桑尼维尔',
  ]),

  city('Cupertino', 'United States', [
    // Chinese
    '库比蒂诺',
  ]),

  city('Santa Clara', 'United States', [
    // Chinese
    '圣克拉拉',
  ]),

  city('Redmond', 'United States', [
    // Chinese
    '雷德蒙德',
  ]),

  city('Menlo Park', 'United States', [
    // Chinese
    '门洛帕克',
  ]),

  // Canada Cities
  city('Toronto', 'Canada', [
    // Arabic
    'تورنتو',
    // Chinese
    '多伦多',
    // Japanese
    'トロント',
    // Korean
    '토론토',
    // Russian
    'Торонто',
    // Hindi
    'टोरंटो',
  ]),

  city('Montreal', 'Canada', [
    // French
    'Montréal',
    // Arabic
    'مونتريال',
    // Chinese
    '蒙特利尔',
    // Japanese
    'モントリオール',
    // Russian
    'Монреаль',
  ]),

  city('Vancouver', 'Canada', [
    // Arabic
    'فانكوفر',
    // Chinese
    '温哥华',
    // Japanese
    'バンクーバー',
    // Korean
    '밴쿠버',
    // Russian
    'Ванкувер',
    // Hindi
    'वैंकूवर',
  ]),

  city('Calgary', 'Canada', [
    // Arabic
    'كالغاري',
    // Chinese
    '卡尔加里',
    // Russian
    'Калгари',
  ]),

  city('Edmonton', 'Canada', [
    // Arabic
    'إدمونتون',
    // Chinese
    '埃德蒙顿',
    // Russian
    'Эдмонтон',
  ]),

  city('Ottawa', 'Canada', [
    // Arabic
    'أوتاوا',
    // Chinese
    '渥太华',
    // Japanese
    'オタワ',
    // Russian
    'Оттава',
  ]),

  city('Winnipeg', 'Canada', [
    // Chinese
    '温尼伯',
    // Russian
    'Виннипег',
  ]),

  city('Quebec City', 'Canada', [
    // French
    'Québec',
    // Chinese
    '魁北克市',
    // Russian
    'Квебек',
  ]),

  // Mexico Cities
  city('Mexico City', 'Mexico', [
    // Spanish
    'Ciudad de México', 'CDMX',
    // Arabic
    'مكسيكو سيتي',
    // Chinese
    '墨西哥城',
    // Japanese
    'メキシコシティ',
    // Russian
    'Мехико',
  ]),

  city('Guadalajara', 'Mexico', [
    // Chinese
    '瓜达拉哈拉',
    // Russian
    'Гвадалахара',
  ]),

  city('Monterrey', 'Mexico', [
    // Chinese
    '蒙特雷',
    // Russian
    'Монтеррей',
  ]),

  city('Cancun', 'Mexico', [
    // Spanish
    'Cancún',
    // Chinese
    '坎昆',
    // Russian
    'Канкун',
  ]),

  // Brazil Cities
  city('São Paulo', 'Brazil', [
    'Sao Paulo',
    // Arabic
    'ساو باولو',
    // Chinese
    '圣保罗',
    // Japanese
    'サンパウロ',
    // Russian
    'Сан-Паулу',
  ]),

  city('Rio de Janeiro', 'Brazil', [
    // Arabic
    'ريو دي جانيرو',
    // Chinese
    '里约热内卢',
    // Japanese
    'リオデジャネイロ',
    // Russian
    'Рио-де-Жанейро',
  ]),

  city('Brasília', 'Brazil', [
    'Brasilia',
    // Chinese
    '巴西利亚',
    // Russian
    'Бразилиа',
  ]),

  city('Salvador', 'Brazil', [
    // Chinese
    '萨尔瓦多',
  ]),

  city('Belo Horizonte', 'Brazil', [
    // Chinese
    '贝洛奥里藏特',
  ]),

  // Argentina Cities
  city('Buenos Aires', 'Argentina', [
    // Arabic
    'بوينس آيرس',
    // Chinese
    '布宜诺斯艾利斯',
    // Japanese
    'ブエノスアイレス',
    // Russian
    'Буэнос-Айрес',
  ]),

  city('Córdoba', 'Argentina', [
    'Cordoba',
    // Chinese
    '科尔多瓦',
  ]),

  // Colombia Cities
  city('Bogotá', 'Colombia', [
    'Bogota',
    // Arabic
    'بوغوتا',
    // Chinese
    '波哥大',
    // Russian
    'Богота',
  ]),

  city('Medellín', 'Colombia', [
    'Medellin',
    // Chinese
    '麦德林',
    // Russian
    'Медельин',
  ]),

  // Chile Cities
  city('Santiago', 'Chile', [
    // Arabic
    'سانتياغو',
    // Chinese
    '圣地亚哥',
    // Russian
    'Сантьяго',
  ]),

  // Peru Cities
  city('Lima', 'Peru', [
    // Arabic
    'ليما',
    // Chinese
    '利马',
    // Russian
    'Лима',
  ]),

  // ============================================
  // AFRICAN CITIES
  // ============================================

  city('Lagos', 'Nigeria', [
    // Arabic
    'لاغوس',
    // Chinese
    '拉各斯',
    // Russian
    'Лагос',
  ]),

  city('Abuja', 'Nigeria', [
    // Arabic
    'أبوجا',
    // Chinese
    '阿布贾',
    // Russian
    'Абуджа',
  ]),

  city('Nairobi', 'Kenya', [
    // Arabic
    'نيروبي',
    // Chinese
    '内罗毕',
    // Russian
    'Найроби',
  ]),

  city('Johannesburg', 'South Africa', [
    'Joburg', 'Jozi',
    // Arabic
    'جوهانسبرغ',
    // Chinese
    '约翰内斯堡',
    // Russian
    'Йоханнесбург',
  ]),

  city('Cape Town', 'South Africa', [
    // Afrikaans
    'Kaapstad',
    // Arabic
    'كيب تاون',
    // Chinese
    '开普敦',
    // Russian
    'Кейптаун',
  ]),

  city('Durban', 'South Africa', [
    // Chinese
    '德班',
    // Russian
    'Дурбан',
  ]),

  city('Pretoria', 'South Africa', [
    // Chinese
    '比勒陀利亚',
    // Russian
    'Претория',
  ]),

  city('Casablanca', 'Morocco', [
    // Arabic
    'الدار البيضاء',
    // French
    'Casablanca',
    // Chinese
    '卡萨布兰卡',
    // Russian
    'Касабланка',
  ]),

  city('Marrakech', 'Morocco', [
    // Arabic
    'مراكش',
    // Chinese
    '马拉喀什',
    // Russian
    'Марракеш',
  ]),

  city('Rabat', 'Morocco', [
    // Arabic
    'الرباط',
    // Chinese
    '拉巴特',
    // Russian
    'Рабат',
  ]),

  city('Algiers', 'Algeria', [
    // Arabic
    'الجزائر',
    // French
    'Alger',
    // Chinese
    '阿尔及尔',
    // Russian
    'Алжир',
  ]),

  city('Tunis', 'Tunisia', [
    // Arabic
    'تونس',
    // Chinese
    '突尼斯市',
    // Russian
    'Тунис',
  ]),

  city('Addis Ababa', 'Ethiopia', [
    // Amharic
    'አዲስ አበባ',
    // Arabic
    'أديس أبابا',
    // Chinese
    '亚的斯亚贝巴',
    // Russian
    'Аддис-Абеба',
  ]),

  city('Accra', 'Ghana', [
    // Arabic
    'أكرا',
    // Chinese
    '阿克拉',
    // Russian
    'Аккра',
  ]),

  city('Dar es Salaam', 'Tanzania', [
    // Arabic
    'دار السلام',
    // Chinese
    '达累斯萨拉姆',
    // Russian
    'Дар-эс-Салам',
  ]),

  city('Kampala', 'Uganda', [
    // Arabic
    'كمبالا',
    // Chinese
    '坎帕拉',
    // Russian
    'Кампала',
  ]),

  city('Kigali', 'Rwanda', [
    // Arabic
    'كيغالي',
    // Chinese
    '基加利',
    // Russian
    'Кигали',
  ]),

  city('Dakar', 'Senegal', [
    // Arabic
    'داكار',
    // Chinese
    '达喀尔',
    // Russian
    'Дакар',
  ]),

  city('Abidjan', 'Ivory Coast', [
    // Arabic
    'أبيدجان',
    // Chinese
    '阿比让',
    // Russian
    'Абиджан',
  ]),

  city('Douala', 'Cameroon', [
    // Arabic
    'دوالا',
    // Chinese
    '杜阿拉',
    // Russian
    'Дуала',
  ]),

  city('Yaoundé', 'Cameroon', [
    'Yaounde',
    // Arabic
    'ياوندي',
    // Chinese
    '雅温得',
    // Russian
    'Яунде',
  ]),

  city('Kinshasa', 'Democratic Republic of the Congo', [
    // Arabic
    'كينشاسا',
    // Chinese
    '金沙萨',
    // Russian
    'Киншаса',
  ]),

  city('Luanda', 'Angola', [
    // Arabic
    'لواندا',
    // Chinese
    '罗安达',
    // Russian
    'Луанда',
  ]),

  city('Harare', 'Zimbabwe', [
    // Arabic
    'هراري',
    // Chinese
    '哈拉雷',
    // Russian
    'Хараре',
  ]),

  city('Lusaka', 'Zambia', [
    // Arabic
    'لوساكا',
    // Chinese
    '卢萨卡',
    // Russian
    'Лусака',
  ]),

  city('Maputo', 'Mozambique', [
    // Arabic
    'مابوتو',
    // Chinese
    '马普托',
    // Russian
    'Мапуту',
  ]),

  city('Gaborone', 'Botswana', [
    // Chinese
    '哈博罗内',
    // Russian
    'Габороне',
  ]),

  city('Windhoek', 'Namibia', [
    // Chinese
    '温得和克',
    // Russian
    'Виндхук',
  ]),

  city('Antananarivo', 'Madagascar', [
    // Malagasy
    'Antananarivo',
    // Chinese
    '塔那那利佛',
    // Russian
    'Антананариву',
  ]),

  city('Port Louis', 'Mauritius', [
    // Chinese
    '路易港',
    // Russian
    'Порт-Луи',
  ]),

  // ============================================
  // OCEANIA CITIES
  // ============================================

  city('Sydney', 'Australia', [
    // Arabic
    'سيدني',
    // Chinese
    '悉尼',
    // Japanese
    'シドニー',
    // Korean
    '시드니',
    // Russian
    'Сидней',
    // Hindi
    'सिडनी',
  ]),

  city('Melbourne', 'Australia', [
    // Arabic
    'ملبورن',
    // Chinese
    '墨尔本',
    // Japanese
    'メルボルン',
    // Russian
    'Мельбурн',
    // Hindi
    'मेलबर्न',
  ]),

  city('Brisbane', 'Australia', [
    // Arabic
    'بريزبين',
    // Chinese
    '布里斯班',
    // Japanese
    'ブリスベン',
    // Russian
    'Брисбен',
  ]),

  city('Perth', 'Australia', [
    // Arabic
    'بيرث',
    // Chinese
    '珀斯',
    // Japanese
    'パース',
    // Russian
    'Перт',
  ]),

  city('Adelaide', 'Australia', [
    // Arabic
    'أديلايد',
    // Chinese
    '阿德莱德',
    // Russian
    'Аделаида',
  ]),

  city('Gold Coast', 'Australia', [
    // Chinese
    '黄金海岸',
    // Russian
    'Голд-Кост',
  ]),

  city('Canberra', 'Australia', [
    // Arabic
    'كانبرا',
    // Chinese
    '堪培拉',
    // Russian
    'Канберра',
  ]),

  city('Auckland', 'New Zealand', [
    // Arabic
    'أوكلاند',
    // Chinese
    '奥克兰',
    // Japanese
    'オークランド',
    // Russian
    'Окленд',
  ]),

  city('Wellington', 'New Zealand', [
    // Arabic
    'ولينغتون',
    // Chinese
    '惠灵顿',
    // Japanese
    'ウェリントン',
    // Russian
    'Веллингтон',
  ]),

  city('Christchurch', 'New Zealand', [
    // Arabic
    'كرايست تشيرتش',
    // Chinese
    '基督城',
    // Russian
    'Крайстчерч',
  ]),

  city('Suva', 'Fiji', [
    // Chinese
    '苏瓦',
    // Russian
    'Сува',
  ]),

  city('Port Moresby', 'Papua New Guinea', [
    // Chinese
    '莫尔兹比港',
    // Russian
    'Порт-Морсби',
  ]),
];

// Build lookup maps for efficient access
export const CITY_BY_ALIAS: Map<string, CityData> = new Map();
export const CITY_BY_CANONICAL: Map<string, CityData> = new Map();
export const CITIES_BY_COUNTRY: Map<string, CityData[]> = new Map();

// Initialize lookup maps
for (const city of CITIES) {
  CITY_BY_CANONICAL.set(city.canonical.toLowerCase(), city);

  for (const alias of city.aliases) {
    CITY_BY_ALIAS.set(alias.toLowerCase(), city);
  }

  // Group cities by country
  const existing = CITIES_BY_COUNTRY.get(city.country) || [];
  existing.push(city);
  CITIES_BY_COUNTRY.set(city.country, existing);
}

/**
 * Look up a city by any of its names (case-insensitive)
 */
export function findCity(name: string): CityData | undefined {
  return CITY_BY_ALIAS.get(name.toLowerCase());
}

/**
 * Get all cities for a specific country
 */
export function getCitiesForCountry(country: string): CityData[] {
  return CITIES_BY_COUNTRY.get(country) || [];
}
