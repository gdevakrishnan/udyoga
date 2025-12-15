import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title || "Confirm Delete"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-2">
            {message || "Are you sure you want to delete this item?"}
          </p>
          {itemName && (
            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="font-medium text-gray-700">Item:</span> {itemName}
            </p>
          )}
          <p className="text-sm text-red-600 mt-4">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;