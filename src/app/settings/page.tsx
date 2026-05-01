'use client';

import { useEffect, useState } from 'react';
import { Settings } from '@/types';

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const fetchSettings = async (): Promise<Settings> => {
  const res = await fetch('/api/settings');
  return res.json();
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleDay(day: number) {
    if (!settings) return;
    const days = settings.businessHours.days.includes(day)
      ? settings.businessHours.days.filter((d) => d !== day)
      : [...settings.businessHours.days, day].sort();
    setSettings({ ...settings, businessHours: { ...settings.businessHours, days } });
  }

  if (!settings) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>

        {/* Empresa */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Empresa</h2>
          <label className="block">
            <span className="text-sm text-gray-600 mb-1 block">Nome da empresa</span>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </label>
        </div>

        {/* Horário de funcionamento */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Horário de funcionamento</h2>

          <div className="flex gap-4 mb-4">
            <label className="flex-1">
              <span className="text-sm text-gray-600 mb-1 block">Abertura</span>
              <input
                type="time"
                value={settings.businessHours.start}
                onChange={(e) => setSettings({ ...settings, businessHours: { ...settings.businessHours, start: e.target.value } })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>
            <label className="flex-1">
              <span className="text-sm text-gray-600 mb-1 block">Fechamento</span>
              <input
                type="time"
                value={settings.businessHours.end}
                onChange={(e) => setSettings({ ...settings, businessHours: { ...settings.businessHours, end: e.target.value } })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>
          </div>

          <div className="flex gap-2">
            {dayNames.map((name, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${settings.businessHours.days.includes(i)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Resposta automática */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Resposta automática</h2>

          <label className="flex items-center justify-between mb-4 cursor-pointer">
            <span className="text-sm text-gray-700">Ativar resposta automática</span>
            <div
              onClick={() => setSettings({ ...settings, autoReply: { ...settings.autoReply, enabled: !settings.autoReply.enabled } })}
              className={`w-10 h-6 rounded-full transition-colors relative ${settings.autoReply.enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.autoReply.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
          </label>

          <label className="block">
            <span className="text-sm text-gray-600 mb-1 block">Mensagem</span>
            <textarea
              rows={3}
              value={settings.autoReply.message}
              onChange={(e) => setSettings({ ...settings, autoReply: { ...settings.autoReply, message: e.target.value } })}
              disabled={!settings.autoReply.enabled}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-colors
            ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} disabled:opacity-50`}
        >
          {saved ? 'Salvo!' : saving ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </div>
    </div>
  );
}
