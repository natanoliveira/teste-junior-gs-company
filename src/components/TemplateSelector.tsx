'use client';

import { useEffect, useState } from 'react';
import { MessageTemplate } from '@/types';

interface TemplateSelectorProps {
  onSelect: (content: string) => void;
  onClose: () => void;
}

const fetchTemplates = async (): Promise<MessageTemplate[]> => {
  const res = await fetch('/api/templates');
  return res.json();
};

export function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);

  useEffect(() => {
    fetchTemplates().then(setTemplates);
  }, []);

  return (
    <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Respostas Rápidas
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <ul className="space-y-1">
        {templates.map((template) => (
          <li key={template.id}>
            <button
              onClick={() => { onSelect(template.content); onClose(); }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <span className="text-sm font-medium text-blue-600">{template.name}</span>
              <p className="text-xs text-gray-500 truncate">{template.content}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
