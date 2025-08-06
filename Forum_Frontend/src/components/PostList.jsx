// PostList.jsx (with inline Edit modal)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useDepartment } from '../context/DepartmentContext';
import { useUser } from '../context/UserContext';
import { postService } from '../services/postService';

export default function PostList({ 
  posts,
  showDepartment = true,
  showProfessor = true,
  highlightTag = null,
  compact = false,
  onFilter = null
}) {
  const navigate = useNavigate();
  const { getDepartmentById, currentDepartment} = useDepartment();
  const { currentUser } = useUser();

  const [localPosts, setLocalPosts] = useState(posts || []);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [editPostData, setEditPostData] = useState(null);

  useEffect(() => {
    setLocalPosts(posts || []);
  }, [posts]);

  const handlePostClick = (postId) => navigate(`/posts/${postId}`);

  const handleVote = async (e, postId, voteType, alreadyVoted) => {
  e.stopPropagation();
  const unityId = currentUser?.unityId;
  if (!unityId) return;

  try {
    let updated = true;

    if (voteType === 'like') {
      updated = alreadyVoted
        ? await postService.removeLiked(postId, unityId)
        : await postService.addLiked(postId, unityId);
    } else if (voteType === 'dislike') {
      updated = alreadyVoted
        ? await postService.removeDisliked(postId, unityId)
        : await postService.addDisliked(postId, unityId);
    }

    setLocalPosts(posts =>
      posts.map(p =>
        p.id === postId
          ? {
              ...p,
              likedBy: updated.likedBy || [],
              dislikedBy: updated.dislikedBy || []
            }
          : p
      )
    );
  } catch (err) {
    console.error('Vote error', err);
  }
};

  const handleDelete = async (postId) => {
    try {
      await postService.deletePost(postId);
      setLocalPosts(posts => posts.filter(p => p.id !== postId));
      setShowDeleteModal(null);
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const handleEditSave = async (postId) => {
  try {
    const updates = {
      title: editPostData.title,
      body:  editPostData.body,
      clazz: editPostData.class ? editPostData.class.id : null,
      prof:  editPostData.professor ? editPostData.professor.id : null
    };

    const updatedPost = await postService.updatePost(postId, updates);

    // Ensure class and professor are merged in if missing from the response
    setLocalPosts(posts =>
  posts.map(p => {
    if (p.id !== updatedPost.id) return p;

    // If class is missing from API, use the selected one from modal
    return {
      ...p,
      ...updatedPost,
      class: updatedPost.class ?? editPostData.class ?? p.class,
      professor: updatedPost.professor ?? editPostData.professor ?? p.professor,
    };
  })
);

    setEditPostData(null);
  } catch (err) {
    console.error('Edit error', err);
  }
};
  const formatTags = (tags, highlight) => tags.map(tag => (
    <Link
      key={tag}
      to={`/tags/${encodeURIComponent(tag)}`}
      onClick={e => e.stopPropagation()}
      className={`inline-block px-2 py-1 text-xs rounded-full transition-colors ${
        highlight === tag
          ? 'bg-red-100 text-red-700 font-semibold'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      #{tag}
    </Link>
  ));

  if (!localPosts.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No posts to display</p>
      </div>
    );
  }

  const seen = new Set();
  const filtered = localPosts.filter(p => !seen.has(p.id) && seen.add(p.id));

  return (
    <div className="space-y-4 relative">
      {filtered.map(post => {
        if (post.parentId != null) return null;
        const department = getDepartmentById(post.departmentId);
        const professor = post.professor;
        const course = post.class;
        const isAuthor = currentUser?.unityId === post.sender.unityId;

        const likedBy = post.likedBy || [];
        const dislikedBy = post.dislikedBy || [];
        const hasLiked = likedBy.includes(currentUser?.unityId);
        const hasDisliked = dislikedBy.includes(currentUser?.unityId);
        const netLikes = likedBy.length - dislikedBy.length;

        return (
          <article
            key={post.id}
            onClick={() => handlePostClick(post.id)}
            className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${compact ? 'p-4' : 'p-6'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className={`font-semibold text-gray-900 hover:text-red-600 ${compact ? 'text-lg' : 'text-xl'}`}>{post.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                  {showDepartment && department && (
                    <>
                      <Link to={`/departments/${department.id}`} onClick={e => e.stopPropagation()} className="hover:text-red-600">{department.name}</Link>
                      <span>•</span>
                    </>
                  )}
                  {course && (
                    <>
                      <button onClick={e => { e.stopPropagation(); onFilter?.({ course: course.courseTitle }); }} className="text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded hover:bg-cyan-100">
                        {course.courseTitle || course.courseTitle || 'Unknown Course'}
                      </button>
                      <span>•</span>
                    </>
                  )}
                  {showProfessor && professor?.name && (
                    <>
                      <button onClick={e => { e.stopPropagation(); onFilter?.({ professor: professor.id.toString() }); }} className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded hover:bg-indigo-100">
                        {professor.name}
                      </button>
                      <span>•</span>
                    </>
                  )}
                  <Link to={`/profile/${post.sender.unityId}`} onClick={e => e.stopPropagation()} className="hover:text-red-600">{post.sender.displayName || 'Anonymous'}</Link>
                  <span>•</span>
                  <time className="text-gray-500">{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</time>
                </div>
              </div>
              {isAuthor && (
                <div className="flex gap-2 ml-4">
                  <button onClick={e => { e.stopPropagation(); setEditPostData(post); }} className="text-gray-400 hover:text-gray-600" title="Edit post">✎</button>
                  <button onClick={e => { e.stopPropagation(); setShowDeleteModal(post.id); }} className="text-gray-400 hover:text-red-600" title="Delete post">🗑</button>
                </div>
              )}
            </div>

            {!compact && post.content && <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>}
            {post.tags?.length > 0 && <div className="flex flex-wrap gap-2 mb-3">{formatTags(post.tags, highlightTag)}</div>}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button
                    disabled={!currentUser?.unityId}
                    onClick={e => handleVote(e, post.id, 'like', hasLiked)}
                    className={`p-1 rounded ${hasLiked ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-green-500 hover:bg-green-50'}`}
                    title="Like"
                    >
                      ⮝
                  </button>
                  <span className="font-medium text-gray-700 min-w-[2rem] text-center">{netLikes}</span>
                  <button
                    disabled={!currentUser?.unityId}
                    onClick={e => handleVote(e, post.id, 'dislike', hasDisliked)}
                    className={`p-1 rounded ${hasDisliked ? 'text-pink-500 bg-pink-50' : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'}`}
                    title="Dislike"
                  >
                    ⮟
                  </button>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  💬 <span className="text-sm">{post.comments?.length || 0} comments</span>
                </div>
                {post.viewCount !== undefined && (
                  <div className="flex items-center gap-1 text-gray-600">
                    👁 <span className="text-sm">{post.viewCount} views</span>
                  </div>
                )}
              </div>
              {post.isAnswered && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Answered</span>
              )}
            </div>

            {showDeleteModal === post.id && (
              <div
                onClick={() => setShowDeleteModal(null)}
                className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white border border-gray-300 p-6 rounded-lg shadow-xl w-[90%] max-w-sm"
                >
                  <p className="text-lg text-gray-800 mb-4">Are you sure you want to delete this post?</p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(null)}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}

      {editPostData && (() => {
        const availableCourses = currentDepartment?.classes || [];
        const availableProfessors = currentDepartment?.professors || [];

        return (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/30">
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-gray-300 p-6 rounded-lg shadow-xl w-[90%] max-w-xl"
            >
              <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
              <input
                value={editPostData.title}
                onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })}
                placeholder="Title"
                className="w-full mb-3 border rounded p-2"
              />
              <textarea
                value={editPostData.body}
                onChange={(e) => setEditPostData({ ...editPostData, body: e.target.value })}
                placeholder="Body"
                className="w-full mb-3 border rounded p-2"
                rows={5}
              />
              <select
                value={editPostData.class?.courseTitle || ''}
                onChange={(e) => {
                  const selected = availableCourses.find(c => c.courseTitle === e.target.value);
                  setEditPostData({ ...editPostData, class: selected || null });
                }}
                className="w-full mb-3 border rounded p-2"
              >
                <option value="">Select Class</option>
                {availableCourses.map(course => (
                  <option key={course.courseTitle} value={course.courseTitle}>
                    {course.courseTitle || course.id}
                  </option>
                ))}
              </select>
              <select
                value={editPostData.professor?.id || ''}
                onChange={(e) => {
                  const selected = availableProfessors.find(p => p.id === parseInt(e.target.value));
                  setEditPostData({ ...editPostData, professor: selected || null });
                }}
                className="w-full mb-3 border rounded p-2"
              >
                <option value="">Select Professor</option>
                {availableProfessors.map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.name}</option>
                ))}
              </select>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => handleEditSave(editPostData.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Post Edits
                </button>
                <button
                  onClick={() => setEditPostData(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
