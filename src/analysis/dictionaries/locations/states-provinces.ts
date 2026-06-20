/**
 * States, Provinces, and Administrative Regions
 * Maps state/province names and codes to their countries
 */

export interface StateData {
  name: string;
  code: string;
  country: string;
  aliases: string[];
}

// Helper function to create state data
const state = (name: string, code: string, country: string, aliases: string[] = []): StateData => ({
  name,
  code,
  country,
  aliases: [name, code, ...aliases],
});

export const STATES_PROVINCES: StateData[] = [
  // ============================================
  // UNITED STATES
  // ============================================
  state('Alabama', 'AL', 'United States'),
  state('Alaska', 'AK', 'United States'),
  state('Arizona', 'AZ', 'United States'),
  state('Arkansas', 'AR', 'United States'),
  state('California', 'CA', 'United States', ['Calif']),
  state('Colorado', 'CO', 'United States'),
  state('Connecticut', 'CT', 'United States', ['Conn']),
  state('Delaware', 'DE', 'United States'),
  state('Florida', 'FL', 'United States', ['Fla']),
  state('Georgia', 'GA', 'United States'),
  state('Hawaii', 'HI', 'United States'),
  state('Idaho', 'ID', 'United States'),
  state('Illinois', 'IL', 'United States', ['Ill']),
  state('Indiana', 'IN', 'United States', ['Ind']),
  state('Iowa', 'IA', 'United States'),
  state('Kansas', 'KS', 'United States', ['Kans']),
  state('Kentucky', 'KY', 'United States'),
  state('Louisiana', 'LA', 'United States'),
  state('Maine', 'ME', 'United States'),
  state('Maryland', 'MD', 'United States'),
  state('Massachusetts', 'MA', 'United States', ['Mass']),
  state('Michigan', 'MI', 'United States', ['Mich']),
  state('Minnesota', 'MN', 'United States', ['Minn']),
  state('Mississippi', 'MS', 'United States', ['Miss']),
  state('Missouri', 'MO', 'United States'),
  state('Montana', 'MT', 'United States', ['Mont']),
  state('Nebraska', 'NE', 'United States', ['Nebr']),
  state('Nevada', 'NV', 'United States', ['Nev']),
  state('New Hampshire', 'NH', 'United States'),
  state('New Jersey', 'NJ', 'United States'),
  state('New Mexico', 'NM', 'United States'),
  state('New York', 'NY', 'United States'),
  state('North Carolina', 'NC', 'United States'),
  state('North Dakota', 'ND', 'United States'),
  state('Ohio', 'OH', 'United States'),
  state('Oklahoma', 'OK', 'United States', ['Okla']),
  state('Oregon', 'OR', 'United States', ['Ore']),
  state('Pennsylvania', 'PA', 'United States', ['Penn', 'Penna']),
  state('Rhode Island', 'RI', 'United States'),
  state('South Carolina', 'SC', 'United States'),
  state('South Dakota', 'SD', 'United States'),
  state('Tennessee', 'TN', 'United States', ['Tenn']),
  state('Texas', 'TX', 'United States', ['Tex']),
  state('Utah', 'UT', 'United States'),
  state('Vermont', 'VT', 'United States'),
  state('Virginia', 'VA', 'United States'),
  state('Washington', 'WA', 'United States', ['Wash']),
  state('West Virginia', 'WV', 'United States'),
  state('Wisconsin', 'WI', 'United States', ['Wis', 'Wisc']),
  state('Wyoming', 'WY', 'United States', ['Wyo']),
  state('District of Columbia', 'DC', 'United States', ['Washington DC', 'Washington D.C.']),
  // US Territories
  state('Puerto Rico', 'PR', 'United States'),
  state('Guam', 'GU', 'United States'),
  state('Virgin Islands', 'VI', 'United States', ['US Virgin Islands']),

  // ============================================
  // CANADA
  // ============================================
  state('Alberta', 'AB', 'Canada'),
  state('British Columbia', 'BC', 'Canada'),
  state('Manitoba', 'MB', 'Canada'),
  state('New Brunswick', 'NB', 'Canada'),
  state('Newfoundland and Labrador', 'NL', 'Canada', ['Newfoundland']),
  state('Northwest Territories', 'NT', 'Canada'),
  state('Nova Scotia', 'NS', 'Canada'),
  state('Nunavut', 'NU', 'Canada'),
  state('Ontario', 'ON', 'Canada'),
  state('Prince Edward Island', 'PE', 'Canada', ['PEI']),
  state('Quebec', 'QC', 'Canada', ['Québec']),
  state('Saskatchewan', 'SK', 'Canada'),
  state('Yukon', 'YT', 'Canada'),

  // ============================================
  // AUSTRALIA
  // ============================================
  state('New South Wales', 'NSW', 'Australia'),
  state('Victoria', 'VIC', 'Australia'),
  state('Queensland', 'QLD', 'Australia'),
  state('Western Australia', 'WA', 'Australia'),
  state('South Australia', 'SA', 'Australia'),
  state('Tasmania', 'TAS', 'Australia'),
  state('Australian Capital Territory', 'ACT', 'Australia'),
  state('Northern Territory', 'NT', 'Australia'),

  // ============================================
  // INDIA
  // ============================================
  state('Andhra Pradesh', 'AP', 'India'),
  state('Arunachal Pradesh', 'AR', 'India'),
  state('Assam', 'AS', 'India'),
  state('Bihar', 'BR', 'India'),
  state('Chhattisgarh', 'CG', 'India'),
  state('Goa', 'GA', 'India'),
  state('Gujarat', 'GJ', 'India'),
  state('Haryana', 'HR', 'India'),
  state('Himachal Pradesh', 'HP', 'India'),
  state('Jharkhand', 'JH', 'India'),
  state('Karnataka', 'KA', 'India'),
  state('Kerala', 'KL', 'India'),
  state('Madhya Pradesh', 'MP', 'India'),
  state('Maharashtra', 'MH', 'India'),
  state('Manipur', 'MN', 'India'),
  state('Meghalaya', 'ML', 'India'),
  state('Mizoram', 'MZ', 'India'),
  state('Nagaland', 'NL', 'India'),
  state('Odisha', 'OD', 'India', ['Orissa']),
  state('Punjab', 'PB', 'India'),
  state('Rajasthan', 'RJ', 'India'),
  state('Sikkim', 'SK', 'India'),
  state('Tamil Nadu', 'TN', 'India'),
  state('Telangana', 'TS', 'India'),
  state('Tripura', 'TR', 'India'),
  state('Uttar Pradesh', 'UP', 'India'),
  state('Uttarakhand', 'UK', 'India'),
  state('West Bengal', 'WB', 'India'),
  // Union Territories
  state('Delhi', 'DL', 'India', ['New Delhi', 'NCR']),
  state('Chandigarh', 'CH', 'India'),
  state('Puducherry', 'PY', 'India', ['Pondicherry']),

  // ============================================
  // BRAZIL
  // ============================================
  state('Acre', 'AC', 'Brazil'),
  state('Alagoas', 'AL', 'Brazil'),
  state('Amapá', 'AP', 'Brazil'),
  state('Amazonas', 'AM', 'Brazil'),
  state('Bahia', 'BA', 'Brazil'),
  state('Ceará', 'CE', 'Brazil'),
  state('Espírito Santo', 'ES', 'Brazil'),
  state('Goiás', 'GO', 'Brazil'),
  state('Maranhão', 'MA', 'Brazil'),
  state('Mato Grosso', 'MT', 'Brazil'),
  state('Mato Grosso do Sul', 'MS', 'Brazil'),
  state('Minas Gerais', 'MG', 'Brazil'),
  state('Pará', 'PA', 'Brazil'),
  state('Paraíba', 'PB', 'Brazil'),
  state('Paraná', 'PR', 'Brazil'),
  state('Pernambuco', 'PE', 'Brazil'),
  state('Piauí', 'PI', 'Brazil'),
  state('Rio de Janeiro', 'RJ', 'Brazil'),
  state('Rio Grande do Norte', 'RN', 'Brazil'),
  state('Rio Grande do Sul', 'RS', 'Brazil'),
  state('Rondônia', 'RO', 'Brazil'),
  state('Roraima', 'RR', 'Brazil'),
  state('Santa Catarina', 'SC', 'Brazil'),
  state('São Paulo', 'SP', 'Brazil'),
  state('Sergipe', 'SE', 'Brazil'),
  state('Tocantins', 'TO', 'Brazil'),
  state('Distrito Federal', 'DF', 'Brazil'),

  // ============================================
  // GERMANY (Bundesländer)
  // ============================================
  state('Baden-Württemberg', 'BW', 'Germany'),
  state('Bavaria', 'BY', 'Germany', ['Bayern']),
  state('Berlin', 'BE', 'Germany'),
  state('Brandenburg', 'BB', 'Germany'),
  state('Bremen', 'HB', 'Germany'),
  state('Hamburg', 'HH', 'Germany'),
  state('Hesse', 'HE', 'Germany', ['Hessen']),
  state('Lower Saxony', 'NI', 'Germany', ['Niedersachsen']),
  state('Mecklenburg-Vorpommern', 'MV', 'Germany'),
  state('North Rhine-Westphalia', 'NW', 'Germany', ['Nordrhein-Westfalen', 'NRW']),
  state('Rhineland-Palatinate', 'RP', 'Germany', ['Rheinland-Pfalz']),
  state('Saarland', 'SL', 'Germany'),
  state('Saxony', 'SN', 'Germany', ['Sachsen']),
  state('Saxony-Anhalt', 'ST', 'Germany', ['Sachsen-Anhalt']),
  state('Schleswig-Holstein', 'SH', 'Germany'),
  state('Thuringia', 'TH', 'Germany', ['Thüringen']),

  // ============================================
  // CHINA (Provinces)
  // ============================================
  state('Anhui', 'AH', 'China', ['安徽']),
  state('Beijing', 'BJ', 'China', ['北京']),
  state('Chongqing', 'CQ', 'China', ['重庆']),
  state('Fujian', 'FJ', 'China', ['福建']),
  state('Gansu', 'GS', 'China', ['甘肃']),
  state('Guangdong', 'GD', 'China', ['广东']),
  state('Guangxi', 'GX', 'China', ['广西']),
  state('Guizhou', 'GZ', 'China', ['贵州']),
  state('Hainan', 'HI', 'China', ['海南']),
  state('Hebei', 'HE', 'China', ['河北']),
  state('Heilongjiang', 'HL', 'China', ['黑龙江']),
  state('Henan', 'HA', 'China', ['河南']),
  state('Hubei', 'HB', 'China', ['湖北']),
  state('Hunan', 'HN', 'China', ['湖南']),
  state('Inner Mongolia', 'NM', 'China', ['内蒙古']),
  state('Jiangsu', 'JS', 'China', ['江苏']),
  state('Jiangxi', 'JX', 'China', ['江西']),
  state('Jilin', 'JL', 'China', ['吉林']),
  state('Liaoning', 'LN', 'China', ['辽宁']),
  state('Ningxia', 'NX', 'China', ['宁夏']),
  state('Qinghai', 'QH', 'China', ['青海']),
  state('Shaanxi', 'SN', 'China', ['陕西']),
  state('Shandong', 'SD', 'China', ['山东']),
  state('Shanghai', 'SH', 'China', ['上海']),
  state('Shanxi', 'SX', 'China', ['山西']),
  state('Sichuan', 'SC', 'China', ['四川']),
  state('Tianjin', 'TJ', 'China', ['天津']),
  state('Tibet', 'XZ', 'China', ['西藏', 'Xizang']),
  state('Xinjiang', 'XJ', 'China', ['新疆']),
  state('Yunnan', 'YN', 'China', ['云南']),
  state('Zhejiang', 'ZJ', 'China', ['浙江']),

  // ============================================
  // JAPAN (Prefectures - major ones)
  // ============================================
  state('Tokyo', 'TK', 'Japan', ['東京都', '東京']),
  state('Osaka', 'OS', 'Japan', ['大阪府', '大阪']),
  state('Kyoto', 'KT', 'Japan', ['京都府', '京都']),
  state('Hokkaido', 'HK', 'Japan', ['北海道']),
  state('Aichi', 'AI', 'Japan', ['愛知県', '愛知']),
  state('Fukuoka', 'FK', 'Japan', ['福岡県', '福岡']),
  state('Kanagawa', 'KN', 'Japan', ['神奈川県', '神奈川']),
  state('Saitama', 'ST', 'Japan', ['埼玉県', '埼玉']),
  state('Chiba', 'CB', 'Japan', ['千葉県', '千葉']),
  state('Hyogo', 'HG', 'Japan', ['兵庫県', '兵庫']),

  // ============================================
  // UNITED KINGDOM
  // ============================================
  state('England', 'ENG', 'United Kingdom'),
  state('Scotland', 'SCT', 'United Kingdom'),
  state('Wales', 'WLS', 'United Kingdom'),
  state('Northern Ireland', 'NIR', 'United Kingdom'),
  // Major regions/counties
  state('Greater London', 'LDN', 'United Kingdom', ['London']),
  state('Greater Manchester', 'MAN', 'United Kingdom', ['Manchester']),
  state('West Midlands', 'WMD', 'United Kingdom'),
  state('West Yorkshire', 'WYK', 'United Kingdom'),
  state('Kent', 'KEN', 'United Kingdom'),
  state('Essex', 'ESS', 'United Kingdom'),
  state('Lancashire', 'LAN', 'United Kingdom'),
  state('Hampshire', 'HAM', 'United Kingdom'),
  state('Surrey', 'SRY', 'United Kingdom'),

  // ============================================
  // MEXICO (States)
  // ============================================
  state('Aguascalientes', 'AGS', 'Mexico'),
  state('Baja California', 'BC', 'Mexico'),
  state('Baja California Sur', 'BCS', 'Mexico'),
  state('Campeche', 'CAM', 'Mexico'),
  state('Chiapas', 'CHP', 'Mexico'),
  state('Chihuahua', 'CHI', 'Mexico'),
  state('Coahuila', 'COA', 'Mexico'),
  state('Colima', 'COL', 'Mexico'),
  state('Durango', 'DGO', 'Mexico'),
  state('Guanajuato', 'GTO', 'Mexico'),
  state('Guerrero', 'GRO', 'Mexico'),
  state('Hidalgo', 'HGO', 'Mexico'),
  state('Jalisco', 'JAL', 'Mexico'),
  state('Mexico City', 'CDMX', 'Mexico', ['Ciudad de México', 'DF']),
  state('Mexico State', 'MEX', 'Mexico', ['Estado de México']),
  state('Michoacán', 'MIC', 'Mexico'),
  state('Morelos', 'MOR', 'Mexico'),
  state('Nayarit', 'NAY', 'Mexico'),
  state('Nuevo León', 'NLE', 'Mexico'),
  state('Oaxaca', 'OAX', 'Mexico'),
  state('Puebla', 'PUE', 'Mexico'),
  state('Querétaro', 'QRO', 'Mexico'),
  state('Quintana Roo', 'ROO', 'Mexico'),
  state('San Luis Potosí', 'SLP', 'Mexico'),
  state('Sinaloa', 'SIN', 'Mexico'),
  state('Sonora', 'SON', 'Mexico'),
  state('Tabasco', 'TAB', 'Mexico'),
  state('Tamaulipas', 'TAM', 'Mexico'),
  state('Tlaxcala', 'TLA', 'Mexico'),
  state('Veracruz', 'VER', 'Mexico'),
  state('Yucatán', 'YUC', 'Mexico'),
  state('Zacatecas', 'ZAC', 'Mexico'),

  // ============================================
  // SPAIN (Autonomous Communities)
  // ============================================
  state('Andalusia', 'AN', 'Spain', ['Andalucía']),
  state('Aragon', 'AR', 'Spain', ['Aragón']),
  state('Asturias', 'AS', 'Spain'),
  state('Balearic Islands', 'IB', 'Spain', ['Islas Baleares', 'Illes Balears']),
  state('Basque Country', 'PV', 'Spain', ['País Vasco', 'Euskadi']),
  state('Canary Islands', 'CN', 'Spain', ['Islas Canarias']),
  state('Cantabria', 'CB', 'Spain'),
  state('Castile and León', 'CL', 'Spain', ['Castilla y León']),
  state('Castilla-La Mancha', 'CM', 'Spain'),
  state('Catalonia', 'CT', 'Spain', ['Cataluña', 'Catalunya']),
  state('Extremadura', 'EX', 'Spain'),
  state('Galicia', 'GA', 'Spain'),
  state('La Rioja', 'RI', 'Spain'),
  state('Community of Madrid', 'MD', 'Spain', ['Madrid']),
  state('Region of Murcia', 'MC', 'Spain', ['Murcia']),
  state('Navarre', 'NC', 'Spain', ['Navarra']),
  state('Valencian Community', 'VC', 'Spain', ['Comunidad Valenciana', 'Valencia']),

  // ============================================
  // FRANCE (Regions)
  // ============================================
  state('Auvergne-Rhône-Alpes', 'ARA', 'France'),
  state('Bourgogne-Franche-Comté', 'BFC', 'France'),
  state('Brittany', 'BRE', 'France', ['Bretagne']),
  state('Centre-Val de Loire', 'CVL', 'France'),
  state('Corsica', 'COR', 'France', ['Corse']),
  state('Grand Est', 'GES', 'France'),
  state('Hauts-de-France', 'HDF', 'France'),
  state('Île-de-France', 'IDF', 'France', ['Paris Region']),
  state('Normandy', 'NOR', 'France', ['Normandie']),
  state('Nouvelle-Aquitaine', 'NAQ', 'France'),
  state('Occitanie', 'OCC', 'France'),
  state('Pays de la Loire', 'PDL', 'France'),
  state("Provence-Alpes-Côte d'Azur", 'PAC', 'France', ['PACA']),

  // ============================================
  // ITALY (Regions)
  // ============================================
  state('Abruzzo', 'ABR', 'Italy'),
  state('Aosta Valley', 'VDA', 'Italy', ["Valle d'Aosta"]),
  state('Apulia', 'PUG', 'Italy', ['Puglia']),
  state('Basilicata', 'BAS', 'Italy'),
  state('Calabria', 'CAL', 'Italy'),
  state('Campania', 'CAM', 'Italy'),
  state('Emilia-Romagna', 'EMR', 'Italy'),
  state('Friuli-Venezia Giulia', 'FVG', 'Italy'),
  state('Lazio', 'LAZ', 'Italy'),
  state('Liguria', 'LIG', 'Italy'),
  state('Lombardy', 'LOM', 'Italy', ['Lombardia']),
  state('Marche', 'MAR', 'Italy'),
  state('Molise', 'MOL', 'Italy'),
  state('Piedmont', 'PIE', 'Italy', ['Piemonte']),
  state('Sardinia', 'SAR', 'Italy', ['Sardegna']),
  state('Sicily', 'SIC', 'Italy', ['Sicilia']),
  state('Trentino-Alto Adige', 'TAA', 'Italy'),
  state('Tuscany', 'TOS', 'Italy', ['Toscana']),
  state('Umbria', 'UMB', 'Italy'),
  state('Veneto', 'VEN', 'Italy'),

  // ============================================
  // UAE (Emirates)
  // ============================================
  state('Abu Dhabi', 'AUH', 'United Arab Emirates', ['أبو ظبي']),
  state('Dubai', 'DXB', 'United Arab Emirates', ['دبي']),
  state('Sharjah', 'SHJ', 'United Arab Emirates', ['الشارقة']),
  state('Ajman', 'AJM', 'United Arab Emirates', ['عجمان']),
  state('Umm Al Quwain', 'UAQ', 'United Arab Emirates', ['أم القيوين']),
  state('Ras Al Khaimah', 'RAK', 'United Arab Emirates', ['رأس الخيمة']),
  state('Fujairah', 'FUJ', 'United Arab Emirates', ['الفجيرة']),

  // ============================================
  // SAUDI ARABIA (Regions)
  // ============================================
  state('Riyadh Region', 'RIY', 'Saudi Arabia', ['منطقة الرياض']),
  state('Makkah Region', 'MKH', 'Saudi Arabia', ['منطقة مكة المكرمة', 'Mecca Region']),
  state('Madinah Region', 'MDN', 'Saudi Arabia', ['منطقة المدينة المنورة', 'Medina Region']),
  state('Eastern Province', 'ESH', 'Saudi Arabia', ['المنطقة الشرقية']),
  state('Asir Region', 'ASR', 'Saudi Arabia', ['منطقة عسير']),
  state('Tabuk Region', 'TBK', 'Saudi Arabia', ['منطقة تبوك']),
  state("Ha'il Region", 'HAL', 'Saudi Arabia', ['منطقة حائل']),
  state('Northern Borders Region', 'NBO', 'Saudi Arabia', ['منطقة الحدود الشمالية']),
  state('Jazan Region', 'JZN', 'Saudi Arabia', ['منطقة جازان']),
  state('Najran Region', 'NJR', 'Saudi Arabia', ['منطقة نجران']),
  state('Al-Baha Region', 'BAH', 'Saudi Arabia', ['منطقة الباحة']),
  state('Al-Jouf Region', 'JOF', 'Saudi Arabia', ['منطقة الجوف']),
  state('Qassim Region', 'QSM', 'Saudi Arabia', ['منطقة القصيم']),

  // ============================================
  // THAILAND (Regions/Major Provinces)
  // ============================================
  state('Bangkok', 'BKK', 'Thailand', ['กรุงเทพมหานคร']),
  state('Chiang Mai', 'CNX', 'Thailand', ['เชียงใหม่']),
  state('Phuket', 'HKT', 'Thailand', ['ภูเก็ต']),
  state('Chonburi', 'CBI', 'Thailand', ['ชลบุรี']),
  state('Nonthaburi', 'NBI', 'Thailand', ['นนทบุรี']),
  state('Pathum Thani', 'PTN', 'Thailand', ['ปทุมธานี']),
  state('Samut Prakan', 'SPK', 'Thailand', ['สมุทรปราการ']),
  state('Krabi', 'KBI', 'Thailand', ['กระบี่']),

  // ============================================
  // SOUTH KOREA (Provinces)
  // ============================================
  state('Seoul', 'SEO', 'South Korea', ['서울특별시', '서울']),
  state('Busan', 'BUS', 'South Korea', ['부산광역시', '부산']),
  state('Incheon', 'INC', 'South Korea', ['인천광역시', '인천']),
  state('Daegu', 'DAG', 'South Korea', ['대구광역시', '대구']),
  state('Daejeon', 'DJN', 'South Korea', ['대전광역시', '대전']),
  state('Gwangju', 'GWJ', 'South Korea', ['광주광역시', '광주']),
  state('Ulsan', 'ULS', 'South Korea', ['울산광역시', '울산']),
  state('Gyeonggi', 'GGI', 'South Korea', ['경기도', '경기']),
  state('Gangwon', 'GAN', 'South Korea', ['강원도', '강원']),
  state('North Chungcheong', 'NCH', 'South Korea', ['충청북도']),
  state('South Chungcheong', 'SCH', 'South Korea', ['충청남도']),
  state('North Jeolla', 'NJL', 'South Korea', ['전라북도']),
  state('South Jeolla', 'SJL', 'South Korea', ['전라남도']),
  state('North Gyeongsang', 'NGS', 'South Korea', ['경상북도']),
  state('South Gyeongsang', 'SGS', 'South Korea', ['경상남도']),
  state('Jeju', 'JEJ', 'South Korea', ['제주특별자치도', '제주']),

  // ============================================
  // INDONESIA (Major Provinces)
  // ============================================
  state('Jakarta', 'JKT', 'Indonesia', ['DKI Jakarta']),
  state('West Java', 'JBR', 'Indonesia', ['Jawa Barat']),
  state('Central Java', 'JTG', 'Indonesia', ['Jawa Tengah']),
  state('East Java', 'JTM', 'Indonesia', ['Jawa Timur']),
  state('Bali', 'BAL', 'Indonesia'),
  state('North Sumatra', 'SMU', 'Indonesia', ['Sumatera Utara']),
  state('South Sulawesi', 'SLS', 'Indonesia', ['Sulawesi Selatan']),
  state('Yogyakarta', 'YOG', 'Indonesia', ['DIY Yogyakarta']),

  // ============================================
  // MALAYSIA (States)
  // ============================================
  state('Kuala Lumpur', 'KUL', 'Malaysia'),
  state('Selangor', 'SGR', 'Malaysia'),
  state('Penang', 'PNG', 'Malaysia', ['Pulau Pinang']),
  state('Johor', 'JHR', 'Malaysia'),
  state('Perak', 'PRK', 'Malaysia'),
  state('Sabah', 'SBH', 'Malaysia'),
  state('Sarawak', 'SWK', 'Malaysia'),
  state('Kedah', 'KDH', 'Malaysia'),
  state('Kelantan', 'KTN', 'Malaysia'),
  state('Malacca', 'MLK', 'Malaysia', ['Melaka']),
  state('Negeri Sembilan', 'NSN', 'Malaysia'),
  state('Pahang', 'PHG', 'Malaysia'),
  state('Perlis', 'PLS', 'Malaysia'),
  state('Terengganu', 'TRG', 'Malaysia'),
  state('Labuan', 'LBN', 'Malaysia'),
  state('Putrajaya', 'PJY', 'Malaysia'),

  // ============================================
  // PHILIPPINES (Regions - Major ones)
  // ============================================
  state('Metro Manila', 'NCR', 'Philippines', ['National Capital Region']),
  state('Calabarzon', 'CAL', 'Philippines', ['Region IV-A']),
  state('Central Luzon', 'CLU', 'Philippines', ['Region III']),
  state('Central Visayas', 'CVS', 'Philippines', ['Region VII']),
  state('Western Visayas', 'WVS', 'Philippines', ['Region VI']),
  state('Davao Region', 'DVR', 'Philippines', ['Region XI']),
  state('Northern Mindanao', 'NMD', 'Philippines', ['Region X']),
  state('Ilocos Region', 'ILO', 'Philippines', ['Region I']),
  state('Cordillera', 'CAR', 'Philippines', ['CAR']),

  // ============================================
  // SOUTH AFRICA (Provinces)
  // ============================================
  state('Gauteng', 'GP', 'South Africa'),
  state('Western Cape', 'WC', 'South Africa'),
  state('KwaZulu-Natal', 'KZN', 'South Africa'),
  state('Eastern Cape', 'EC', 'South Africa'),
  state('Free State', 'FS', 'South Africa'),
  state('Limpopo', 'LP', 'South Africa'),
  state('Mpumalanga', 'MP', 'South Africa'),
  state('North West', 'NW', 'South Africa'),
  state('Northern Cape', 'NC', 'South Africa'),

  // ============================================
  // NIGERIA (States - Major ones)
  // ============================================
  state('Lagos', 'LA', 'Nigeria'),
  state('Abuja', 'FC', 'Nigeria', ['FCT', 'Federal Capital Territory']),
  state('Rivers', 'RI', 'Nigeria'),
  state('Kano', 'KN', 'Nigeria'),
  state('Oyo', 'OY', 'Nigeria'),
  state('Kaduna', 'KD', 'Nigeria'),
  state('Delta', 'DE', 'Nigeria'),
  state('Ogun', 'OG', 'Nigeria'),
  state('Anambra', 'AN', 'Nigeria'),
  state('Enugu', 'EN', 'Nigeria'),

  // ============================================
  // RUSSIA (Federal Subjects - Major ones)
  // ============================================
  state('Moscow', 'MOW', 'Russia', ['Москва']),
  state('Moscow Oblast', 'MOS', 'Russia', ['Московская область']),
  state('Saint Petersburg', 'SPE', 'Russia', ['Санкт-Петербург']),
  state('Leningrad Oblast', 'LEN', 'Russia', ['Ленинградская область']),
  state('Novosibirsk Oblast', 'NVS', 'Russia', ['Новосибирская область']),
  state('Sverdlovsk Oblast', 'SVE', 'Russia', ['Свердловская область']),
  state('Tatarstan', 'TA', 'Russia', ['Татарстан']),
  state('Krasnodar Krai', 'KDA', 'Russia', ['Краснодарский край']),
];

// Build lookup maps for efficient access
export const STATE_BY_ALIAS: Map<string, StateData> = new Map();
export const STATE_BY_CODE: Map<string, StateData> = new Map();
export const STATES_BY_COUNTRY: Map<string, StateData[]> = new Map();

// Initialize lookup maps
for (const state of STATES_PROVINCES) {
  STATE_BY_CODE.set(state.code.toUpperCase(), state);

  for (const alias of state.aliases) {
    STATE_BY_ALIAS.set(alias.toLowerCase(), state);
  }

  // Group states by country
  const existing = STATES_BY_COUNTRY.get(state.country) || [];
  existing.push(state);
  STATES_BY_COUNTRY.set(state.country, existing);
}

/**
 * Look up a state/province by any of its names or codes (case-insensitive)
 */
export function findState(name: string): StateData | undefined {
  // Try exact code match first (uppercase)
  const byCode = STATE_BY_CODE.get(name.toUpperCase());
  if (byCode) return byCode;

  // Then try alias match (lowercase)
  return STATE_BY_ALIAS.get(name.toLowerCase());
}

/**
 * Get all states/provinces for a specific country
 */
export function getStatesForCountry(country: string): StateData[] {
  return STATES_BY_COUNTRY.get(country) || [];
}
