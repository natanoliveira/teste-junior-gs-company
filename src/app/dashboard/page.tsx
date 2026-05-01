'use client';

import { useEffect, useState } from 'react';
import { DashboardStats } from '@/types';

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">{value.toLocaleString('pt-BR')}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function formatResponseTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

const fetchStats = async (): Promise<DashboardStats> => {
  const res = await fetch('/api/analytics');
  return res.json();
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const totalMessages = stats.messagesSentToday + stats.messagesReceivedToday;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Chats ativos" value={stats.activeChats} />
          <StatCard label="Aguardando" value={stats.waitingChats} />
          <StatCard
            label="Tempo médio de resposta"
            value={formatResponseTime(stats.averageResponseTime)}
          />
          <StatCard
            label="Mensagens hoje"
            value={(totalMessages).toLocaleString('pt-BR')}
            sub={`${stats.messagesSentToday} enviadas · ${stats.messagesReceivedToday} recebidas`}
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
            Volume de mensagens hoje
          </h2>
          <div className="space-y-5">
            <ProgressBar
              label="Enviadas"
              value={stats.messagesSentToday}
              max={totalMessages}
              color="bg-blue-500"
            />
            <ProgressBar
              label="Recebidas"
              value={stats.messagesReceivedToday}
              max={totalMessages}
              color="bg-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
