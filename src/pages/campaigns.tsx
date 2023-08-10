import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, CustomCheckbox, InputField } from '@/atoms';
import { RadioInput } from '@/atoms/input/CustomRadiobutton';
import MultiSelectSearch from '@/atoms/multiSelectedSearch';
import { CustomTable } from '@/atoms/table/table';
import { Layout } from '@/layouts';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  // Add more countries as needed
];

// const options = [
//   "Chrome",
//   "Safari",
//   "Firefox",
//   "Internet Explorer",
//   "Mozilla",
//   "Edge",
//   "UCBrowser",
//   "Samsung",
//   "Opera",
//   "Android",
// ];

// const devices = [
//   "Desktop",
//   "Console",
//   "Mobile",
//   "Tablet",
//   "Smarttv",
//   "Wearable",
//   "Embedded",
//   "Misc",
// ];

// const os = ["Mac OS", "Android", "Windows", "iOS", "Unix", "Misc"];

// const connections = ["MOBILE", "PROXY", "REGULAR"];

// const countries = [
//   { label: 'Afghanistan/AF', value: 'AF' },
//   { label: 'Albania/AL', value: 'AL' },
//   { label: 'Algeria/DZ', value: 'DZ' },
//   { label: 'Andorra/AD', value: 'AD' },
//   { label: 'Angola/AO', value: 'AO' },
//   { label: 'Antigua and Barbuda/AG', value: 'AG' },
//   { label: 'Argentina/AR', value: 'AR' },
//   { label: 'Armenia/AM', value: 'AM' },
//   { label: 'Australia/AU', value: 'AU' },
//   { label: 'Austria/AT', value: 'AT' },
//   { label: 'Azerbaijan/AZ', value: 'AZ' },
//   { label: 'Bahamas/BS', value: 'BS' },
//   { label: 'Bahrain/BH', value: 'BH' },
//   { label: 'Bangladesh/BD', value: 'BD' },
//   { label: 'Barbados/BB', value: 'BB' },
//   { label: 'Belarus/BY', value: 'BY' },
//   { label: 'Belgium/BE', value: 'BE' },
//   { label: 'Belize/BZ', value: 'BZ' },
//   { label: 'Benin/BJ', value: 'BJ' },
//   { label: 'Bhutan/BT', value: 'BT' },
//   { label: 'Bolivia/BO', value: 'BO' },
//   { label: 'Bosnia and Herzegovina/BA', value: 'BA' },
//   { label: 'Botswana/BW', value: 'BW' },
//   { label: 'Brazil/BR', value: 'BR' },
//   { label: 'Brunei/BN', value: 'BN' },
//   { label: 'Bulgaria/BG', value: 'BG' },
//   { label: 'Burkina Faso/BF', value: 'BF' },
//   { label: 'Burundi/BI', value: 'BI' },
//   { label: 'Cabo Verde/CV', value: 'CV' },
//   { label: 'Cambodia/KH', value: 'KH' },
//   { label: 'Cameroon/CM', value: 'CM' },
//   { label: 'Canada/CA', value: 'CA' },
//   { label: 'Central African Republic/CF', value: 'CF' },
//   { label: 'Chad/TD', value: 'TD' },
//   { label: 'Chile/CL', value: 'CL' },
//   { label: 'China/CN', value: 'CN' },
//   { label: 'Colombia/CO', value: 'CO' },
//   { label: 'Comoros/KM', value: 'KM' },
//   { label: 'Congo/CG', value: 'CG' },
//   { label: 'Costa Rica/CR', value: 'CR' },
//   { label: 'Croatia/HR', value: 'HR' },
//   { label: 'Cuba/CU', value: 'CU' },
//   { label: 'Cyprus/CY', value: 'CY' },
//   { label: 'Czech Republic/CZ', value: 'CZ' },
//   { label: 'Democratic Republic of the Congo/CD', value: 'CD' },
//   { label: 'Denmark/DK', value: 'DK' },
//   { label: 'Djibouti/DJ', value: 'DJ' },
//   { label: 'Dominica/DM', value: 'DM' },
//   { label: 'Dominican Republic/DO', value: 'DO' },
//   { label: 'Ecuador/EC', value: 'EC' },
//   { label: 'Egypt/EG', value: 'EG' },
//   { label: 'El Salvador/SV', value: 'SV' },
//   { label: 'Equatorial Guinea/GQ', value: 'GQ' },
//   { label: 'Eritrea/ER', value: 'ER' },
//   { label: 'Estonia/EE', value: 'EE' },
//   { label: 'Eswatini/SZ', value: 'SZ' },
//   { label: 'Ethiopia/ET', value: 'ET' },
//   { label: 'Fiji/FJ', value: 'FJ' },
//   { label: 'Finland/FI', value: 'FI' },
//   { label: 'France/FR', value: 'FR' },
//   { label: 'Gabon/GA', value: 'GA' },
//   { label: 'Gambia/GM', value: 'GM' },
//   { label: 'Georgia/GE', value: 'GE' },
//   { label: 'Germany/DE', value: 'DE' },
//   { label: 'Ghana/GH', value: 'GH' },
//   { label: 'Greece/GR', value: 'GR' },
//   { label: 'Grenada/GD', value: 'GD' },
//   { label: 'Guatemala/GT', value: 'GT' },
//   { label: 'Guinea/GN', value: 'GN' },
//   { label: 'Guinea-Bissau/GW', value: 'GW' },
//   { label: 'Guyana/GY', value: 'GY' },
//   { label: 'Haiti/HT', value: 'HT' },
//   { label: 'Honduras/HN', value: 'HN' },
//   { label: 'Hungary/HU', value: 'HU' },
//   { label: 'Iceland/IS', value: 'IS' },
//   { label: 'India/IN', value: 'IN' },
//   { label: 'Indonesia/ID', value: 'ID' },
//   { label: 'Iran/IR', value: 'IR' },
//   { label: 'Iraq/IQ', value: 'IQ' },
//   { label: 'Ireland/IE', value: 'IE' },
//   { label: 'Israel/IL', value: 'IL' },
//   { label: 'Italy/IT', value: 'IT' },
//   { label: 'Ivory Coast/CI', value: 'CI' },
//   { label: 'Jamaica/JM', value: 'JM' },
//   { label: 'Japan/JP', value: 'JP' },
//   { label: 'Jordan/JO', value: 'JO' },
//   { label: 'Kazakhstan/KZ', value: 'KZ' },
//   { label: 'Kenya/KE', value: 'KE' },
//   { label: 'Kiribati/KI', value: 'KI' },
//   { label: 'Korea, North/KP', value: 'KP' },
//   { label: 'Korea, South/KR', value: 'KR' },
//   { label: 'Kosovo/XK', value: 'XK' },
//   { label: 'Kuwait/KW', value: 'KW' },
//   { label: 'Kyrgyzstan/KG', value: 'KG' },
//   { label: 'Laos/LA', value: 'LA' },
//   { label: 'Latvia/LV', value: 'LV' },
//   { label: 'Lebanon/LB', value: 'LB' },
//   { label: 'Lesotho/LS', value: 'LS' },
//   { label: 'Liberia/LR', value: 'LR' },
//   { label: 'Libya/LY', value: 'LY' },
//   { label: 'Liechtenstein/LI', value: 'LI' },
//   { label: 'Lithuania/LT', value: 'LT' },
//   { label: 'Luxembourg/LU', value: 'LU' },
//   { label: 'Madagascar/MG', value: 'MG' },
//   { label: 'Malawi/MW', value: 'MW' },
//   { label: 'Malaysia/MY', value: 'MY' },
//   { label: 'Maldives/MV', value: 'MV' },
//   { label: 'Mali/ML', value: 'ML' },
//   { label: 'Malta/MT', value: 'MT' },
//   { label: 'Marshall Islands/MH', value: 'MH' },
//   { label: 'Mauritania/MR', value: 'MR' },
//   { label: 'Mauritius/MU', value: 'MU' },
//   { label: 'Mexico/MX', value: 'MX' },
//   { label: 'Micronesia/FM', value: 'FM' },
//   { label: 'Moldova/MD', value: 'MD' },
//   { label: 'Monaco/MC', value: 'MC' },
//   { label: 'Mongolia/MN', value: 'MN' },
//   { label: 'Montenegro/ME', value: 'ME' },
//   { label: 'Morocco/MA', value: 'MA' },
//   { label: 'Mozambique/MZ', value: 'MZ' },
//   { label: 'Myanmar/MM', value: 'MM' },
//   { label: 'Namibia/NA', value: 'NA' },
//   { label: 'Nauru/NR', value: 'NR' },
//   { label: 'Nepal/NP', value: 'NP' },
//   { label: 'Netherlands/NL', value: 'NL' },
//   { label: 'New Zealand/NZ', value: 'NZ' },
//   { label: 'Nicaragua/NI', value: 'NI' },
//   { label: 'Niger/NE', value: 'NE' },
//   { label: 'Nigeria/NG', value: 'NG' },
//   { label: 'North Macedonia/MK', value: 'MK' },
//   { label: 'Norway/NO', value: 'NO' },
//   { label: 'Oman/OM', value: 'OM' },
//   { label: 'Pakistan/PK', value: 'PK' },
//   { label: 'Palau/PW', value: 'PW' },
//   { label: 'Palestine/PS', value: 'PS' },
//   { label: 'Panama/PA', value: 'PA' },
//   { label: 'Papua New Guinea/PG', value: 'PG' },
//   { label: 'Paraguay/PY', value: 'PY' },
//   { label: 'Peru/PE', value: 'PE' },
//   { label: 'Philippines/PH', value: 'PH' },
//   { label: 'Poland/PL', value: 'PL' },
//   { label: 'Portugal/PT', value: 'PT' },
//   { label: 'Qatar/QA', value: 'QA' },
//   { label: 'Republic of the Congo/CG', value: 'CG' },
//   { label: 'Romania/RO', value: 'RO' },
//   { label: 'Russia/RU', value: 'RU' },
//   { label: 'Rwanda/RW', value: 'RW' },
//   { label: 'Saint Kitts and Nevis/KN', value: 'KN' },
//   { label: 'Saint Lucia/LC', value: 'LC' },
//   { label: 'Saint Vincent and the Grenadines/VC', value: 'VC' },
//   { label: 'Samoa/WS', value: 'WS' },
//   { label: 'San Marino/SM', value: 'SM' },
//   { label: 'Sao Tome and Principe/ST', value: 'ST' },
//   { label: 'Saudi Arabia/SA', value: 'SA' },
//   { label: 'Senegal/SN', value: 'SN' },
//   { label: 'Serbia/RS', value: 'RS' },
//   { label: 'Seychelles/SC', value: 'SC' },
//   { label: 'Sierra Leone/SL', value: 'SL' },
//   { label: 'Singapore/SG', value: 'SG' },
//   { label: 'Slovakia/SK', value: 'SK' },
//   { label: 'Slovenia/SI', value: 'SI' },
//   { label: 'Solomon Islands/SB', value: 'SB' },
//   { label: 'Somalia/SO', value: 'SO' },
//   { label: 'South Africa/ZA', value: 'ZA' },
//   { label: 'South Sudan/SS', value: 'SS' },
//   { label: 'Spain/ES', value: 'ES' },
//   { label: 'Sri Lanka/LK', value: 'LK' },
//   { label: 'Sudan/SD', value: 'SD' },
//   { label: 'Suriname/SR', value: 'SR' },
//   { label: 'Sweden/SE', value: 'SE' },
//   { label: 'Switzerland/CH', value: 'CH' },
//   { label: 'Syria/SY', value: 'SY' },
//   { label: 'Taiwan/TW', value: 'TW' },
//   { label: 'Tajikistan/TJ', value: 'TJ' },
//   { label: 'Tanzania/TZ', value: 'TZ' },
//   { label: 'Thailand/TH', value: 'TH' },
//   { label: 'Timor-Leste/TL', value: 'TL' },
//   { label: 'Togo/TG', value: 'TG' },
//   { label: 'Tonga/TO', value: 'TO' },
//   { label: 'Trinidad and Tobago/TT', value: 'TT' },
//   { label: 'Tunisia/TN', value: 'TN' },
//   { label: 'Turkey/TR', value: 'TR' },
//   { label: 'Turkmenistan/TM', value: 'TM' },
//   { label: 'Tuvalu/TV', value: 'TV' },
//   { label: 'Uganda/UG', value: 'UG' },
//   { label: 'Ukraine/UA', value: 'UA' },
//   { label: 'United Arab Emirates/AE', value: 'AE' },
//   { label: 'United Kingdom/GB', value: 'GB' },
//   { label: 'United States of America/US', value: 'US' },
//   { label: 'Uruguay/UY', value: 'UY' },
//   { label: 'Uzbekistan/UZ', value: 'UZ' },
//   { label: 'Vanuatu/VU', value: 'VU' },
//   { label: 'Vatican City/VA', value: 'VA' },
//   { label: 'Venezuela/VE', value: 'VE' },
//   { label: 'Vietnam/VN', value: 'VN' },
//   { label: 'Yemen/YE', value: 'YE' },
//   { label: 'Zambia/ZM', value: 'ZM' },
//   { label: 'Zimbabwe/ZW', value: 'ZW' }
// ];

// const popularLanguages = [
//   { label: "Afrikaans/AF", value: "AF" },
//   { label: "Albanian/SQ", value: "SQ" },
//   { label: "Amharic/AM", value: "AM" },
//   { label: "Arabic/AR", value: "AR" },
//   { label: "Armenian/HY", value: "HY" },
//   { label: "Azerbaijani/AZ", value: "AZ" },
//   { label: "Basque/EU", value: "EU" },
//   { label: "Belarusian/BE", value: "BE" },
//   { label: "Bengali/BN", value: "BN" },
//   { label: "Bosnian/BS", value: "BS" },
//   { label: "Bulgarian/BG", value: "BG" },
//   { label: "Catalan/CA", value: "CA" },
//   { label: "Cebuano/CEB", value: "CEB" },
//   { label: "Chichewa/NY", value: "NY" },
//   { label: "Chinese Simplified/ZH-CN", value: "ZH-CN" },
//   { label: "Chinese Traditional/ZH-TW", value: "ZH-TW" },
//   { label: "Corsican/CO", value: "CO" },
//   { label: "Croatian/HR", value: "HR" },
//   { label: "Czech/CS", value: "CS" },
//   { label: "Danish/DA", value: "DA" },
//   { label: "Dutch/NL", value: "NL" },
//   { label: "English/EN", value: "EN" },
//   { label: "Esperanto/EO", value: "EO" },
//   { label: "Estonian/ET", value: "ET" },
//   { label: "Filipino/TL", value: "TL" },
//   { label: "Finnish/FI", value: "FI" },
//   { label: "French/FR", value: "FR" },
//   { label: "Frisian/FY", value: "FY" },
//   { label: "Galician/GL", value: "GL" },
//   { label: "Georgian/KA", value: "KA" },
//   { label: "German/DE", value: "DE" },
//   { label: "Greek/EL", value: "EL" },
//   { label: "Gujarati/GU", value: "GU" },
//   { label: "Haitian Creole/HT", value: "HT" },
//   { label: "Hausa/HA", value: "HA" },
//   { label: "Hawaiian/HAW", value: "HAW" },
//   { label: "Hebrew/HE", value: "HE" },
//   { label: "Hindi/HI", value: "HI" },
//   { label: "Hmong/HMN", value: "HMN" },
//   { label: "Hungarian/HU", value: "HU" },
//   { label: "Icelandic/IS", value: "IS" },
//   { label: "Igbo/IG", value: "IG" },
//   { label: "Indonesian/ID", value: "ID" },
//   { label: "Irish/GA", value: "GA" },
//   { label: "Italian/IT", value: "IT" },
//   { label: "Japanese/JA", value: "JA" },
//   { label: "Javanese/JV", value: "JV" },
//   { label: "Kannada/KN", value: "KN" },
//   { label: "Kazakh/KK", value: "KK" },
//   { label: "Khmer/KM", value: "KM" },
//   { label: "Kinyarwanda/RW", value: "RW" },
//   { label: "Korean/KO", value: "KO" },
//   { label: "Kurdish/KU", value: "KU" },
//   { label: "Kyrgyz/KY", value: "KY" },
//   { label: "Lao/LO", value: "LO" },
//   { label: "Latin/LA", value: "LA" },
//   { label: "Latvian/LV", value: "LV" },
//   { label: "Lithuanian/LT", value: "LT" },
//   { label: "Luxembourgish/LB", value: "LB" },
//   { label: "Macedonian/MK", value: "MK" },
//   { label: "Malagasy/MG", value: "MG" },
//   { label: "Malay/MS", value: "MS" },
//   { label: "Malayalam/ML", value: "ML" },
//   { label: "Maltese/MT", value: "MT" },
//   { label: "Maori/MI", value: "MI" },
//   { label: "Marathi/MR", value: "MR" },
//   { label: "Mongolian/MN", value: "MN" },
//   { label: "Myanmar (Burmese)/MY", value: "MY" },
//   { label: "Nepali/NE", value: "NE" },
//   { label: "Norwegian/NO", value: "NO" },
//   { label: "Nyanja/CHI", value: "CHI" },
//   { label: "Odia (Oriya)/OR", value: "OR" },
//   { label: "Pashto/PS", value: "PS" },
//   { label: "Persian/FA", value: "FA" },
//   { label: "Polish/PL", value: "PL" },
//   { label: "Portuguese/PT", value: "PT" },
//   { label: "Punjabi/PA", value: "PA" },
//   { label: "Romanian/RO", value: "RO" },
//   { label: "Russian/RU", value: "RU" },
//   { label: "Samoan/SM", value: "SM" },
//   { label: "Scots Gaelic/GD", value: "GD" },
//   { label: "Serbian/SR", value: "SR" },
//   { label: "Sesotho/ST", value: "ST" },
//   { label: "Shona/SN", value: "SN" },
//   { label: "Sindhi/SD", value: "SD" },
//   { label: "Sinhala/SI", value: "SI" },
//   { label: "Slovak/SK", value: "SK" },
//   { label: "Slovenian/SL", value: "SL" },
//   { label: "Somali/SO", value: "SO" },
//   { label: "Spanish/ES", value: "ES" },
//   { label: "Sundanese/SU", value: "SU" },
//   { label: "Swahili/SW", value: "SW" },
//   { label: "Swedish/SV", value: "SV" },
//   { label: "Tajik/TG", value: "TG" },
//   { label: "Tamil/TA", value: "TA" },
//   { label: "Tatar/TT", value: "TT" },
//   { label: "Telugu/TE", value: "TE" },
//   { label: "Thai/TH", value: "TH" },
//   { label: "Turkish/TR", value: "TR" },
//   { label: "Turkmen/TKM", value: "TKM" },
//   { label: "Ukrainian/UK", value: "UK" },
//   { label: "Urdu/UR", value: "UR" },
//   { label: "Uyghur/UG", value: "UG" },
//   { label: "Uzbek/UZ", value: "UZ" },
//   { label: "Vietnamese/VI", value: "VI" },
//   { label: "Welsh/CY", value: "CY" },
//   { label: "Xhosa/XH", value: "XH" },
//   { label: "Yiddish/YI", value: "YI" },
//   { label: "Yoruba/YO", value: "YO" },
//   { label: "Zulu/ZU", value: "ZU" }
// ];
interface FormData {
  hours: {
    [key: number]: boolean;
  };
  days: {
    [key: string]: boolean;
  };
  selectedCountries: string[];
  feeds: string[];
  Language: any;
  countryCode: any;
  browsers: any;
  devices: any;
  os: any;
  connection: any;
  deliveryType: any;
}

const segmentHeading = `text-xl font-semibold text-gray`;
const labelClass = ` text-medium-gray font-medium mb-2`;

export default function Index() {
  const [create, setCreate] = useState(false);
  const { register, handleSubmit, formState, setValue, watch } =
    useForm<FormData>({
      defaultValues: {
        hours: [...Array(24)].reduce(
          (acc, _, index) => {
            acc[index] = true;
            return acc;
          },
          {} as FormData['hours'],
        ),
        days: {
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: true,
          Sunday: true,
        },
      },
    });

  // Initialize the form field with an empty array
  useEffect(() => {
    register('selectedCountries');
    setValue('selectedCountries', []);
  }, [register, setValue]);

  const onSubmit = (_data: FormData) => {};

  const data = [
    {
      title: 'Angela',
      feeds: ['ahfhd', 'rohit'],
      id: '13',
      status: 'single',
    },
    {
      title: 'Madisen',
      feeds: ['ahfhd', 'rohit'],
      id: '75',
      status: 'relationship',
    },
    {
      title: 'Clair',
      feeds: ['ahfhd', 'rohit'],
      id: '56',
      status: 'single',
    },
    {
      title: 'Emilia',
      feeds: ['ahfhd', '21rohit21'],
      id: '20',
      status: 'relationship',
    },
    {
      title: 'Domenic',
      feeds: ['ahfhd', '21rohit21'],
      id: '91',
      status: 'complicated',
    },
  ];

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'title',
        header: 'Title',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'countries',
        header: 'Countries',
      },
      {
        accessorKey: 'feeds',
        header: 'Feeds',
        accessorFn: (row) => {
          return row?.feeds?.join(',');
        },
        cell: (info) => {
          const val = info?.getValue() as string;
          const arr = val?.split(',');
          return (
            <div className=" flex gap-x-1">
              {arr.map((ele, ind) => (
                <span key={ind} className=" rounded bg-light-blue p-1">
                  {ele}
                </span>
              ))}
            </div>
          );
        },
      },
    ],
    [],
  );

  const deliveryType = watch('deliveryType') as any;
  return (
    <Layout>
      <div className=" mb-5 h-full w-full overflow-y-auto bg-stroke-light-gray p-3 pb-10 sm:p-10">
        <div className=" relative rounded-2xl bg-white p-3 sm:p-10">
          <div className=" mb-8 flex justify-between">
            <h2 className="text-3xl font-semibold text-gray">Campaign</h2>
            <Button title="creative" onClick={() => setCreate(true)} />
          </div>
          <div>
            <CustomTable columns={columns} data={data} />
          </div>
          {create && (
            <div
              className={`absolute inset-x-0 top-0 z-20 bg-white p-3 sm:p-10`}
            >
              <div className=" flex justify-between">
                <h2 className="text-3xl font-semibold text-gray">
                  Create Campaign
                </h2>

                <Button
                  title="Cancel"
                  variant="out-lined"
                  onClick={() => setCreate(false)}
                />
              </div>
              <form
                className="mt-4 space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col">
                  <label htmlFor="title" className={labelClass}>
                    Title
                  </label>
                  <InputField
                    name="title"
                    type="text"
                    placeholder="Type here"
                    register={register}
                    formState={formState}
                    rules={{
                      required: 'This is a required field.',
                    }}
                  />
                </div>
                <hr className="mb-4 mt-6 border-t" />

                <h5 className={segmentHeading}>Targeting options</h5>

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="selectedCountries"
                  label="Select Countries"
                  error={formState?.errors?.selectedCountries}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="feeds"
                  label="Feeds"
                  error={formState?.errors?.feeds}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="language"
                  label="Language"
                  error={formState?.errors?.Language}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="countryCode"
                  label="Countries"
                  error={formState?.errors?.countryCode}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="browsers"
                  label="Browsers"
                  error={formState?.errors?.browsers}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="devices"
                  label="Devices"
                  error={formState?.errors?.devices}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="os"
                  label="OS"
                  error={formState?.errors?.os}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="connection"
                  label="Connection"
                  error={formState?.errors?.connection}
                />

                <div className="">
                  <div className={labelClass}>Subscription period</div>
                  <div className="">
                    <div className=" flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                      <span>From</span>
                      <InputField
                        name="subscriptionAgeFrom"
                        type="number"
                        placeholder="0"
                        register={register}
                        formState={formState}
                        rules={{
                          required: 'This is a required field.',
                        }}
                      />

                      <span>hours to</span>

                      <InputField
                        name="subscriptionAgeTo"
                        type="number"
                        placeholder="23"
                        register={register}
                        formState={formState}
                        rules={{
                          required: 'This is a required field.',
                        }}
                      />
                      <span>hours</span>
                    </div>
                  </div>
                </div>

                <hr className="mb-4 mt-6 border-t" />
                <div className="">
                  <div className={segmentHeading}>Delivery type</div>

                  <div className=" mt-6 flex flex-col gap-2 sm:flex-row">
                    <RadioInput
                      label="Creative and feed frequency"
                      value="creative-feed"
                      name="deliveryType"
                      register={register}
                      checked={deliveryType === 'creative-feed'}
                    />
                    <RadioInput
                      label="Creative schedule"
                      value="creative-schedule"
                      name="deliveryType"
                      register={register}
                      checked={deliveryType === 'creative-schedule'}
                    />
                    {/* Add more RadioInput components for other options */}
                  </div>
                </div>

                <div className="">
                  <div className={labelClass}>
                    Send random
                    <span className="" aria-label="question-circle" />
                  </div>
                  <div className=" flex">
                    <InputField
                      name="sendRandomCreatives"
                      type="number"
                      placeholder="0"
                      register={register}
                      formState={formState}
                      rules={{
                        required: 'This is a required field.',
                      }}
                    />
                  </div>
                </div>
                <div className="">
                  <div className={labelClass}>
                    Creatives frequency, hours
                    <span className="" aria-label="question-circle" />
                  </div>
                  <div className=" flex">
                    <InputField
                      name="frequency"
                      type="number"
                      placeholder="0"
                      register={register}
                      formState={formState}
                      rules={{
                        required: 'This is a required field.',
                      }}
                    />
                  </div>
                </div>

                <hr className="mb-4 mt-6 border-t" />
                <div className={segmentHeading}>Time schedule</div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className={labelClass}>Target Hours</h3>
                    <div className="grid grid-cols-4  space-y-2 sm:grid-cols-8">
                      {[...Array(24)].map((_, ind) => (
                        <CustomCheckbox
                          key={ind}
                          label={`${ind}`}
                          name={`hours[${ind}]`}
                          register={register}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={labelClass}>Target Days</h3>
                    <div className="grid grid-cols-2 space-y-2 sm:grid-cols-4">
                      {[
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                      ].map((day) => (
                        <CustomCheckbox
                          key={day}
                          label={day}
                          name={`days[${day}]`}
                          register={register}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className=" !mt-16">
                  <Button
                    type={'submit'}
                    title="Save"
                    paddingMargin="px-5 lg:px-16"
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
