export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `há ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffHours < 48) return 'ontem';

  return date.toLocaleDateString('pt-BR');
}

export function formatMessageTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
