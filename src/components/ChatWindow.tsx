'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { Contact, Message } from '@/types';
import { MessageBubble } from './MessageBubble';
import { TemplateSelector } from './TemplateSelector';
import { NotesPanel } from './NotesPanel';
import { QueueSelector } from './QueueSelector';
import { Toast } from './Toast';

// Aqui coloquei umas respostas automáticas para testes.
const autoReplies: Record<string, string[]> = {
  '1': [ // Josué
    'Seja forte e corajoso! O Senhor teu Deus é contigo.',
    'Não temas nem te espantes, porque o Senhor teu Deus é contigo.',
    'Escolhei hoje a quem queirais servir.',
  ],
  '2': [ // Eliseu
    'Peço apenas uma porção dupla do teu espírito.',
    'A carroça de fogo passou, mas a missão continua.',
    'O que o Senhor fez ontem, fará de novo amanhã.',
  ],
  '3': [ // Jesus
    'Amarás o próximo como a ti mesmo.',
    'Eu sou o caminho, a verdade e a vida.',
    'Pedi e será dado a vós; buscai e achareis.',
  ],
  '4': [ // Luke Skywalker
    'Eu nunca acreditei nisso.',
    'Que a Força esteja com você.',
    'Um Jedi usa a Força para o conhecimento e a defesa, nunca para o ataque.',
  ],
  '5': [ // Obi-Wan Kenobi
    'Não se abale com o lado negro. Pense somente na luz — não deixe a dúvida te cegar assim como aconteceu com Anakin.',
    'Esses não são os droids que você está procurando.',
    'Use a Força, Natan. Confie nos seus instintos.',
  ],
  '6': [ // Darth Vader
    'Eu sou seu pai.',
    'Não me subestime.',
    'A Força é forte nessa conversa.',
  ],
  '7': [ // Jack Burton
    "Tudo depende dos reflexos.",
    "Quem é você? Jack Burton. E não estou brincando.",
    'Quando alguma coisa dá errado, eu corro em direção a ela.',
  ],
  '8': [ // Lo Pan
    'Os olhos verdes me pertencem.',
    'Tempo é uma ilusão que não me afeta.',
    'Tudo aquilo que existe, existe por minha vontade.',
  ],
};

function getAutoReply(contactId: string): string {
  const replies = autoReplies[contactId];
  if (!replies) return 'Ok.';
  return replies[Math.floor(Math.random() * replies.length)];
}

const fetchMessages = async (contactId: string): Promise<Message[]> => {
  const res = await fetch(`/api/messages?contactId=${contactId}`);
  return res.json();
};

interface ChatWindowProps {
  contact: Contact | null;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export function ChatWindow({ contact }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contact) return;
    startTransition(async () => {
      const data = await fetchMessages(contact.id);
      setMessages(data);
    });
  }, [contact?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || !contact) return;

    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      contactId: contact.id,
      content: input.trim(),
      direction: 'outbound',
      status: 'sent',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: contact.id, content: optimistic.content }),
      });

      const saved: Message = await res.json();
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)));
      setToast({ message: 'Mensagem enviada!', type: 'success' });

      setTimeout(() => {
        setIsTyping(false);
        const reply: Message = {
          id: `reply-${Date.now()}`,
          contactId: contact.id,
          content: getAutoReply(contact.id),
          direction: 'inbound',
          status: 'delivered',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, reply]);
      }, 2000);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setToast({ message: 'Erro ao enviar mensagem.', type: 'error' });
      setTimeout(() => setIsTyping(false), 1500);
    }
  }

  if (!contact) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#efeae2] items-center justify-center text-gray-500 space-y-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="font-medium text-lg">GS Company Chat</p>
        <p className="text-sm text-gray-400 max-w-xs text-center">
          Selecione uma conversa ao lado para visualizar o histórico e enviar mensagens.
        </p>
        <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
          Ambiente de Teste
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col bg-[#efeae2] relative">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* Header */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 shadow-sm z-10 justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
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
            <div>
              <h3 className="font-semibold text-gray-800">{contact.name}</h3>
              <p className="text-xs text-gray-500">
                {contact.status === 'active' ? 'Online' : 'Offline'} · {contact.phoneNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <QueueSelector />
            <button
              onClick={() => setShowNotes((prev) => !prev)}
              title="Notas internas"
              className={`p-2 rounded-lg transition-colors ${showNotes ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </header>

      {/* Mensagens */}
      <div className="flex-1 p-6 overflow-y-auto relative z-0">
        {isPending ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-8">
            Nenhuma mensagem ainda. Inicie a conversa!
          </p>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isTyping && (
              <div className="flex justify-start mb-2">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <footer className="bg-white p-4 z-10">
        <div className="max-w-4xl mx-auto relative">
          {showTemplates && (
            <TemplateSelector
              onSelect={(content) => setInput(content)}
              onClose={() => setShowTemplates(false)}
            />
          )}

          <div className="flex gap-4 items-end">
            <div className="flex-1 bg-white border border-gray-300 rounded-2xl flex items-center gap-2 px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-shadow shadow-sm">
              <button
                onClick={() => setShowTemplates((prev) => !prev)}
                title="Respostas rápidas"
                className={`transition-colors shrink-0 ${showTemplates ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>

              <input
                type="text"
                placeholder="Digite uma mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 py-2 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
      </div>

      {showNotes && (
        <NotesPanel contactId={contact.id} onClose={() => setShowNotes(false)} />
      )}
    </div>
  );
}
