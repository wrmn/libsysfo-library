import { readable } from "svelte/store";

export const bookStatus = {
  1: {
    color: "blue",
    text: "New",
  },
  2: {
    color: "green",
    text: "Great",
  },
  3: {
    color: "yellow",
    text: "Good",
  },
  4: {
    color: "red",
    text: "Bad",
  },
};

export const bookAvailability = {
  1: {
    color: "green",
    text: "Available",
  },
  2: {
    color: "blue",
    text: "Read Only",
  },
  3: {
    color: "red",
    text: "Not Available",
  },
};

export const borrowStatus = {
  requested: {
    color: "yellow",
  },
  accepted: {
    color: "teal",
  },
  taked: {
    color: "blue",
  },
  finished: {
    color: "green",
  },
  canceled: {
    color: "red",
  },
};

export const dashboardTable = readable([
  {
    Title: "Borrow Last 30 Days",
    data: "borrow",
  },
  {
    Title: "Access Last 30 Days",
    data: "access",
  },
  {
    Title: "Book Total",
    data: "book",
  },
  {
    Title: "Paper Total",
    data: "paper",
  },
]);

export const userDetailTable = readable([
  {
    Title: "Username",
    data: "username",
  },
  {
    Title: "E-mail",
    data: "email",
    conditionalData: {
      data: "verivied",
      text: "verified",
    },
  },
  {
    Title: "Name",
    data: "name",
  },
  {
    Title: "Gender",
    data: "gender",
    dataSelect: {
      F: "Female",
      M: "Male",
    },
  },
  {
    Title: "Birthplace / Birthday",
    dataSet: ["placeOfBirth", "dateOfBirth"],
    separator: " / ",
  },
  {
    Title: "Address",
    data: "address",
  },
  {
    Title: "Profession / Institution",
    dataSet: ["profession", "institution"],
    separator: " / ",
  },
  {
    Title: "Phone Number",
    dataSet: ["phoneCode", "phoneNo"],
    conditionalData: {
      data: "isWhatsapp",
      text: "Whatsapp Number",
    },
  },
]);

export const bookDetailTable = readable([
  {
    Title: "Author",
    main: true,
    data: "author",
  },
  {
    Title: "Release Date",
    data: "releaseDate",
  },
  {
    Title: "Publisher",
    data: "publisher",
  },
  {
    Title: "Language",
    data: "language",
  },
  {
    Title: "Country",
    data: "country",
  },
  {
    Title: "PageCount",
    data: "pageCount",
  },
]);

export const collectionDetailTable = readable([
  {
    Title: "Serial Number",
    data: "sn",
  },
  {
    Title: "Status",
    data: "status",
    stats: bookStatus,
  },
  {
    Title: "Availability",
    data: "availability",
    stats: bookAvailability,
  },
]);

export const borrowDetailTable = [
  {
    title: "Status",
    data: "status",
  },
  {
    title: "Requested At",
    data: "createdAt",
    time: true,
  },
  {
    title: "Accepted At",
    data: "acceptedAt",
    time: true,
  },
  {
    title: "Taked At",
    data: "takedAt",
    time: true,
  },
  {
    title: "Returned At",
    data: "returnedAt",
    time: true,
  },
  {
    title: "Canceled At",
    data: "canceledAt",
    time: true,
  },
  {
    title: "Book Title",
    data: "title",
  },
  {
    title: "Book Serial Number",
    data: "serialNumber",
    linkTo: "/book/detail/",
    linkVar: "collectionId",
    linkTitle: "view book",
  },
  {
    title: "User",
    data: "userName",
    linkTo: "/user/detail/",
    linkVar: "userId",
    linkTitle: "view User",
  },
];

export const categories = [
  "Adult Fiction",
  "Art, Music & Photography",
  "Biographies & Memoirs",
  "Buddhism & Hinduism",
  "Business & Investing",
  "Children",
  "Christianity",
  "Classics",
  "Comics & Graphic Novels",
  "Computers & Technology",
  "Education & Test Preparation",
  "Fiction & Literature",
  "Food, Drink & Cookbook",
  "Health, Fitness & Wellness",
  "Historical Fiction",
  "History",
  "Home & Architecture",
  "Horror & Paranormal",
  "Humor & Comedy",
  "Islam",
  "Law & Tax",
  "Manga, Manhua & Manhwa",
  "Motivation & Self-Help",
  "Mystery, Thriller & Suspense",
  "Non-fiction",
  "Parenting & Relationships",
  "Philosophy",
  "Poem & Short Story",
  "Politics, Affairs & Social Sciences",
  "Professional, Engineering & Technical",
  "Psychology",
  "Reference & Dictionary",
  "Religion & Spirituality",
  "Romance",
  "Science Fiction & Fantasy",
  "Science & Nature",
  "Sports & Outdoors",
  "Teen & Young Adult Fiction",
  "Travel",
];

export const languages = [
  "Chinese",
  "English",
  "German",
  "Hindi",
  "Malayalam",
  "Tamil",
  "Telugu",
  "Indonesian",
  "Japanese",
  "Korean",
  "Malay",
  "Portuguese",
  "Spanish",
  "Thai",
];

export const countries = [
  "Afghanistan",
  "Aland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Congo, Democratic Republic of the Congo",
  "Cook Islands",
  "Costa Rica",
  "Cote D'Ivoire",
  "Croatia",
  "Cuba",
  "Curacao",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands (Malvinas)",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and Mcdonald Islands",
  "Holy See (Vatican City State)",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran, Islamic Republic of",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, Democratic People's Republic of",
  "Korea, Republic of",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libyan Arab Jamahiriya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Macedonia, the Former Yugoslav Republic of",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia, Federated States of",
  "Moldova, Republic of",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestinian Territory, Occupied",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "Saint Barthelemy",
  "Saint Helena",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Serbia and Montenegro",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan, Province of China",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "United States Minor Outlying Islands",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Viet Nam",
  "Virgin Islands, British",
  "Virgin Islands, U.s.",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];