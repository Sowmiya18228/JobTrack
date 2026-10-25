import React from "react";
import { CheckCircle2, Info, X } from "lucide-react";

function Toast({ message, type = "success", onClose }) {
  const Icon = type === "info" ? Info : CheckCircle2;

  return (
    <div className={`toast ${type}`}>
      <Icon size={18} />
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close notification">
        <X size={15} />
      </button>
    </div>
  );
}

export default Toast;