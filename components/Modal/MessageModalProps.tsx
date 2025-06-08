import React from "react";

interface MessageModalProps {
  type: "error" | "success";
  message: string;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({
  type,
  message,
  onClose,
}) => {
  const messageClasses =
    type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white";

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className={messageClasses}>
          <p>{message}</p>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
