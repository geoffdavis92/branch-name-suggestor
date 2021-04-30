import React from "react";
import {
  CONSECUTIVE_DUPLICATE_WORDS,
  CRITERIA,
  ENVIRONMENTS,
  GRAMMAR,
  SPECIAL_CHARACTERS,
  SUGGESTED,
  TICKET_TYPES,
  UNDERSCORES,
  WORD_SEPARATORS
} from "./constants";
import { createFilterRegex, isTextChanged } from "./functions";

/**
 * Generates Jira-style ticket identifier for given team/ticket IDs
 * @param {{ teamId: string, ticketId: string}} branchPrefixState
 *  React state object tracking team and ticket IDs
 */
export function useBranchPrefix(branchPrefixState = {}) {
  const { teamId = "", ticketId = "" } = branchPrefixState;
  const [teamIdText = "", setTeamIdText] = React.useState(teamId);
  const [ticketIdText = "", setTicketIdText] = React.useState(ticketId);

  const computedBranchPrefix =
    teamIdText && ticketIdText ? `${teamIdText}-${ticketIdText}` : "";

  return [computedBranchPrefix, setTeamIdText, setTicketIdText];
}

/**
 * Filters branch text to remove unwanted words
 * @param {string} text Text to send through grammar filters
 */
export function useFilterText(text) {
  const [textToFilter, setTextToFilter] = React.useState(text.trim());
  const filterPropertiesUsed = React.useRef(new Set());

  /**
   * Filter out specific words based on grammatical category
   */
  const textPhrasesReplaced = GRAMMAR.PHRASES.values.reduce(
    (filterText, phrase) => {
      const phraseRegex = createFilterRegex(phrase);
      const filterResult = filterText.replace(phraseRegex, "_");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(GRAMMAR.PHRASES.id);
      }

      return filterResult;
    },
    textToFilter
  );
  const textArticlesReplaced = GRAMMAR.ARTICLES.values.reduce(
    (filterText, article) => {
      const articleRegex = createFilterRegex(article);
      const filterResult = filterText.replace(articleRegex, "_");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(GRAMMAR.ARTICLES.id);
      }

      return filterResult;
    },
    textPhrasesReplaced
  );
  const textConjunctionsReplaced = GRAMMAR.CONJUNCTIONS.values.reduce(
    (filterText, conjunction) => {
      const conjunctionRegex = createFilterRegex(conjunction);
      const filterResult = filterText.replace(conjunctionRegex, "_");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(GRAMMAR.CONJUNCTIONS.id);
      }

      return filterResult;
    },
    textArticlesReplaced
  );
  const textNounsReplaced = GRAMMAR.NOUNS.values.reduce((filterText, noun) => {
    const nounRegex = createFilterRegex(noun);
    const filterResult = filterText.replace(nounRegex, "_");

    if (isTextChanged(filterText, filterResult)) {
      filterPropertiesUsed.current.add(GRAMMAR.NOUNS.id);
    }

    return filterResult;
  }, textConjunctionsReplaced);
  const textPrepositionsReplaced = GRAMMAR.PREPOSITIONS.values.reduce(
    (filterText, preposition) => {
      const prepositionRegex = createFilterRegex(preposition);
      const filterResult = filterText.replace(prepositionRegex, "_");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(GRAMMAR.PREPOSITIONS.id);
      }

      return filterResult;
    },
    textNounsReplaced
  );
  const textEnvironmentsReplaced = ENVIRONMENTS.values.reduce(
    (filterText, environment) => {
      const environmentRegex = createFilterRegex(environment);
      const filterResult = filterText.replace(environmentRegex, "_");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(ENVIRONMENTS.id);
      }

      return filterResult;
    },
    textPrepositionsReplaced
  );
  const textTicketTypesReplaced = TICKET_TYPES.values.reduce(
    (filterText, ticketType) => {
      const ticketTypeRegex = createFilterRegex(ticketType);
      const filterResult = filterText.replace(ticketTypeRegex, "_");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(TICKET_TYPES.id);
      }

      return filterResult;
    },
    textEnvironmentsReplaced
  );

  /**
   * Special character behavior
   */

  // Filter out special characters
  const textSpecialCharactersRemoved = SPECIAL_CHARACTERS.values.reduce(
    (filterText, specialCharPattern) => {
      const specialCharRegex = new RegExp(specialCharPattern, "gi");
      const filterResult = filterText.replace(specialCharRegex, "_");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(SPECIAL_CHARACTERS.id);
      }

      return filterResult;
    },
    textTicketTypesReplaced
  );

  // Replace word-separating characters with spaces
  const textCharForSpacesReplaced = WORD_SEPARATORS.values.reduce(
    (filterText, wordSeparatorPattern) => {
      const wordSeparatorRegex = new RegExp(wordSeparatorPattern, "gi");
      const filterResult = filterText.replace(wordSeparatorRegex, " ");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(WORD_SEPARATORS.id);
      }

      return filterResult;
    },
    textSpecialCharactersRemoved
  );

  /**
   * Formatting based on preferred style
   */
  const textTestedForInputUnderscores = UNDERSCORES.values.reduce(
    (filterText, underscorePattern) => {
      const underscoreRegex = new RegExp(underscorePattern, "gi");
      const filterResult = underscoreRegex.test(filterText);

      if (filterResult) {
        filterPropertiesUsed.current.add(UNDERSCORES.id);
      }

      return filterText;
    },
    textCharForSpacesReplaced
  );

  // Trim value, replace spaces with underscores
  const textSpacesReplaced = textTestedForInputUnderscores
    .trim()
    .replace(/\s+/g, "_");

  // Make text lowercase
  const textToLowerCase = textSpacesReplaced.toLowerCase();

  // Remove duplicated words
  const textDuplicatedWordsRemoved = textToLowerCase
    .split("_")
    .filter((word) => word.length)
    .map((word, i, arr) => {
      /**
       * If not the first element in the array AND if the current
       *  word equals the previous word in the array, return with
       *  an empty string
       *
       * This removes duplicate words when mapping is complete
       */
      if (i > 0 && word === arr[i - 1]) {
        filterPropertiesUsed.current.add(CONSECUTIVE_DUPLICATE_WORDS.id);

        return "";
      }

      return word;
    })
    .join("_")
    .replace(/_+/g, "_")
    .replace(/_$/, "");

  // Store used filter properties in order to reset Set
  const capturedFilterProperties = Array.from(filterPropertiesUsed.current);

  // reset used filter properties set
  filterPropertiesUsed.current = new Set();

  return [
    textDuplicatedWordsRemoved,
    setTextToFilter,
    capturedFilterProperties
  ];
}

/**
 *
 * @param {string[]} matchedCriteria
 */
export function useGroupCriteriaByResultType(matchedCriteria) {
  if (matchedCriteria.length) {
    const criteriaProperties = matchedCriteria.reduce((props, criteriaId) => {
      const criteriaVal = { id: criteriaId, ...CRITERIA[criteriaId] };

      // Create property for resultType if it doesn't exist already
      if (!props.hasOwnProperty(criteriaVal.resultType)) {
        props[criteriaVal.resultType] = {};
      }

      /**
       * Set criteria object to computed property path based on
       *  result type and criteria ID
       */
      props[criteriaVal.resultType][criteriaId] = criteriaVal;

      return props;
    }, {});

    return criteriaProperties;
  } else {
    return {};
  }
}

export function useSuggestions(suggBranchName) {
  const suggestions = React.useRef(new Set());

  if (suggBranchName.length) {
    // Split post-prefix branch name by underscores
    const wordArray = suggBranchName.split("_");

    const wordCount = wordArray.length;
    const averageWordLength = wordArray.reduce((total, word) => {
      const [lastWord] = wordArray.slice(-1);

      total += word.length;

      if (word === lastWord) {
        total = total / wordCount;
      }

      return total;
    }, 0);

    if (wordCount < SUGGESTED.MIN_WORD_COUNT.value) {
      suggestions.current.add(SUGGESTED.MIN_WORD_COUNT.id);
    }

    if (wordCount > SUGGESTED.MAX_WORD_COUNT.value) {
      suggestions.current.add(SUGGESTED.MAX_WORD_COUNT.id);
    }

    if (averageWordLength > SUGGESTED.AVG_WORD_LENGTH.value) {
      suggestions.current.add(SUGGESTED.AVG_WORD_LENGTH.id);
    }
  }
  const capturedSuggestions = Array.from(suggestions.current);

  // Reset
  suggestions.current = new Set();

  return capturedSuggestions;
}
