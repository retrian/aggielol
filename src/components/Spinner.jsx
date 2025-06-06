// src/components/Spinner.jsx
import spinnerSrc from "../assets/spinner.gif";

export default function Spinner({ size = 40 }) {
  return (
    <img
      src={spinnerSrc}
      alt="Loading…"
      width={size}
      height={size}
      className="mx-auto"
    />
  );
}
