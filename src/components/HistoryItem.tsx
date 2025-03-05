import React from 'react';
import { Clock } from 'lucide-react';
import { ChatHistory } from '../types';

interface HistoryItemProps {
  history: ChatHistory;
  onClick: () => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ history, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 hover:bg-gray-50 transition-colors rounded-lg flex items-start gap-3 border-b"
    >
      <Clock size={16} className="text-gray-400 mt-1" />
      <div className="text-left">
        <h3 className="font-medium text-gray-900">{history.title}</h3>
        <p className="text-sm text-gray-500 truncate">{history.lastMessage}</p>
        <span className="text-xs text-gray-400">
          {new Date(history.timestamp).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
};