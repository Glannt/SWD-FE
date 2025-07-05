import { useState } from "react";
import { Modal } from "../ui/modal";

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: () => Promise<boolean>;
}

export const NotificationPermissionModal = ({
  isOpen,
  onClose,
  onEnable,
}: NotificationPermissionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEnable = async () => {
    setLoading(true);
    setError("");
    const granted = await onEnable();
    setLoading(false);
    if (granted) {
      onClose();
    } else {
      setError(
        "Bạn cần cho phép quyền thông báo để nhận thông báo từ hệ thống."
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold mb-2">Bật thông báo</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Hãy cho phép nhận thông báo để không bỏ lỡ các cập nhật quan trọng từ
          hệ thống.
        </p>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-3 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            onClick={handleEnable}
            disabled={loading}
            aria-label="Bật thông báo"
          >
            {loading ? "Đang bật..." : "Bật thông báo"}
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
            onClick={onClose}
            aria-label="Để sau"
          >
            Để sau
          </button>
        </div>
      </div>
    </Modal>
  );
};
