import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, type: "spring", stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon">
              <AlertTriangle size={28} />
            </div>
            <h3 className="modal-title">{title}</h3>
            <p className="modal-message">{message}</p>
            <div className="modal-actions">
              <motion.button
                className="modal-btn modal-cancel"
                onClick={onCancel}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className="modal-btn modal-confirm"
                onClick={onConfirm}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;
