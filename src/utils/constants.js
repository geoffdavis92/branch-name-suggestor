export const RESULT_TYPE = {
  ERRORS: "errors",
  SUGGESTIONS: "suggestions",
  WARNINGS: "warnings"
};

export const SUGGESTED = {
  AVG_WORD_LENGTH: 8,
  MAX_WORD_COUNT: 5
};

export const CONSECUTIVE_DUPLICATE_WORDS = {
  id: "consecutiveDuplicateWords",
  resultType: RESULT_TYPE.ERRORS
};

export const GRAMMAR = {
  ARTICLES: { id: "articles", values: ["the", "an", "a"] },
  CONJUNCTIONS: {
    id: "conjunctions",
    values: [
      "whenever",
      "because",
      "thought",
      "unless",
      "after",
      "until",
      "than",
      "that",
      "when",
      "for",
      "and",
      "nor",
      "but",
      "yet",
      "or",
      "so",
      "as",
      "if"
    ]
  },
  NOUNS: { id: "nouns", values: ["their", "your", "our", "its", "it"] },
  OTHER_WORDS: {
    id: "otherWords",
    values: ["spike", "story", "bug", "with", "to", "is"]
  },
  PHRASES: { id: "phrases", values: ["based on"] },
  PREPOSITIONS: {
    id: "prepositions",
    values: ["before", "towards", "under", "in", "on"]
  },
  PROPER_NOUNS: {
    id: "properNouns",
    values: ["My Supporter Account", "Prod", "Dev", "QA"]
  }
};

export const SPECIAL_CHARACTERS = {
  id: "specialCharacters",
  values: ["[–—\":“‘’”'_.,\\\\]"],
  resultType: RESULT_TYPE.ERRORS
};

export const WORD_SEPARATORS = {
  id: "wordSeparators",
  values: ["[-/]"]
};

export const CRITERIA = [
  CONSECUTIVE_DUPLICATE_WORDS,
  ...Object.values(GRAMMAR),
  SPECIAL_CHARACTERS,
  WORD_SEPARATORS
].reduce((criteriaMap, constant) => {
  const { id, ...restConstant } = constant;

  criteriaMap[id] = restConstant;

  return criteriaMap;
}, {});
