// components/MessageList.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';         // ← add this

export default function MessageList({ messages }) {
  const { deptId } = useParams();

  if (!messages.length) {
    return <p className="text-gray-500">No messages to display.</p>;
  }

  return (
    <ul className="space-y-4">
      {messages.map(msg => (
        <li key={msg.id}>
          <Link
            to={`/departments/${deptId}/${msg.id}`}
            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="text-sm text-gray-600">
              {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
            </div>
            {/* render the message body instead of `msg.content` */}
            <p className="mt-1 text-gray-800 line-clamp-2">
              {msg.body}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
