'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Contact } from '@/types';
import { formatTime } from '@/utils/formatTime';

interface SidebarProps {
  selectedContactId?: string;
  onSelectContact: (contact: Contact) => void;
}

export function Sidebar({ selectedContactId, onSelectContact }: SidebarProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contacts')
      .then((res) => res.json())
      .then((data: Contact[]) => {
        setContacts(data);
        setLoading(false);
      });
  }, []);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-80 h-full border-r border-gray-200 bg-white flex flex-col shadow-sm z-10">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Conversas</h2>
          <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            {contacts.filter((c) => c.status === 'active').length} ativas
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar contato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Lista de contatos */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-32 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center p-8">Nenhum contato encontrado.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`w-full p-4 flex gap-3 items-center text-left transition-colors
                  ${selectedContactId === contact.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                {/* Avatar com indicador de status */}
                <div className="relative shrink-0">
                  <Image
                    src={contact.profilePicture}
                    alt={contact.name}
                    width={40}
                    height={40}
                    unoptimized
                    className="rounded-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                      ${contact.status === 'active' ? 'bg-green-400' : 'bg-gray-300'}`}
                  />
                </div>

                {/* Info do contato */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {contact.name}
                    </span>
                    {contact.lastMessage && (
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {formatTime(contact.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>

                  {contact.lastMessage && (
                    <p className="text-xs text-gray-500 truncate">{contact.lastMessage.content}</p>
                  )}

                  {contact.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {contact.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-center text-gray-400">
        GS Company CRM v1.0
      </div>
    </aside>
  );
}
