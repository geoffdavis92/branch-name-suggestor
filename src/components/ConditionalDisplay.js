import React from "react";

export function ConditionalDisplay({ children, test }) {
  if (test) {
    return <>{children}</>;
  } else {
    return null;
  }
}
