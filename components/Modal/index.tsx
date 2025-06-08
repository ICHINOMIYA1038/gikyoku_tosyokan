import React from "react";

function Modal({ isOpen, onClose, children }: any) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-8 rounded shadow-lg z-50 relative">
        <button
          className="absolute top-0 right-0 p-2 text-gray-700 hover:text-red-600 focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
