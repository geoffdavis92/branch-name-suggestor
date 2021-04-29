export const RESULT_TYPE = {
  ERRORS: "errors",
  EXPLANATIONS: "explanations",
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
  ARTICLES: {
    id: "articles",
    values: ["the", "an", "a"],
    resultType: RESULT_TYPE.WARNINGS,
    resultHeading: "Articles are not needed",
    resultContent: [
      "These are not needed in branch names",
      'English articles "the", "an", and "a" can be safely removed and the meaning can still be conveyed'
    ]
  },
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
  NOUNS: {
    id: "nouns",
    values: ["their", "your", "our", "its", "it"],
    resultType: RESULT_TYPE.WARNINGS,
    resultHeading: "Avoid using nouns",
    resultContent: [
      "Nouns typically refer to a person/group of people/team, which is not needed in a branch name",
      "The implication of creating a branch is that this impacts you/your team",
      'If there is an impact to some "other" entity, it does not necessarily have to be mentioned in a branch name'
    ]
  },
  OTHER_WORDS: {
    id: "ticketTypes",
    values: ["spike", "story", "bug"],
    resultType: RESULT_TYPE.WARNINGS,
    resultHeading: "Filler words"
  },
  PHRASES: { id: "phrases", values: ["based on"] },
  PREPOSITIONS: {
    id: "prepositions",
    values: ["before", "towards", "under", "with", "in", "on", "to", "is"],
    resultType: RESULT_TYPE.WARNINGS,
    resultHeading: "Prepositions add bloat",
    resultContent: [
      "Most times, branch names to not need to describe relationships between 2 things",
      'Words such as "in", "on", "to", "is" can be safely removed and the meaning can still be conveyed'
    ]
  },
  PROPER_NOUNS: {
    id: "properNouns",
    values: ["My Supporter Account", "Prod", "Dev", "QA"],
    resultType: RESULT_TYPE.WARNINGS,
    resultHeading: "Avoid using proper nouns",
    resultContent: [""]
  }
};

export const SPECIAL_CHARACTERS = {
  id: "specialCharacters",
  values: ["[–—\":“‘’”'!?()\\[\\].,\\\\]"],
  resultType: RESULT_TYPE.ERRORS,
  resultHeading: "Special characters",
  resultContent: [
    "You should only use letters and numbers in branch names",
    "Some special characters will cause unwanted behavior in the command line"
  ]
};

export const WORD_SEPARATORS = {
  id: "wordSeparators",
  values: ["[-/_ ]"],
  resultType: RESULT_TYPE.EXPLANATIONS,
  resultHeading: "Special characters replaced with underscores",
  resultContent: [
    'Dashes ("-"), forward slashes ("/"), and spaces (" ") are replaced with underscores',
    "This maintains consistency across branch names, and prevents unwanted behavior when creating a branch name with characters unsupported by a CLI"
  ]
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
