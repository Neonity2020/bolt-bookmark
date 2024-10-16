import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import BookmarkCard from './components/BookmarkCard';
import AddBookmarkModal from './components/AddBookmarkModal';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  color: string;
}

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  useEffect(() => {
    // Load bookmarks from localStorage when the component mounts
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  useEffect(() => {
    // Save bookmarks to localStorage whenever the bookmarks state changes
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (bookmark: Bookmark) => {
    setBookmarks([...bookmarks, bookmark]);
    setIsModalOpen(false);
  };

  const editBookmark = (bookmark: Bookmark) => {
    const updatedBookmarks = bookmarks.map((b) =>
      b.id === bookmark.id ? bookmark : b
    );
    setBookmarks(updatedBookmarks);
    setEditingBookmark(null);
    setIsModalOpen(false);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  const moveBookmark = (fromIndex: number, toIndex: number) => {
    const updatedBookmarks = [...bookmarks];
    const [movedBookmark] = updatedBookmarks.splice(fromIndex, 1);
    updatedBookmarks.splice(toIndex, 0, movedBookmark);
    setBookmarks(updatedBookmarks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Web Navigation</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bookmarks.map((bookmark, index) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={() => {
                setEditingBookmark(bookmark);
                setIsModalOpen(true);
              }}
              onDelete={() => deleteBookmark(bookmark.id)}
              onMoveUp={() => index > 0 && moveBookmark(index, index - 1)}
              onMoveDown={() => index < bookmarks.length - 1 && moveBookmark(index, index + 1)}
            />
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-40 bg-white bg-opacity-50 rounded-lg shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <Plus size={24} />
            <span className="ml-2">Add Bookmark</span>
          </button>
        </div>
      </div>
      {isModalOpen && (
        <AddBookmarkModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingBookmark(null);
          }}
          onSave={editingBookmark ? editBookmark : addBookmark}
          editingBookmark={editingBookmark}
        />
      )}
    </div>
  );
}

export default App;