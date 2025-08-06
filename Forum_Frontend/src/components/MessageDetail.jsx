import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function MessageDetail() {
  const { deptId, msgId } = useParams();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`/api/posts${msgId}`)
      .then(res => res.json())
      .then(setMessage)
      .catch(console.error);
  }, [msgId]);

  if (!message) {
    return <div>Loading…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Message Details</h1>
      <div className="text-sm text-gray-600 mb-2">
        Posted {new Date(message.timestamp).toLocaleString()}
      </div>
      <p className="mb-6">{message.content}</p>

      {/* Here you could list replies, add a reply form, etc. */}
      {/* e.g. <ReplyList messageId={msgId} /> and <ReplyForm messageId={msgId} /> */}
    </div>
  );
}
