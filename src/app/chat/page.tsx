'use client';

import { useState } from 'react';
import { Contact } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { ChatWindow } from '@/components/ChatWindow';

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        selectedContactId={selectedContact?.id}
        onSelectContact={setSelectedContact}
      />
      <ChatWindow contact={selectedContact} />
    </div>
  );
}
