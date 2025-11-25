import React, { useEffect, useRef, useState } from "react";

// Example shadcn OTP Input Component
// - Default export is a React component
// - Uses Tailwind classes for styling so it fits in a shadcn/Tailwind app
// - Features: keyboard navigation, paste support, autoFocus, numeric-only option,
//   controlled/uncontrolled usage, onComplete callback, accessibility attributes

export type OTPInputProps = {
  length?: number;
  value?: string; // if provided, component is controlled
  defaultValue?: string; // uncontrolled initial value
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void; // called when all digits filled
  autoFocus?: boolean;
  isNumeric?: boolean;
  inputClassName?: string;
  gapClass?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

export default function OTPInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  autoFocus = true,
  isNumeric = true,
  inputClassName = "w-12 h-16 lg:w-16 lg:h-20 rounded-[10px] border border-gray-300 font-dm text-center text-lg lg:text-2xl focus:outline-none focus:ring-1 focus:ring-custom-secondary",
  gapClass = "gap-2",
  disabled = false,
  "aria-label": ariaLabel = "One-time passcode input",
}: OTPInputProps) {
  const isControlled = typeof value === "string";
  const [internal, setInternal] = useState(() => {
    const start = (isControlled ? value! : defaultValue).padEnd(length, "").slice(0, length);
    return start.split("");
  });

  // keep refs for focus control
  const inputsRef = useRef<Array<HTMLInputElement | null>>(Array(length).fill(null));

  // sync controlled value
  useEffect(() => {
    if (isControlled) {
      const val = (value ?? "").padEnd(length, "").slice(0, length);
      setInternal(val.split(""));
    }
  }, [value, length, isControlled]);

  // helper to get current value string
  const getValue = (arr = internal) => arr.join("").trim();

  // call onChange
  const triggerChange = (arr: string[]) => {
    const newVal = arr.join("");
    onChange?.(newVal);
    if (!isControlled) setInternal(arr);
    // if complete
    if (newVal.length === length && !newVal.includes("")) {
      onComplete?.(newVal);
    }
  };

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
      inputsRef.current[0].select();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (disabled) return;
    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault();
      const next = [...internal];
      if (next[idx]) {
        next[idx] = "";
        triggerChange(next);
        // keep focus
        inputsRef.current[idx]?.focus();
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        next[idx - 1] = "";
        triggerChange(next);
      }
      return;
    }

    if (key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
      return;
    }
    if (key === "ArrowRight" && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
      return;
    }

    // allow navigation keys, tab, etc.
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    if (disabled) return;
    const raw = e.target.value;
    let char = raw;

    if (isNumeric) {
      // only keep digits
      char = raw.replace(/[^0-9]/g, "");
    } else if (raw.length > 1) {
      // keep just first character for non-numeric
      char = raw.charAt(0);
    }

    // if user pasted many characters (length > 1), distribute
    if (char.length > 1) {
      const next = [...internal];
      const chars = char.split("");
      for (let i = idx; i < length && chars.length; i++) {
        next[i] = chars.shift() ?? "";
      }
      triggerChange(next);

      // focus the next empty
      const firstEmpty = next.findIndex((c) => !c);
      if (firstEmpty >= 0) {
        inputsRef.current[firstEmpty]?.focus();
      } else {
        inputsRef.current[length - 1]?.focus();
      }

      return;
    }

    // normal single char input
    const next = [...internal];
    next[idx] = char;
    triggerChange(next);

    if (char && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
      inputsRef.current[idx + 1]?.select();
    }
  };

  // handle paste event for whole code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    if (disabled) return;
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const sanitized = isNumeric ? paste.replace(/[^0-9]/g, "") : paste;
    if (!sanitized) return;

    const next = [...internal];
    const chars = sanitized.split("");
    for (let i = idx; i < length && chars.length; i++) {
      next[i] = chars.shift() ?? "";
    }
    triggerChange(next);

    const firstEmpty = next.findIndex((c) => !c);
    if (firstEmpty >= 0) inputsRef.current[firstEmpty]?.focus();
    else inputsRef.current[length - 1]?.focus();
  };

  return (
    <div role="group" aria-label={ariaLabel} className={`flex ${gapClass} justify-center`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type={isNumeric ? "tel" : "text"}
          inputMode={isNumeric ? "numeric" : "text"}
          maxLength={1}
          value={internal[i] ?? ""}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          className={`${inputClassName} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      ))}
    </div>
  );
}

// -----------------------
// USAGE EXAMPLE
// -----------------------
// import OTPInput from './shadcn-otp-input';
//
// function Example() {
//   const [code, setCode] = useState("");
//   return (
//     <div className="p-4">
//       <h3 className="mb-2">Enter verification code</h3>
//       <OTPInput length={6} value={code} onChange={setCode} onComplete={(v) => console.log('complete', v)} />
//     </div>
//   );
// }
