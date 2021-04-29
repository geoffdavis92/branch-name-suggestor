export const RESULT_TYPE = {
  ERRORS: "errors",
  EXPLANATIONS: "explanations",
  SUGGESTIONS: "suggestions",
  WARNINGS: "warnings"
};

export const SUGGESTED = {
  AVG_WORD_LENGTH: {
    id: "averageWordLength",
    value: 7,
    resultType: RESULT_TYPE.SUGGESTIONS,
    resultHeading: "Try abbreviating words",
    resultContent: [
      "Branch names, like variables and properties in code, can be abbreviated when desired",
      "Feel free to shorten longer words with thoughtful abbreviations to keep branch names short and sweet"
    ]
  },
  MIN_WORD_COUNT: {
    id: "minWordCount",
    value: 2,
    resultType: RESULT_TYPE.WARNINGS,
    resultHeading: "Use more words"
  },
  MAX_WORD_COUNT: {
    id: "maxWordCount",
    value: 5,
    resultType: RESULT_TYPE.SUGGESTIONS,
    resultHeading: "Try using fewer words",
    resultContent: [
      "Branch names do not need to be very long",
      "Shorter branch names allow for easier recall and typing",
      "Try using 5 or fewer words"
    ]
  }
};

export const CONSECUTIVE_DUPLICATE_WORDS = {
  id: "consecutiveDuplicateWords",
  resultType: RESULT_TYPE.ERRORS,
  resultHeading: "Duplicated word",
  resultContent: [
    "Consecutively repeated words should be removed",
    "This may be a mistake, or a result of branch auto-formatting"
  ]
};

export const ENVIRONMENTS = {
  id: "environments",
  values: ["environment", "Production", "Prod", "Development", "Dev", "QA"],
  resultType: RESULT_TYPE.WARNINGS,
  resultHeading: "Avoid using environment names",
  resultContent: [
    "Code that is merged into the master branch will reach all environments, from local to production",
    "It is more important to describe the work that will be done, not the environment a bug/change is needed in"
  ]
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
    id: "fillerWords",
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
      "Sometimes, this can be confusing as there is no clear subject that is being addressed",
      "The implication of creating a branch is that this impacts you, your team, or your application"
    ]
  },
  PHRASES: { id: "phrases", values: ["based on"] },
  PREPOSITIONS: {
    id: "fillerWords",
    values: ["before", "towards", "under", "with", "in", "on", "to", "is"],
    resultType: RESULT_TYPE.WARNINGS,
    resultHeading: "Unnecessary filler words",
    resultContent: [
      "Conjunctions, prepositions, and other non-technical/identifying words are not necessary in branch names",
      "These types of words can be safely removed and the meaning can still be conveyed",
      "This prevents unnecessarily long/verbose branch names, and makes it easier to both remember and type out"
    ],
    resultExamples: [
      "unless",
      "than",
      "and",
      "for",
      "yet",
      "so",
      "or",
      "before",
      "with",
      "in",
      "on"
    ]
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

export const TICKET_TYPES = {
  id: "ticketTypes",
  values: ["spike", "story", "bug"],
  resultType: RESULT_TYPE.WARNINGS,
  resultHeading: "Avoid mentioning ticket types",
  resultContent: [
    "Branches don't need to discriminate between ticket types",
    "The ticket ID prefixing the branch name provides a link to the specific ticket where this can be seen"
  ]
};

export const UNDERSCORES = {
  id: "underscores",
  values: ["[ ]"],
  resultType: RESULT_TYPE.EXPLANATIONS,
  resultHeading: "Underscores in branch names",
  resultContent: [
    "Underscores are used to space out branch names, after the team/ticket ID prefix",
    "If a branch has to be copy/pasted, one can simply double click on the branch name to select the full text",
    "Underscores are automatically added for spaces and certain other characters, and consecutive underscores are replaced with a single underscore character"
  ]
};

export const WORD_SEPARATORS = {
  id: "wordSeparators",
  values: ["[-/]"],
  resultType: RESULT_TYPE.EXPLANATIONS,
  resultHeading: "Special characters replaced with underscores",
  resultContent: [
    'Dashes ("-"), forward slashes ("/"), and spaces (" ") are replaced with underscores',
    "This maintains consistency across branch names, and prevents unwanted behavior when creating a branch name with characters unsupported by a CLI"
  ]
};

export const CRITERIA = [
  CONSECUTIVE_DUPLICATE_WORDS,
  ENVIRONMENTS,
  ...Object.values(GRAMMAR),
  SPECIAL_CHARACTERS,
  ...Object.values(SUGGESTED),
  TICKET_TYPES,
  UNDERSCORES,
  WORD_SEPARATORS
].reduce((criteriaMap, constant) => {
  const { id, ...restConstant } = constant;

  criteriaMap[id] = restConstant;

  return criteriaMap;
}, {});
