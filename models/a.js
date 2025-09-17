import { createRequire } from "module";
const require = createRequire(import.meta.url);
const countries = require("i18n-iso-countries");
const enLocale = require("i18n-iso-countries/langs/en.json");
countries.registerLocale(enLocale);
const countryNamesArray = Object.values(countries.getNames("en"));
import { writeFileSync } from "fs";
writeFileSync("countryNames.json", JSON.stringify(countryNamesArray, null, 2));
console.log("Country names array written to countryNames.json");