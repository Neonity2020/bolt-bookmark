import React from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  color: string;
  description?: string;
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onEdit, onDelete, onMoveUp, onMoveDown }) => {
  return (
    <div className={`rounded-lg shadow-md overflow-hidden flex flex-col ${bookmark.color}`}>
      <div className="flex-grow p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{bookmark.title}</h3>
        {bookmark.description && (
          <p className="text-sm text-white mb-2">{bookmark.description}</p>
        )}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white hover:underline"
        >
          {bookmark.url}
        </a>
      </div>
      <div className="bg-white bg-opacity-20 p-2 flex justify-between">
        <div>
          <button
            onClick={onMoveUp}
            className="text-white hover:text-gray-200 mr-2"
          >
            <ChevronUp size={18} />
          </button>
          <button
            onClick={onMoveDown}
            className="text-white hover:text-gray-200"
          >
            <ChevronDown size={18} />
          </button>
        </div>
        <div>
          <button
            onClick={onEdit}
            className="text-white hover:text-gray-200 mr-2"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="text-white hover:text-gray-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;
