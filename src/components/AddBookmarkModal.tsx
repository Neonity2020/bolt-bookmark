import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  color: string;
  description: string; // 新增描述字段
}

interface AddBookmarkModalProps {
  onClose: () => void;
  onSave: (bookmark: Bookmark) => void;
  editingBookmark: Bookmark | null;
  folder: 'default' | 'custom';  // 添加这一行
}

const colorOptions = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({ onClose, onSave, editingBookmark }) => {
  const [title, setTitle] = useState(editingBookmark?.title || '');
  const [url, setUrl] = useState(editingBookmark?.url || '');
  const [color, setColor] = useState(editingBookmark?.color || '#3B82F6');
  const [description, setDescription] = useState(editingBookmark?.description || ''); // 新增

  useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.title);
      setUrl(editingBookmark.url);
      setColor(editingBookmark.color);
      setDescription(editingBookmark.description); // 新增
    }
  }, [editingBookmark]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editingBookmark?.id || Date.now().toString(),
      title,
      url,
      color,
      description, // 新增
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`w-8 h-8 rounded-full ${option} ${
                    color === option ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setColor(option)}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            {editingBookmark ? 'Update Bookmark' : 'Add Bookmark'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookmarkModal;
