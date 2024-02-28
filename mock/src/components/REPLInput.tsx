import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { REPLFunction } from "./REPLFunction";
import { commandMap, setCommandMap } from "./Commands";

/**
 * Defines the props that gets passed into the function utilizing the history and dispatch.
 */
interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
  verbose: boolean;
  setVerbose: Dispatch<SetStateAction<boolean>>;
}

export function REPLInput(props: REPLInputProps) {
  setCommandMap();

  const [commandString, setCommandString] = useState<string>("");

  // For simplicity, invalid commands will be one line on the history
  function handleSubmit(commandString: string) {
    const tokens = commandString.trim().split(/\s+/);
    const commandName = tokens[0];
    const commandArgs = tokens.slice(1);

    const command = commandMap.get(commandName);

    // Check if the command exists in the command map
    if (command) {
      // Execute the command function
      const result = command(commandArgs, props.setVerbose);
      // Handle special cases for mode commands and the history of changing to that mode
      if (commandName === "mode") {
        if (commandArgs[0] === "brief") {
          props.setHistory([...props.history, result]);
        } else if (commandArgs[0] === "verbose") {
          props.setHistory([
            ...props.history,
            "Command: " + commandString,
            "Output: " + result,
          ]);
        } else {
          // Handle invalid mode arguments
          props.setHistory([
            ...props.history,
            "Invalid mode argument. Use 'brief' or 'verbose'.",
          ]);
        }
      } else {
        // For other commands, simply add the result to history
        props.setHistory([...props.history, result]);
      }
    } else {
      // Handle unknown commands
      if (props.verbose) {
        props.setHistory([...props.history, "Unknown command: " + commandName]);
      }
    }
    // Clear the command input
    setCommandString("");
  }

  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>Submit</button>
      <div>
        <legend>Current Mode: {props.verbose ? "verbose" : "brief"}</legend>
      </div>
    </div>
  );
}
