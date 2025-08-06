import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMessage } from "../context/MessageContext";
import { useUser } from "../context/UserContext";
import { postService } from '../services/postService';
import { Card, CardContent, CardHeader, Button } from "../components/MessageComponents";

export default function MessageDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { selectedMessage, fetchMessageById, loading, error } = useMessage();

  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    const id = parseInt(postId, 10);
    if (!Number.isNaN(id)) fetchMessageById(id);
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  if (error || !selectedMessage) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error || "Message not found"}
        </h2>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const { title, body, clazz, professor, id, timestamp, upvotes = 0, downvotes = 0, comments = [] } = selectedMessage;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main post card */}
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-sm text-gray-500">
            {new Date(timestamp).toLocaleString()} • {clazz?.courseTitle || "General"}
            {professor && ` • ${professor.name}`}
          </p>
        </CardHeader>
        <CardContent>
          <p className="prose max-w-none" dangerouslySetInnerHTML={{ __html: body }} />
          <div className="mt-4 flex gap-4 text-sm text-gray-600">
            <span>{upvotes} Upvotes</span>
            <span>•</span>
            <span>{downvotes} Downvotes</span>
            <span>•</span>
            <span>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</span>
          </div>
        </CardContent>
      </Card>

      {/* Comments section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Comments</h2>
            <Button onClick={() => setShowCommentForm(true)}>
              Add Comment
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Form - appears at top when shown */}
          {showCommentForm && (
            <CommentForm
              parentMessage={selectedMessage}
              onCancel={() => setShowCommentForm(false)}
              onCommentAdded={() => {
                fetchMessageById(selectedMessage.id);
                setShowCommentForm(false);
              }}
            />
          )}

          {/* Existing Comments */}
          {comments.length === 0 && !showCommentForm ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No comments yet, start a conversation!</p>
              <Button onClick={() => setShowCommentForm(true)} variant="primary">
                Be the first to comment
              </Button>
            </div>
          ) : (
            comments.map(c => (
              <div key={c.id} className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                <p className="text-sm text-gray-500 mb-1">
                  {(c.author?.name) || "Anonymous"} • {new Date(c.timestamp).toLocaleString()}
                </p>
                <p className="text-gray-800 whitespace-pre-line">{c.body}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CommentForm({ parentMessage, onCancel, onCommentAdded }) {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!currentUser) return navigate("/login");
    if (text.trim().length < 10) {
      setError('Comment must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    try {
      await postService.createPost({
        title: `Re: ${parentMessage.title}`,
        content: text,
        senderId: currentUser.unityId,
        departmentId: null,
        classId: parentMessage.clazz?.id || null,
        professorId: parentMessage.professor?.id || null,
        parentId: parentMessage.id,
      });
      onCommentAdded();
    } catch (err) {
      console.error(err);
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Add Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500"
          placeholder="Share your thoughts..."
          rows={5}
          disabled={submitting}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={submitting || !text.trim()}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
