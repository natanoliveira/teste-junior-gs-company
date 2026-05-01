import { Message } from '@/types';
import { formatMessageTime } from '@/utils/formatTime';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutbound = message.direction === 'outbound';

  return (
    <div className={`flex mb-2 ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm
          ${isOutbound
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-white text-gray-800 rounded-bl-sm'
          }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <span
          className={`text-xs mt-1 block text-right
            ${isOutbound ? 'text-blue-200' : 'text-gray-400'}`}
        >
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
