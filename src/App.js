import React from "react";
import { ConditionalDisplay } from "./components/ConditionalDisplay";
import { Result } from "./components/Result";
import { ResultContainer } from "./components/ResultContainer";
import "./styles.scss";
import { RESULT_TYPE } from "./utils/constants";
import { setupDebounce } from "./utils/functions";
import {
  useBranchPrefix,
  useFilterText,
  useGroupCriteriaByResultType,
  useSuggestions
} from "./utils/hooks";

const TICKET_ID_MAX_LENGTH = 5;

export default function App() {
  const teamIdSelectRef = React.createRef();
  const ticketIdInputRef = React.createRef();
  const branchInputRef = React.createRef();

  const [branchPrefix, setTeamId, setTicketId] = useBranchPrefix({});
  const [filteredText, setTextToFilter, matchedCriteria] = useFilterText("");
  const suggestions = useSuggestions(filteredText);
  const debouncedSetTextToFilter = setupDebounce(setTextToFilter);
  const {
    errors: errorResults,
    warnings: warningResults,
    suggestions: suggestionResults,
    explanations: explanationResults
  } = useGroupCriteriaByResultType([...matchedCriteria, ...suggestions]);

  const conditionallyFocusNextInput = (event) => {
    event.preventDefault();

    if (!branchPrefix.length) {
      if (teamIdSelectRef.current.value === "") {
        teamIdSelectRef.current.focus();
      } else {
        ticketIdInputRef.current.focus();
      }
    }
  };

  return (
    <div className="app-container">
      <div className="compound-input">
        <select
          ref={teamIdSelectRef}
          defaultValue=""
          className="input team-id-input"
          onInput={() => {
            setTeamId(teamIdSelectRef.current.value);

            ticketIdInputRef.current.focus();
          }}
        >
          <option value="" disabled>
            Select…
          </option>
          <option value="CARE">CARE</option>
        </select>
        <input
          ref={ticketIdInputRef}
          type="tel"
          maxLength={TICKET_ID_MAX_LENGTH}
          className="input ticket-id-input"
          placeholder="123"
          onKeyDown={({ code }) => {
            if (code === "Space" && ticketIdInputRef.current.value.length) {
              branchInputRef.current.focus();
            }
          }}
          onInput={() => {
            setTicketId(ticketIdInputRef.current.value);

            if (
              ticketIdInputRef.current.value.length === TICKET_ID_MAX_LENGTH
            ) {
              branchInputRef.current.focus();
            }
          }}
          onBlur={() => {
            ticketIdInputRef.current.value.trim();
          }}
        />
        <input
          ref={branchInputRef}
          type="text"
          className="input branch-input"
          placeholder="Describe what you'll do in this branch…"
          onInput={() => {
            debouncedSetTextToFilter(branchInputRef.current.value);
          }}
          onKeyDown={(keyDownEvent) => {
            switch (keyDownEvent.code) {
              case "Escape":
              case "Enter":
              case "Tab": {
                /**
                 * If any coded-key is pressed, conditionally focus on
                 *  the next input that needs a valid value
                 */
                conditionallyFocusNextInput(keyDownEvent);

                break;
              }
              default: {
                // no-op
                return;
              }
            }
          }}
        />
      </div>
      {branchPrefix.length && filteredText.length ? (
        <>
          <ResultContainer className="branch-name">
            <code className="suggested-branch">
              {branchPrefix}/{filteredText}
            </code>
          </ResultContainer>
          <ConditionalDisplay
            test={!errorResults && !warningResults && !suggestionResults}
          >
            <ResultContainer className="perfect-branch-name">
              <span className="emoji" role="img" aria-label="sparkles emoji">
                ✨
              </span>{" "}
              Looks like you crafted a fantastic branch name{" "}
              <span
                className="emoji"
                role="img"
                aria-label="party buzzer emoji"
              >
                ✨
              </span>
            </ResultContainer>
          </ConditionalDisplay>
          <ConditionalDisplay test={errorResults}>
            <ResultContainer className={RESULT_TYPE.ERRORS} heading="Errors">
              {errorResults
                ? Object.values(errorResults).map((errorData) => (
                    <Result key={errorData.id} data={errorData} />
                  ))
                : null}
            </ResultContainer>
          </ConditionalDisplay>
          <ConditionalDisplay test={warningResults}>
            <ResultContainer
              className={RESULT_TYPE.WARNINGS}
              heading="Warnings"
            >
              {warningResults
                ? Object.values(warningResults).map((warningData) => (
                    <Result key={warningData.id} data={warningData} />
                  ))
                : null}
            </ResultContainer>
          </ConditionalDisplay>
          <ConditionalDisplay test={suggestionResults}>
            <ResultContainer
              className={RESULT_TYPE.SUGGESTIONS}
              heading="Suggestions"
            >
              {suggestionResults
                ? Object.values(suggestionResults).map((suggestionData) => (
                    <Result key={suggestionData.id} data={suggestionData} />
                  ))
                : null}
            </ResultContainer>
          </ConditionalDisplay>
          <ConditionalDisplay test={explanationResults}>
            <ResultContainer
              className={RESULT_TYPE.EXPLANATIONS}
              heading="Explanations"
            >
              {explanationResults
                ? Object.values(explanationResults).map((explanationData) => (
                    <Result key={explanationData.id} data={explanationData} />
                  ))
                : null}
            </ResultContainer>
          </ConditionalDisplay>
        </>
      ) : (
        <p>
          <i>
            Start typing a description to see some suggested branch names :)
          </i>
        </p>
      )}
    </div>
  );
}
