import { X } from 'lucide-react';

interface StatusMessageProps {
  message: { type: 'success' | 'error'; text: string } | null;
  onClose: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`admin-status-message ${message.type}`}>
      {message.text}
      <button className="admin-status-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default StatusMessage;

