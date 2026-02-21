import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

const ICONS = {
  success: <CheckCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
  error: <AlertTriangle size={18} />,
};

function Toast({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast toast-${toast.type || "info"}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <span className="toast-icon">{ICONS[toast.type || "info"]}</span>
            <span className="toast-msg">{toast.message}</span>
            <button className="toast-close" onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default Toast;
