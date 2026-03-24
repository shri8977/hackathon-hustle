import { useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Full Name"
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Avatar URL"
          />
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
