export const camelCaseToDashCase = (identifier) => {
  const idCharArray = identifier.split("");
  const isCapitalLetter = new RegExp("[A-Z]");
  const dashCaseId = idCharArray
    .map((char) => {
      if (isCapitalLetter.test(char)) {
        return `-${char.toLowerCase()}`;
      } else {
        return char;
      }
    })
    .join("");

  return dashCaseId;
};

export const createFilterRegex = (word) => new RegExp(`\\b${word}\\b`, "gi");

export const isTextChanged = (initialText, filteredText) => {
  return initialText !== filteredText;
};

export const setupDebounce = function setupDebouncedFn(fn, time = 500) {
  let timeout;

  return function callDebouncedFn(...args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, time);
  };
};
