import React from "react";
import {
  CONSECUTIVE_DUPLICATE_WORDS,
  CRITERIA,
  GRAMMAR,
  SPECIAL_CHARACTERS,
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
  const [textToFilter, setTextToFilter] = React.useState(text);
  const filterPropertiesUsed = React.useRef(new Set());

  /**
   * Filter out specific words based on grammatical category
   */
  const textPhrasesReplaced = GRAMMAR.PHRASES.values.reduce(
    (filterText, phrase) => {
      const phraseRegex = createFilterRegex(phrase);
      const filterResult = filterText.replace(phraseRegex, "");

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
      const filterResult = filterText.replace(articleRegex, "");

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
      const filterResult = filterText.replace(conjunctionRegex, "");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(GRAMMAR.CONJUNCTIONS.id);
      }

      return filterResult;
    },
    textArticlesReplaced
  );
  const textNounsReplaced = GRAMMAR.NOUNS.values.reduce((filterText, noun) => {
    const nounRegex = createFilterRegex(noun);
    const filterResult = filterText.replace(nounRegex, "");

    if (isTextChanged(filterText, filterResult)) {
      filterPropertiesUsed.current.add(GRAMMAR.NOUNS.id);
    }

    return filterResult;
  }, textConjunctionsReplaced);
  const textPrepositionsReplaced = GRAMMAR.PREPOSITIONS.values.reduce(
    (filterText, preposition) => {
      const prepositionRegex = createFilterRegex(preposition);
      const filterResult = filterText.replace(prepositionRegex, "");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(GRAMMAR.PREPOSITIONS.id);
      }

      return filterResult;
    },
    textNounsReplaced
  );
  const textProperNounsReplaced = GRAMMAR.PROPER_NOUNS.values.reduce(
    (filterText, properNoun) => {
      const properNounRegex = createFilterRegex(properNoun);
      const filterResult = filterText.replace(properNounRegex, "");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(GRAMMAR.PROPER_NOUNS.id);
      }

      return filterResult;
    },
    textPrepositionsReplaced
  );
  const textOtherWordsReplaced = GRAMMAR.OTHER_WORDS.values.reduce(
    (filterText, otherWord) => {
      const otherWordRegex = createFilterRegex(otherWord);
      const filterResult = filterText.replace(otherWordRegex, "");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(GRAMMAR.OTHER_WORDS.id);
      }

      return filterResult;
    },
    textProperNounsReplaced
  );

  /**
   * Special character behavior
   */

  // Filter out special characters
  const textSpecialCharactersRemoved = SPECIAL_CHARACTERS.values.reduce(
    (filterText, specialCharPattern) => {
      const specialCharRegex = new RegExp(specialCharPattern, "gi");
      const filterResult = filterText.replace(specialCharRegex, "");

      if (isTextChanged(filterText, filterResult)) {
        filterPropertiesUsed.current.add(SPECIAL_CHARACTERS.id);
      }

      return filterResult;
    },
    textOtherWordsReplaced
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

  // Trim value, replace spaces with underscores
  const textSpacesReplaced = textCharForSpacesReplaced
    .trim()
    .replace(/\s+/g, "_");

  // Make text lowercase
  const textToLowerCase = textSpacesReplaced.toLowerCase();

  // Remove duplicated words
  const textDuplicatedWordsRemoved = textToLowerCase
    .split("_")
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
    .replace(/_+/g, "_");

  // Store used filter properties in order to reset Set
  const capturedFilterProperties = filterPropertiesUsed.current;

  // reset used filter properties set
  filterPropertiesUsed.current = new Set();

  return [
    textDuplicatedWordsRemoved,
    setTextToFilter,
    Array.from(capturedFilterProperties)
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
