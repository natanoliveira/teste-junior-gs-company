'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { User } from '@/types';

const roleLabel: Record<User['role'], string> = {
  admin: 'Admin',
  supervisor: 'Supervisor',
  agent: 'Agente',
};

const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('/api/users');
  return res.json();
};

export function TeamPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const online = users.filter((u) => u.isOnline).length;

  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Equipe</span>
        <span className="text-xs bg-green-100 text-green-600 font-medium px-2 py-0.5 rounded-full">
          {online} online
        </span>
      </button>

      {open && (
        <ul className="px-3 pb-3 space-y-1">
          {users.map((user) => (
            <li key={user.id} className="flex items-center gap-2 py-1">
              <div className="relative shrink-0">
                <Image
                  src={user.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  width={28}
                  height={28}
                  unoptimized
                  className="rounded-full object-cover"
                />
                <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white
                  ${user.isOnline ? 'bg-green-400' : 'bg-gray-300'}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{user.name}</p>
                <p className="text-xs text-gray-400">{roleLabel[user.role]}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
