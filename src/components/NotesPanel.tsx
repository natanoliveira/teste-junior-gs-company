'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/types';
import { formatMessageTime } from '@/utils/formatTime';

interface NotesPanelProps {
  contactId: string;
  onClose: () => void;
}

const fetchNotes = async (contactId: string): Promise<Note[]> => {
  const res = await fetch(`/api/notes?contactId=${contactId}`);
  return res.json();
};

export function NotesPanel({ contactId, onClose }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotes(contactId).then(setNotes);
  }, [contactId]);

  async function handleAdd() {
    if (!input.trim()) return;
    setSaving(true);

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, content: input.trim() }),
    });

    const newNote: Note = await res.json();
    setNotes((prev) => [...prev, newNote]);
    setInput('');
    setSaving(false);
  }

  return (
    <div className="w-72 h-full border-l border-gray-200 bg-white flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-sm">Notas Internas</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notes.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-4">Nenhuma nota ainda.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
              <span className="text-xs text-gray-400 mt-1 block">
                {formatMessageTime(note.timestamp)}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <textarea
          rows={3}
          placeholder="Adicionar nota privada..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim() || saving}
          className="mt-2 w-full bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Salvar nota
        </button>
      </div>
    </div>
  );
}
