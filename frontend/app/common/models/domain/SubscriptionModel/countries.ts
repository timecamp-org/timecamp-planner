import { Dict } from 'common/types';
import { Map, List } from 'immutable';
import { Country, CountryState } from './types';

function compareByName(objectA: Country, objectB: Country): number {
  if (objectA.name === objectB.name) {
    return 0;
  }
  if (objectA.name < objectB.name) {
    return -1;
  }
  return 1;
}

const UsStates: Record<string, CountryState> = {
  //TODO sort etc
  AL: {
    name: 'Alabama',
  },
  AK: {
    name: 'Alaska',
  },
  AZ: {
    name: 'Arizona',
  },
  AR: {
    name: 'Arkansas',
  },
  CA: {
    name: 'California',
  },
  CO: {
    name: 'Colorado',
  },
  CT: {
    name: 'Connecticut',
  },
  DE: {
    name: 'Delaware',
  },
  DC: {
    name: 'District Of Columbia',
  },
  FL: {
    name: 'Florida',
  },
  GA: {
    name: 'Georgia',
  },
  HI: {
    name: 'Hawaii',
  },
  ID: {
    name: 'Idaho',
  },
  IL: {
    name: 'Illinois',
  },
  IN: {
    name: 'Indiana',
  },
  IA: {
    name: 'Iowa',
  },
  KS: {
    name: 'Kansas',
  },
  KY: {
    name: 'Kentucky',
  },
  LA: {
    name: 'Louisiana',
  },
  ME: {
    name: 'Maine',
  },
  MD: {
    name: 'Maryland',
  },
  MA: {
    name: 'Massachusetts',
  },
  MI: {
    name: 'Michigan',
  },
  MN: {
    name: 'Minnesota',
  },
  MS: {
    name: 'Mississippi',
  },
  MO: {
    name: 'Missouri',
  },
  MT: {
    name: 'Montana',
  },
  NE: {
    name: 'Nebraska',
  },
  NV: {
    name: 'Nevada',
  },
  NH: {
    name: 'New Hampshire',
  },
  NJ: {
    name: 'New Jersey',
  },
  NM: {
    name: 'New Mexico',
  },
  NY: {
    name: 'New York',
  },
  NC: {
    name: 'North Carolina',
  },
  ND: {
    name: 'North Dakota',
  },
  OH: {
    name: 'Ohio',
  },
  OK: {
    name: 'Oklahoma',
  },
  OR: {
    name: 'Oregon',
  },
  PA: {
    name: 'Pennsylvania',
  },
  RI: {
    name: 'Rhode Island',
  },
  SC: {
    name: 'South Carolina',
  },
  SD: {
    name: 'South Dakota',
  },
  TN: {
    name: 'Tennessee',
  },
  TX: {
    name: 'Texas',
  },
  UT: {
    name: 'Utah',
  },
  VT: {
    name: 'Vermont',
  },
  VA: {
    name: 'Virginia',
  },
  WA: {
    name: 'Washington',
  },
  WV: {
    name: 'West Virginia',
  },
  WI: {
    name: 'Wisconsin',
  },
  WY: {
    name: 'Wyoming',
  },
};

let countries: Dict<Country> = {
  AF: {
    name: 'Afghanistan',
    isEu: false,
  },
  AL: {
    name: 'Albania',
    isEu: false,
  },
  AX: {
    name: 'Åland Islands',
    isEu: false,
  },
  DZ: {
    name: 'Algeria',
    isEu: false,
  },
  AS: {
    name: 'American Samoa',
    isEu: false,
  },
  AD: {
    name: 'Andorra',
    isEu: false,
  },
  AO: {
    name: 'Angola',
    isEu: false,
  },
  AI: {
    name: 'Anguilla',
    isEu: false,
  },
  AQ: {
    name: 'Antarctica',
    isEu: false,
  },
  AG: {
    name: 'Antigua and Barbuda',
    isEu: false,
  },
  AR: {
    name: 'Argentina',
    isEu: false,
  },
  AM: {
    name: 'Armenia',
    isEu: false,
  },
  AW: {
    name: 'Aruba',
    isEu: false,
  },
  AU: {
    name: 'Australia',
    isEu: false,
  },
  AT: {
    name: 'Austria',
    isEu: false,
  },
  AZ: {
    name: 'Azerbaijan',
    isEu: false,
  },
  BS: {
    name: 'Bahamas',
    isEu: false,
  },
  BH: {
    name: 'Bahrain',
    isEu: false,
  },
  BD: {
    name: 'Bangladesh',
    isEu: false,
  },
  BB: {
    name: 'Barbados',
    isEu: false,
  },
  BY: {
    name: 'Belarus',
    isEu: false,
  },
  BE: {
    name: 'Belgium',
    isEu: false,
  },
  BZ: {
    name: 'Belize',
    isEu: false,
  },
  BJ: {
    name: 'Benin',
    isEu: false,
  },
  BM: {
    name: 'Bermuda',
    isEu: false,
  },
  BT: {
    name: 'Bhutan',
    isEu: false,
  },
  BO: {
    name: 'Bolivia',
    isEu: false,
  },
  BA: {
    name: 'Bosnia and Herzegovina',
    isEu: false,
  },
  BW: {
    name: 'Botswana',
    isEu: false,
  },
  BV: {
    name: 'Bouvet Island',
    isEu: false,
  },
  BR: {
    name: 'Brazil',
    isEu: false,
  },
  BQ: {
    name: 'British Antarctic Territory',
    isEu: false,
  },
  IO: {
    name: 'British Indian Ocean Territory',
    isEu: false,
  },
  VG: {
    name: 'British Virgin Islands',
    isEu: false,
  },
  BN: {
    name: 'Brunei',
    isEu: false,
  },
  BG: {
    name: 'Bulgaria',
    isEu: false,
  },
  BF: {
    name: 'Burkina Faso',
    isEu: false,
  },
  BI: {
    name: 'Burundi',
    isEu: false,
  },
  KH: {
    name: 'Cambodia',
    isEu: false,
  },
  CM: {
    name: 'Cameroon',
    isEu: false,
  },
  CA: {
    name: 'Canada',
    isEu: false,
    states: {
      AB: {
        name: 'Alberta',
      },
      BC: {
        name: 'British Columbia',
      },
      MB: {
        name: 'Manitoba',
      },
      NB: {
        name: 'New Brunswick',
      },
      NL: {
        name: 'Newfoundland and Labrador',
      },
      NS: {
        name: 'Nova Scotia',
      },
      ON: {
        name: 'Ontario',
      },
      PE: {
        name: 'Prince Edward Island',
      },
      QC: {
        name: 'Quebec',
      },
      SK: {
        name: 'Saskatchewan',
      },
      NT: {
        name: 'Northwest Territories',
      },
      NU: {
        name: 'Nunavut',
      },
      YT: {
        name: 'Yuko',
      },
    },
  },
  CT: {
    name: 'Canton and Enderbury Islands',
    isEu: false,
  },
  CV: {
    name: 'Cape Verde',
    isEu: false,
  },
  KY: {
    name: 'Cayman Islands',
    isEu: false,
  },
  CF: {
    name: 'Central African Republic',
    isEu: false,
  },
  TD: {
    name: 'Chad',
    isEu: false,
  },
  CL: {
    name: 'Chile',
    isEu: false,
  },
  CN: {
    name: 'China',
    isEu: false,
  },
  CX: {
    name: 'Christmas Island',
    isEu: false,
  },
  CC: {
    name: 'Cocos [Keeling] Islands',
    isEu: false,
  },
  CO: {
    name: 'Colombia',
    isEu: false,
  },
  KM: {
    name: 'Comoros',
    isEu: false,
  },
  CG: {
    name: 'Congo - Brazzaville',
    isEu: false,
  },
  CD: {
    name: 'Congo - Kinshasa',
    isEu: false,
  },
  CK: {
    name: 'Cook Islands',
    isEu: false,
  },
  CR: {
    name: 'Costa Rica',
    isEu: false,
  },
  HR: {
    name: 'Croatia',
    isEu: false,
  },
  CU: {
    name: 'Cuba',
    isEu: false,
  },
  CY: {
    name: 'Cyprus',
    isEu: false,
  },
  CZ: {
    name: 'Czech Republic',
    isEu: false,
  },
  CI: {
    name: 'Côte d’Ivoire',
    isEu: false,
  },
  DK: {
    name: 'Denmark',
    isEu: false,
  },
  DJ: {
    name: 'Djibouti',
    isEu: false,
  },
  DM: {
    name: 'Dominica',
    isEu: false,
  },
  DO: {
    name: 'Dominican Republic',
    isEu: false,
  },
  NQ: {
    name: 'Dronning Maud Land',
    isEu: false,
  },
  DD: {
    name: 'East Germany',
    isEu: false,
  },
  EC: {
    name: 'Ecuador',
    isEu: false,
  },
  EG: {
    name: 'Egypt',
    isEu: false,
  },
  SV: {
    name: 'El Salvador',
    isEu: false,
  },
  GQ: {
    name: 'Equatorial Guinea',
    isEu: false,
  },
  ER: {
    name: 'Eritrea',
    isEu: false,
  },
  EE: {
    name: 'Estonia',
    isEu: false,
  },
  ET: {
    name: 'Ethiopia',
    isEu: false,
  },
  FK: {
    name: 'Falkland Islands',
    isEu: false,
  },
  FO: {
    name: 'Faroe Islands',
    isEu: false,
  },
  FJ: {
    name: 'Fiji',
    isEu: false,
  },
  FI: {
    name: 'Finland',
    isEu: false,
  },
  FR: {
    name: 'France',
    isEu: false,
  },
  GF: {
    name: 'French Guiana',
    isEu: false,
  },
  PF: {
    name: 'French Polynesia',
    isEu: false,
  },
  TF: {
    name: 'French Southern Territories',
    isEu: false,
  },
  FQ: {
    name: 'French Southern and Antarctic Territories',
    isEu: false,
  },
  GA: {
    name: 'Gabon',
    isEu: false,
  },
  GM: {
    name: 'Gambia',
    isEu: false,
  },
  GE: {
    name: 'Georgia',
    isEu: false,
  },
  DE: {
    name: 'Germany',
    isEu: false,
  },
  GH: {
    name: 'Ghana',
    isEu: false,
  },
  GI: {
    name: 'Gibraltar',
    isEu: false,
  },
  GR: {
    name: 'Greece',
    isEu: false,
  },
  GL: {
    name: 'Greenland',
    isEu: false,
  },
  GD: {
    name: 'Grenada',
    isEu: false,
  },
  GP: {
    name: 'Guadeloupe',
    isEu: false,
  },
  GU: {
    name: 'Guam',
    isEu: false,
  },
  GT: {
    name: 'Guatemala',
    isEu: false,
  },
  GG: {
    name: 'Guernsey',
    isEu: false,
  },
  GN: {
    name: 'Guinea',
    isEu: false,
  },
  GW: {
    name: 'Guinea-Bissau',
    isEu: false,
  },
  GY: {
    name: 'Guyana',
    isEu: false,
  },
  HT: {
    name: 'Haiti',
    isEu: false,
  },
  HM: {
    name: 'Heard Island and McDonald Islands',
    isEu: false,
  },
  HN: {
    name: 'Honduras',
    isEu: false,
  },
  HK: {
    name: 'Hong Kong SAR China',
    isEu: false,
  },
  HU: {
    name: 'Hungary',
    isEu: false,
  },
  IS: {
    name: 'Iceland',
    isEu: false,
  },
  IN: {
    name: 'India',
    isEu: false,
  },
  ID: {
    name: 'Indonesia',
    isEu: false,
  },
  IR: {
    name: 'Iran',
    isEu: false,
  },
  IQ: {
    name: 'Iraq',
    isEu: false,
  },
  IE: {
    name: 'Ireland',
    isEu: false,
  },
  IM: {
    name: 'Isle of Man',
    isEu: false,
  },
  IL: {
    name: 'Israel',
    isEu: false,
  },
  IT: {
    name: 'Italy',
    isEu: false,
  },
  JM: {
    name: 'Jamaica',
    isEu: false,
  },
  JP: {
    name: 'Japan',
    isEu: false,
  },
  JE: {
    name: 'Jersey',
    isEu: false,
  },
  JT: {
    name: 'Johnston Island',
    isEu: false,
  },
  JO: {
    name: 'Jordan',
    isEu: false,
  },
  KZ: {
    name: 'Kazakhstan',
    isEu: false,
  },
  KE: {
    name: 'Kenya',
    isEu: false,
  },
  KI: {
    name: 'Kiribati',
    isEu: false,
  },
  KW: {
    name: 'Kuwait',
    isEu: false,
  },
  KG: {
    name: 'Kyrgyzstan',
    isEu: false,
  },
  LA: {
    name: 'Laos',
    isEu: false,
  },
  LV: {
    name: 'Latvia',
    isEu: false,
  },
  LB: {
    name: 'Lebanon',
    isEu: false,
  },
  LS: {
    name: 'Lesotho',
    isEu: false,
  },
  LR: {
    name: 'Liberia',
    isEu: false,
  },
  LY: {
    name: 'Libya',
    isEu: false,
  },
  LI: {
    name: 'Liechtenstein',
    isEu: false,
  },
  LT: {
    name: 'Lithuania',
    isEu: false,
  },
  LU: {
    name: 'Luxembourg',
    isEu: false,
  },
  MO: {
    name: 'Macau SAR China',
    isEu: false,
  },
  MK: {
    name: 'Macedonia',
    isEu: false,
  },
  MG: {
    name: 'Madagascar',
    isEu: false,
  },
  MW: {
    name: 'Malawi',
    isEu: false,
  },
  MY: {
    name: 'Malaysia',
    isEu: false,
  },
  MV: {
    name: 'Maldives',
    isEu: false,
  },
  ML: {
    name: 'Mali',
    isEu: false,
  },
  MT: {
    name: 'Malta',
    isEu: false,
  },
  MH: {
    name: 'Marshall Islands',
    isEu: false,
  },
  MQ: {
    name: 'Martinique',
    isEu: false,
  },
  MR: {
    name: 'Mauritania',
    isEu: false,
  },
  MU: {
    name: 'Mauritius',
    isEu: false,
  },
  YT: {
    name: 'Mayotte',
    isEu: false,
  },
  FX: {
    name: 'Metropolitan France',
    isEu: false,
  },
  MX: {
    name: 'Mexico',
    isEu: false,
  },
  FM: {
    name: 'Micronesia',
    isEu: false,
  },
  MI: {
    name: 'Midway Islands',
    isEu: false,
  },
  MD: {
    name: 'Moldova',
    isEu: false,
  },
  MC: {
    name: 'Monaco',
    isEu: false,
  },
  MN: {
    name: 'Mongolia',
    isEu: false,
  },
  ME: {
    name: 'Montenegro',
    isEu: false,
  },
  MS: {
    name: 'Montserrat',
    isEu: false,
  },
  MA: {
    name: 'Morocco',
    isEu: false,
  },
  MZ: {
    name: 'Mozambique',
    isEu: false,
  },
  MM: {
    name: 'Myanmar [Burma]',
    isEu: false,
  },
  NA: {
    name: 'Namibia',
    isEu: false,
  },
  NR: {
    name: 'Nauru',
    isEu: false,
  },
  NP: {
    name: 'Nepal',
    isEu: false,
  },
  NL: {
    name: 'Netherlands',
    isEu: false,
  },
  AN: {
    name: 'Netherlands Antilles',
    isEu: false,
  },
  NT: {
    name: 'Neutral Zone',
    isEu: false,
  },
  NC: {
    name: 'New Caledonia',
    isEu: false,
  },
  NZ: {
    name: 'New Zealand',
    isEu: false,
  },
  NI: {
    name: 'Nicaragua',
    isEu: false,
  },
  NE: {
    name: 'Niger',
    isEu: false,
  },
  NG: {
    name: 'Nigeria',
    isEu: false,
  },
  NU: {
    name: 'Niue',
    isEu: false,
  },
  NF: {
    name: 'Norfolk Island',
    isEu: false,
  },
  KP: {
    name: 'North Korea',
    isEu: false,
  },
  VD: {
    name: 'North Vietnam',
    isEu: false,
  },
  MP: {
    name: 'Northern Mariana Islands',
    isEu: false,
  },
  NO: {
    name: 'Norway',
    isEu: false,
  },
  OM: {
    name: 'Oman',
    isEu: false,
  },
  PC: {
    name: 'Pacific Islands Trust Territory',
    isEu: false,
  },
  PK: {
    name: 'Pakistan',
    isEu: false,
  },
  PW: {
    name: 'Palau',
    isEu: false,
  },
  PS: {
    name: 'Palestinian Territories',
    isEu: false,
  },
  PA: {
    name: 'Panama',
    isEu: false,
  },
  PZ: {
    name: 'Panama Canal Zone',
    isEu: false,
  },
  PG: {
    name: 'Papua New Guinea',
    isEu: false,
  },
  PY: {
    name: 'Paraguay',
    isEu: false,
  },
  YD: {
    name: "People's Democratic Republic of Yemen",
    isEu: false,
  },
  PE: {
    name: 'Peru',
    isEu: false,
  },
  PH: {
    name: 'Philippines',
    isEu: false,
  },
  PN: {
    name: 'Pitcairn Islands',
    isEu: false,
  },
  PL: {
    name: 'Poland',
    isEu: false,
  },
  PT: {
    name: 'Portugal',
    isEu: false,
  },
  PR: {
    name: 'Puerto Rico',
    isEu: false,
  },
  QA: {
    name: 'Qatar',
    isEu: false,
  },
  RO: {
    name: 'Romania',
    isEu: false,
  },
  RU: {
    name: 'Russia',
    isEu: false,
  },
  RW: {
    name: 'Rwanda',
    isEu: false,
  },
  RE: {
    name: 'Réunion',
    isEu: false,
  },
  WS: {
    name: 'Samoa',
    isEu: false,
  },
  SM: {
    name: 'San Marino',
    isEu: false,
  },
  SA: {
    name: 'Saudi Arabia',
    isEu: false,
  },
  SN: {
    name: 'Senegal',
    isEu: false,
  },
  RS: {
    name: 'Serbia',
    isEu: false,
  },
  CS: {
    name: 'Serbia and Montenegro',
    isEu: false,
  },
  SC: {
    name: 'Seychelles',
    isEu: false,
  },
  SL: {
    name: 'Sierra Leone',
    isEu: false,
  },
  SG: {
    name: 'Singapore',
    isEu: false,
  },
  SK: {
    name: 'Slovakia',
    isEu: false,
  },
  SI: {
    name: 'Slovenia',
    isEu: false,
  },
  SB: {
    name: 'Solomon Islands',
    isEu: false,
  },
  SO: {
    name: 'Somalia',
    isEu: false,
  },
  ZA: {
    name: 'South Africa',
    isEu: false,
  },
  GS: {
    name: 'South Georgia and the South Sandwich Islands',
    isEu: false,
  },
  KR: {
    name: 'South Korea',
    isEu: false,
  },
  ES: {
    name: 'Spain',
    isEu: false,
  },
  LK: {
    name: 'Sri Lanka',
    isEu: false,
  },
  SD: {
    name: 'Sudan',
    isEu: false,
  },
  SR: {
    name: 'Suriname',
    isEu: false,
  },
  SJ: {
    name: 'Svalbard and Jan Mayen',
    isEu: false,
  },
  SZ: {
    name: 'Swaziland',
    isEu: false,
  },
  SE: {
    name: 'Sweden',
    isEu: false,
  },
  CH: {
    name: 'Switzerland',
    isEu: false,
  },
  SY: {
    name: 'Syria',
    isEu: false,
  },
  ST: {
    name: 'São Tomé and Príncipe',
    isEu: false,
  },
  TW: {
    name: 'Taiwan',
    isEu: false,
  },
  TJ: {
    name: 'Tajikistan',
    isEu: false,
  },
  TZ: {
    name: 'Tanzania',
    isEu: false,
  },
  TH: {
    name: 'Thailand',
    isEu: false,
  },
  TL: {
    name: 'Timor-Leste',
    isEu: false,
  },
  TG: {
    name: 'Togo',
    isEu: false,
  },
  TK: {
    name: 'Tokelau',
    isEu: false,
  },
  TO: {
    name: 'Tonga',
    isEu: false,
  },
  TT: {
    name: 'Trinidad and Tobago',
    isEu: false,
  },
  TN: {
    name: 'Tunisia',
    isEu: false,
  },
  TR: {
    name: 'Turkey',
    isEu: false,
  },
  TM: {
    name: 'Turkmenistan',
    isEu: false,
  },
  TC: {
    name: 'Turks and Caicos Islands',
    isEu: false,
  },
  TV: {
    name: 'Tuvalu',
    isEu: false,
  },
  UG: {
    name: 'Uganda',
    isEu: false,
  },
  UA: {
    name: 'Ukraine',
    isEu: false,
  },
  AE: {
    name: 'United Arab Emirates',
    isEu: false,
  },
  GB: {
    name: 'United Kingdom',
    isEu: false,
  },
  US: {
    name: 'United States',
    isEu: false,
    states: UsStates,
  },
  ZZ: {
    name: 'Unknown or Invalid Region',
    isEu: false,
  },
  UY: {
    name: 'Uruguay',
    isEu: false,
  },
  UZ: {
    name: 'Uzbekistan',
    isEu: false,
  },
  VU: {
    name: 'Vanuatu',
    isEu: false,
  },
  VA: {
    name: 'Vatican City',
    isEu: false,
  },
  VE: {
    name: 'Venezuela',
    isEu: false,
  },
  VN: {
    name: 'Vietnam',
    isEu: false,
  },
  WK: {
    name: 'Wake Island',
    isEu: false,
  },
  WF: {
    name: 'Wallis and Futuna',
    isEu: false,
  },
  EH: {
    name: 'Western Sahara',
    isEu: false,
  },
  YE: {
    name: 'Yemen',
    isEu: false,
  },
  ZM: {
    name: 'Zambia',
    isEu: false,
  },
  ZW: {
    name: 'Zimbabwe',
    isEu: false,
  },
}; //TODO: Sort

let countryNamesMap = Map();
const countryKeys = Object.keys(countries);
const countryKeysList = List(countryKeys);

countryKeys.map((key) => {
  countryNamesMap = countryNamesMap.set(key, countries[key].name);
});

export { countryKeys, countryNamesMap, countryKeysList };

export default countries;
