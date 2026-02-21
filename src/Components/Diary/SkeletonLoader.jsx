import React from "react";
import { motion } from "framer-motion";

function SkeletonLoader() {
  return (
    <motion.div
      className="skeleton-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="skeleton-header">
        <div className="skel skel-title" />
        <div className="skel skel-badge" />
      </div>
      <div className="skel skel-meta" />
      <div className="skel skel-textarea" />
      <div className="skeleton-btns">
        <div className="skel skel-btn" />
        <div className="skel skel-btn" />
        <div className="skel skel-btn" />
      </div>
    </motion.div>
  );
}

export default SkeletonLoader;
