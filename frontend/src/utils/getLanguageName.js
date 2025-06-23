import languages from "../data/languages.json";
const getLanguageName = (code) => {
  if (!code) return "";
  const lang = languages.find(
    (l) => l["1"] === code || l["2"] === code || l["2T"] === code || l["2B"] === code || l["3"] === code
  );
  return lang ? lang.name : code;
};

export default getLanguageName;