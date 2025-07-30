
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StickyNote, Plus, X, Download, Upload } from 'lucide-react';
import WidgetSettingsPanel, { WidgetSettingsOption } from '@/components/WidgetSettingsPanel';

interface Note {
  id: string;
  text: string;
  timestamp: number;
}

const QuickNotesWidget: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [maxNotes, setMaxNotes] = useState(5);
  const [showTimestamps, setShowTimestamps] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem('quick-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem('quick-notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        text: newNote.trim(),
        timestamp: Date.now()
      };
      const updatedNotes = [note, ...notes].slice(0, maxNotes);
      saveNotes(updatedNotes);
      setNewNote('');
    }
  };

  const removeNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };

  const clearAllNotes = () => {
    saveNotes([]);
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quick-notes.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importNotes = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedNotes = JSON.parse(e.target?.result as string);
            if (Array.isArray(importedNotes)) {
              saveNotes(importedNotes.slice(0, maxNotes));
            }
          } catch (error) {
            console.error('Failed to import notes:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const customOptions: WidgetSettingsOption[] = [
    {
      type: 'input',
      key: 'max-notes',
      label: 'Maximum Notes',
      value: maxNotes.toString(),
      onChange: (value: string) => {
        const num = Math.max(1, Math.min(20, parseInt(value) || 5));
        setMaxNotes(num);
      },
      description: 'Max number of notes to display (1-20)'
    },
    {
      type: 'switch',
      key: 'show-timestamps',
      label: 'Show Timestamps',
      value: showTimestamps,
      onChange: setShowTimestamps,
      description: 'Display creation time for each note'
    },
    {
      type: 'divider',
      key: 'divider-1'
    },
    {
      type: 'button',
      key: 'clear-all',
      label: 'Clear All Notes',
      onClick: clearAllNotes,
      icon: <X className="h-3 w-3" />,
      danger: true
    }
  ];

  return (
    <Card className="p-4 h-full relative">
      <WidgetSettingsPanel
        widgetTitle="Quick Notes"
        customOptions={customOptions}
        onExport={exportNotes}
        onImport={importNotes}
        onDelete={() => console.log('Delete widget')}
      />
      
      <div className="flex items-center space-x-2 mb-4">
        <StickyNote className="h-5 w-5 text-yellow-500" />
        <h3 className="font-semibold">Quick Notes</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex space-x-2">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a quick note..."
            className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background"
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
          />
          <Button size="sm" onClick={addNote}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="flex items-start justify-between p-2 bg-accent rounded text-sm">
              <div className="flex-1">
                <span className="block truncate">{note.text}</span>
                {showTimestamps && (
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(note.timestamp)}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNote(note.id)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive ml-2 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        {notes.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-4">
            No notes yet. Add one above!
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuickNotesWidget;
