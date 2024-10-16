import { useState, useEffect, useRef } from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import BookmarkCard from './components/BookmarkCard';
import AddBookmarkModal from './components/AddBookmarkModal';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  color: string;
  description: string; // 新增描述字段
}

const STORAGE_KEY = 'bookmarks';

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    // 初始化状态时从本地存储加载数据
    const savedBookmarks = localStorage.getItem(STORAGE_KEY);
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  useEffect(() => {
    // 当书签状态改变时保存到本地存储
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (bookmark: Bookmark) => {
    setBookmarks(prevBookmarks => [...prevBookmarks, bookmark]);
    setIsModalOpen(false);
  };

  const editBookmark = (bookmark: Bookmark) => {
    setBookmarks(prevBookmarks => 
      prevBookmarks.map(b => b.id === bookmark.id ? bookmark : b)
    );
    setEditingBookmark(null);
    setIsModalOpen(false);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(prevBookmarks => 
      prevBookmarks.filter(bookmark => bookmark.id !== id)
    );
  };

  const moveBookmark = (fromIndex: number, toIndex: number) => {
    setBookmarks(prevBookmarks => {
      const updatedBookmarks = [...prevBookmarks];
      const [movedBookmark] = updatedBookmarks.splice(fromIndex, 1);
      updatedBookmarks.splice(toIndex, 0, movedBookmark);
      return updatedBookmarks;
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportBookmarks = () => {
    const bookmarksJson = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([bookmarksJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookmarks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importBookmarks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedBookmarks = JSON.parse(e.target?.result as string);
          setBookmarks(importedBookmarks);
        } catch (error) {
          console.error('导入书签时出错:', error);
          alert('导入失败，请确保文件格式正确。');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">我的网页导航</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportBookmarks}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
            >
              <Download className="inline-block mr-2" size={18} />
              导出书签
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
            >
              <Upload className="inline-block mr-2" size={18} />
              导入书签
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={importBookmarks}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
