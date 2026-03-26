const separators = {
  tr: { decimal: ",", thousand: "." },
  en: { decimal: ".", thousand: "," },
  ru: { decimal: ",", thousand: " " },
  az: { decimal: ",", thousand: "." },
};

export const getNumberSeparatorsByLanguage = (language) => {
  const normalizedLanguage = (language || "en").split("-")[0].toLowerCase();
  return separators[normalizedLanguage] || separators.en;
};

export const formatNumberWithSeparators = (value, language) => {
  if (value === null || value === undefined || value === "") return "";

  const { decimal, thousand } = getNumberSeparatorsByLanguage(language);
  const textValue = String(value);
  const [integerPart, decimalPart] = textValue.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);

  return decimalPart ? `${formattedInteger}${decimal}${decimalPart}` : formattedInteger;
};

export const parseLocalizedNumber = (value, language) => {
  if (value === null || value === undefined || value === "") return "";

  const { decimal, thousand } = getNumberSeparatorsByLanguage(language);
  const textValue = String(value);
  const withoutThousands = textValue.split(thousand).join("");

  return decimal === "." ? withoutThousands : withoutThousands.replace(decimal, ".");
};
