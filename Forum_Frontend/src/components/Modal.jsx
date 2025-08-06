import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Modal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center"
      >
        <h2 className="text-xl font-bold mb-2">{title || "Are you sure?"}</h2>
        <p className="mb-6 text-gray-600">{message || "This action cannot be undone."}</p>
        <div className="flex justify-center gap-4">
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </motion.div>
    </div>
  );
}
