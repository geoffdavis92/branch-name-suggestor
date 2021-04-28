import React from "react";
import { ResultContainer } from "./components/ResultContainer";
import "./styles.scss";
import { CRITERIA, RESULT_TYPE } from "./utils/constants";
import { useBranchPrefix, useFilterText } from "./utils/hooks";

const TICKET_ID_MAX_LENGTH = 5;

export default function App() {
  const teamIdSelectRef = React.createRef();
  const ticketIdInputRef = React.createRef();
  const branchInputRef = React.createRef();

  const [branchPrefix, setTeamId, setTicketId] = useBranchPrefix({});
  const [branchName, setBranchName, matchedCriteria] = useFilterText("");

  const conditionallyFocusNextInput = (event) => {
    event.preventDefault();

    if (!branchPrefix.length) {
      if (teamIdSelectRef.current.value === "") {
        console.log("select team ID");
        teamIdSelectRef.current.focus();
      } else {
        ticketIdInputRef.current.focus();
      }
    }
  };

  if (matchedCriteria.length) {
    console.log(matchedCriteria, CRITERIA["specialCharacters"]);
  }

  return (
    <div className="app-container">
      <div className="compound-input">
        <select
          ref={teamIdSelectRef}
          defaultValue=""
          className="input team-id-input"
          onInput={() => {
            setTeamId(teamIdSelectRef.current.value);

            // ticketIdInputRef.current.focus();
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
            setBranchName(branchInputRef.current.value);
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
      {branchPrefix.length && branchName.length ? (
        <>
          <ResultContainer className="branch-name">
            <p>
              Suggested branch name:
              <br />
              <code className="suggested-branch">
                {branchPrefix}/{branchName}
              </code>
            </p>
          </ResultContainer>
          <ResultContainer
            className={RESULT_TYPE.ERRORS}
            heading="Errors"
          ></ResultContainer>
          <ResultContainer
            className={RESULT_TYPE.WARNINGS}
            heading="Warnings"
          ></ResultContainer>
          <ResultContainer
            className={RESULT_TYPE.SUGGESTIONS}
            heading="Suggestions"
          ></ResultContainer>
        </>
      ) : (
        <p>
          <i>Start typing a branch name to see some suggestions :)</i>
        </p>
      )}
    </div>
  );
}
