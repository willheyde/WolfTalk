import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDirectMessage } from '../context/DirectMessageContext';
import { useUser } from '../context/UserContext';
import { directMessageService } from '../services/DirectMessageService';

const Avatar = ({ src, alt = 'avatar', className = '' }) => (
  <img src={src} alt={alt} className={`rounded-full ${className}`} />
);

const Button = ({ children, className = '', ...props }) => (
  <button {...props} className={`px-4 py-2 rounded ${className}`}>
    {children}
  </button>
);

const DirectMessageDetails = () => {
  const { groupId } = useParams();
  const { groupChatData, fetchConversationByGroupId, loading } = useDirectMessage();
  const { currentUser } = useUser();
  const [messageInput, setMessageInput] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  const bottomRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    fetchConversationByGroupId(groupId);
  }, [groupId, fetchConversationByGroupId]);

  useEffect(() => {
    scrollToBottom();
  }, [groupChatData]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const participants = useMemo(
    () => groupChatData[0]?.group?.participants || [],
    [groupChatData]
  );

  const generateFallbackTitle = (list) => {
    const names = list.map((p) => p.displayName);
    const preview = names.slice(0, 2).join(' and ');
    const remaining = names.length - 2;
    return remaining > 0 ? `${preview} + ${remaining} more` : preview;
  };

  const groupTitle = useMemo(() => {
    const title = groupChatData[0]?.group?.groupTitle;
    return title && title.trim() !== ''
      ? title
      : generateFallbackTitle(participants);
  }, [groupChatData, participants]);

  const groupPictureUrl = useMemo(
    () => groupChatData[0]?.group?.groupPictureUrl || '',
    [groupChatData]
  );

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    try {
      await directMessageService.sendMessage(currentUser.id, groupId, messageInput);
      await fetchConversationByGroupId(groupId);
      setMessageInput('');
      textAreaRef.current.style.height = 'auto';
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full relative">
      <div
        className="flex items-center p-4 bg-gray-100 cursor-pointer border-b"
        onClick={() => setShowParticipants(!showParticipants)}
      >
        <Avatar src={groupPictureUrl} className="w-12 h-12 mr-4" />
        <div>
          <h2 className="text-xl font-semibold">{groupTitle}</h2>
          <p className="text-sm text-gray-500">Click to view participants</p>
        </div>
      </div>

      {showParticipants && (
        <div className="bg-gray-50 border-b p-4">
          <h3 className="font-semibold mb-2">Participants:</h3>
          <ul className="space-y-1">
            {participants.map((p) => (
              <li key={p.id} className="text-sm text-gray-700">
                {p.displayName} ({p.email})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-32">
        {groupChatData.map((msg) => {
          if (!currentUser) return null;
          const isCurrentUser = msg.sender.unityId === currentUser.unityId;
          return (
            <div key={msg.id} className="flex items-start space-x-3">
              <Avatar src={msg.sender.profilePicture || ''} className="w-8 h-8" />
              <div
                className={`max-w-[70%] p-3 rounded shadow ${
                  isCurrentUser ? 'bg-indigo-100' : 'bg-slate-200'
                }`}
              >
                <div className="text-sm font-medium text-gray-800">
                  {msg.sender.displayName}
                </div>
                <div className="text-sm text-gray-600 whitespace-pre-wrap">{msg.content}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t shadow-inner">
        <div className="flex gap-2">
          <textarea
            ref={textAreaRef}
            placeholder="Type a message..."
            value={messageInput}
            onChange={handleInputChange}
            rows={1}
            className="flex-1 resize-none overflow-hidden border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-blue-500 text-white"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DirectMessageDetails;
