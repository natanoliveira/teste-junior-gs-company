'use client';

import { useEffect, useState } from 'react';
import { Campaign } from '@/types';

const statusConfig: Record<Campaign['status'], { label: string; class: string }> = {
  draft:     { label: 'Rascunho',  class: 'bg-gray-100 text-gray-600' },
  scheduled: { label: 'Agendada',  class: 'bg-blue-100 text-blue-600' },
  running:   { label: 'Em andamento', class: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Concluída', class: 'bg-green-100 text-green-600' },
  failed:    { label: 'Falhou',    class: 'bg-red-100 text-red-600' },
};

const fetchCampaigns = async (): Promise<Campaign[]> => {
  const res = await fetch('/api/campaigns');
  return res.json();
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns().then((data) => {
      setCampaigns(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Campanhas</h1>

        {loading ? (
          <div className="flex justify-center mt-16">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const status = statusConfig[campaign.status];
              const deliveryRate = campaign.stats.total > 0
                ? Math.round((campaign.stats.delivered / campaign.stats.total) * 100)
                : 0;

              return (
                <div key={campaign.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-semibold text-gray-800">{campaign.name}</h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Criada em {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                        {campaign.scheduledAt && ` · Agendada para ${new Date(campaign.scheduledAt).toLocaleDateString('pt-BR')}`}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.class}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-3 text-center mb-4">
                    {[
                      { label: 'Total',     value: campaign.stats.total },
                      { label: 'Enviadas',  value: campaign.stats.sent },
                      { label: 'Entregues', value: campaign.stats.delivered },
                      { label: 'Lidas',     value: campaign.stats.read },
                      { label: 'Falhas',    value: campaign.stats.failed },
                    ].map((s) => (
                      <div key={s.label} className="bg-gray-50 rounded-xl py-2">
                        <p className="text-lg font-bold text-gray-800">{s.value.toLocaleString('pt-BR')}</p>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {campaign.stats.total > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Taxa de entrega</span>
                        <span>{deliveryRate}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${deliveryRate}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
