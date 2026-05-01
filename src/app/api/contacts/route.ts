import { Contact } from '@/types';
import { NextResponse } from 'next/server';

// Mock Data
// Gerei uns contatos para ajudar na simulação.
const contacts: Contact[] = [
  {
    id: '1',
    name: 'Josué',
    phoneNumber: '+972100000001',
    profilePicture: 'https://ui-avatars.com/api/?name=Josue&background=4ade80&color=fff',
    status: 'active',
    lastMessage: {
      content: 'Seja forte e corajoso!',
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
    tags: ['Bíblia', 'Guerreiro'],
  },
  {
    id: '2',
    name: 'Eliseu',
    phoneNumber: '+972100000002',
    profilePicture: 'https://ui-avatars.com/api/?name=Eliseu&background=60a5fa&color=fff',
    status: 'active',
    lastMessage: {
      content: 'A carroça de fogo passou aqui?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    tags: ['Bíblia', 'Profeta'],
  },
  {
    id: '3',
    name: 'Jesus',
    phoneNumber: '+972100000003',
    profilePicture: 'https://ui-avatars.com/api/?name=Jesus&background=fbbf24&color=fff',
    status: 'active',
    lastMessage: {
      content: 'Eu sou o caminho, a verdade e a vida.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    tags: ['Bíblia', 'Messias'],
  },
  {
    id: '4',
    name: 'Luke Skywalker',
    phoneNumber: '+15550000001',
    profilePicture: 'https://ui-avatars.com/api/?name=Luke+Skywalker&background=38bdf8&color=fff',
    status: 'active',
    lastMessage: {
      content: 'Eu nunca acreditei nisso.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    tags: ['Star Wars', 'Jedi'],
  },
  {
    id: '5',
    name: 'Obi-Wan Kenobi',
    phoneNumber: '+15550000002',
    profilePicture: 'https://ui-avatars.com/api/?name=Obi-Wan&background=818cf8&color=fff',
    status: 'active',
    lastMessage: {
      content: 'Que a Força esteja com você.',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    tags: ['Star Wars', 'Jedi'],
  },
  {
    id: '6',
    name: 'Darth Vader',
    phoneNumber: '+15550000003',
    profilePicture: 'https://ui-avatars.com/api/?name=Darth+Vader&background=1e293b&color=fff',
    status: 'inactive',
    lastMessage: {
      content: 'Eu sou seu pai.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    tags: ['Star Wars', 'Sith'],
  },
  {
    id: '7',
    name: 'Jack Burton',
    phoneNumber: '+15550000004',
    profilePicture: 'https://ui-avatars.com/api/?name=Jack+Burton&background=f97316&color=fff',
    status: 'active',
    lastMessage: {
      content: "It's all in the reflexes.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    tags: ['Aventureiro', 'Big Trouble'],
  },
  {
    id: '8',
    name: 'Lo Pan',
    phoneNumber: '+15550000005',
    profilePicture: 'https://ui-avatars.com/api/?name=Lo+Pan&background=dc2626&color=fff',
    status: 'inactive',
    lastMessage: {
      content: 'Os olhos verdes me pertencem.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    tags: ['Vilão', 'Big Trouble'],
  },
];

export async function GET() {
  // Simulating network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json(contacts);
}
