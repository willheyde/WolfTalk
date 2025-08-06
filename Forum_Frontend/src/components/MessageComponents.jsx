// components/MessageComponents.jsx
import React from "react";

/* Simple utility to join class names without pulling in clsx */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * A container for light-weight UI primitives that mimic the API of
 * shadcn/ui.  Import the named exports as needed:
 *
 *   import { Card, CardHeader, CardContent, Button } from "./MessageComponents";
 */
class MessageComponents {
  /* ------------------------------------------------------------------ */
  /* Card                                                               */
  /* ------------------------------------------------------------------ */
  static Card = ({ className = "", children, ...rest }) => (
    <div
      {...rest}
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );

  /* Header inside a Card */
  static CardHeader = ({ className = "", children, ...rest }) => (
    <div
      {...rest}
      className={cn(
        "px-6 py-4 border-b border-gray-200 first:rounded-t-lg",
        className
      )}
    >
      {children}
    </div>
  );

  /* Body/content inside a Card */
  static CardContent = ({ className = "", children, ...rest }) => (
    <div {...rest} className={cn("px-6 py-4", className)}>
      {children}
    </div>
  );

  /* ------------------------------------------------------------------ */
  /* Button                                                             */
  /* ------------------------------------------------------------------ */
  static Button = ({
    variant = "primary",
    className = "",
    children,
    ...rest
  }) => {
    const variants = {
      primary:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50",
      secondary:
        "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:opacity-50",
    };

    return (
      <button
        {...rest}
        className={cn(
          "inline-flex items-center rounded-md px-4 py-2 text-sm font-medium",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
          variants[variant] ?? variants.primary,
          className
        )}
      >
        {children}
      </button>
    );
  };
}

/* Named exports */
export const { Card, CardHeader, CardContent, Button } = MessageComponents;
export default MessageComponents;