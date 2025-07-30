
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bookmark, Plus, X, ExternalLink } from 'lucide-react';

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
}

const BookmarksWidget: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('quick-bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    } else {
      // Default bookmarks
      const defaultBookmarks: BookmarkItem[] = [
        { id: '1', title: 'Gmail', url: 'https://gmail.com' },
        { id: '2', title: 'GitHub', url: 'https://github.com' },
        { id: '3', title: 'Calendar', url: 'https://calendar.google.com' }
      ];
      setBookmarks(defaultBookmarks);
      localStorage.setItem('quick-bookmarks', JSON.stringify(defaultBookmarks));
    }
  }, []);

  const saveBookmarks = (updatedBookmarks: BookmarkItem[]) => {
    localStorage.setItem('quick-bookmarks', JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  };

  const addBookmark = () => {
    if (newTitle.trim() && newUrl.trim()) {
      const bookmark: BookmarkItem = {
        id: Date.now().toString(),
        title: newTitle.trim(),
        url: newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`
      };
      const updatedBookmarks = [...bookmarks, bookmark].slice(0, 6); // Limit to 6
      saveBookmarks(updatedBookmarks);
      setNewTitle('');
      setNewUrl('');
      setShowAddForm(false);
    }
  };

  const removeBookmark = (id: string) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    saveBookmarks(updatedBookmarks);
  };

  const openBookmark = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bookmark className="h-5 w-5 text-indigo-500" />
          <h3 className="font-semibold">Quick Links</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showAddForm && (
        <div className="space-y-2 mb-4 p-2 bg-accent rounded">
          <Input
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="text-sm"
          />
          <div className="flex space-x-1">
            <Button size="sm" onClick={addBookmark}>Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="flex items-center justify-between p-2 bg-accent rounded hover:bg-accent/80 transition-colors">
            <button
              onClick={() => openBookmark(bookmark.url)}
              className="flex-1 text-left flex items-center space-x-2"
            >
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm truncate">{bookmark.title}</span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeBookmark(bookmark.id)}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {bookmarks.length === 0 && !showAddForm && (
        <div className="text-center text-muted-foreground text-sm py-4">
          No bookmarks yet. Add one above!
        </div>
      )}
    </Card>
  );
};

export default BookmarksWidget;
