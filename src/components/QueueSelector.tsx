'use client';

import { useEffect, useRef, useState } from 'react';
import { Queue } from '@/types';

const fetchQueues = async (): Promise<Queue[]> => {
  const res = await fetch('/api/queues');
  return res.json();
};

export function QueueSelector() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [selected, setSelected] = useState<Queue | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchQueues().then((data) => setQueues(data.filter((q) => q.isActive)));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        title="Transferir fila"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
          ${selected ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        {selected ? selected.name : 'Fila'}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 min-w-40 py-1">
          <p className="text-xs text-gray-400 px-3 py-1.5 font-medium uppercase tracking-wide">Transferir para</p>
          {queues.map((queue) => (
            <button
              key={queue.id}
              onClick={() => { setSelected(queue); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: queue.color }} />
              {queue.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
