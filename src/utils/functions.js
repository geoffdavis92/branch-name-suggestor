export const createFilterRegex = (word) => new RegExp(`\\b${word}\\b`, "gi");

export const isTextChanged = (initialText, filteredText) => {
  return initialText !== filteredText;
};
