// components/CreatePostButton.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepartment } from '../context/DepartmentContext';
import { postService } from '../services/postService';
import { useUser } from '../context/UserContext';

export default function CreatePostButton({
  departmentId = null,
  prefilledClass = null,
  prefilledProfessor = null,
  variant = 'default',
  text = 'Create Post',
  className = ''
}) {
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleClick = () => setShowModal(true);

  const styles = {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-white text-red-600 border border-red-600 hover:bg-red-50',
    default: 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800'
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded-2xl font-semibold transition-all shadow-md flex items-center gap-2 ${styles[variant] || styles.default} ${className}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {text}
      </button>

      {showModal && (
        <CreatePostModal
          departmentId={departmentId}
          prefilledClass={prefilledClass}
          prefilledProfessor={prefilledProfessor}
          onClose={() => setShowModal(false)}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
        />
      )}
    </>
  );
}

function CreatePostModal({
  departmentId,
  prefilledClass,
  prefilledProfessor,
  onClose,
  isCreating,
  setIsCreating
}) {
  const navigate = useNavigate();
  const { departments, classes, professors, fetchDepartmentPosts} = useDepartment();
  const {currentUser} = useUser();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    departmentId: departmentId || '',
    classId: prefilledClass?.id || '',
    professorId: prefilledProfessor || '',
    parentId: null,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim() || formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!formData.content.trim() || formData.content.length < 10) newErrors.content = 'Content must be at least 10 characters';
    if (!formData.departmentId) newErrors.departmentId = 'Select a department';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsCreating(true);
    try {
      console.log('submitting:', {... formData, senderId: currentUser.unityId });
      const newPost = await postService.createPost({... formData, senderId: currentUser.unityId});
      await fetchDepartmentPosts(formData.departmentId);
      navigate(`/departments/${formData.departmentId}`);
      onClose();
    } catch (err) {
      setErrors({ submit: 'Failed to create post. Try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-xl border border-gray-200 space-y-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-800">Create Post</h2>
          <button onClick={onClose} type="button" className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        <input
          type="text"
          placeholder="Title *"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className={`w-full border rounded-lg px-3 py-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

        <select
          value={formData.departmentId}
          onChange={e => setFormData({ ...formData, departmentId: e.target.value, classId: '', professorId: '' })}
          className={`w-full border rounded-lg px-3 py-2 ${errors.departmentId ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select Department *</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        {errors.departmentId && <p className="text-sm text-red-500">{errors.departmentId}</p>}

        <select
          value={formData.classId}
          onChange={e => setFormData({ ...formData, classId: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.courseTitle}</option>
          ))}
        </select>

        <select
          value={formData.professorId}
          onChange={e => setFormData({ ...formData, professorId: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select Professor</option>
          {professors.map(prof => (
            <option key={prof.id} value={prof.id}>{prof.name}</option>
          ))}
        </select>

        <textarea
          value={formData.content}
          onChange={e => setFormData({ ...formData, content: e.target.value })}
          placeholder="Details *"
          rows={4}
          className={`w-full border rounded-lg px-3 py-2 resize-none ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.anonymous}
            onChange={e => setFormData({ ...formData, anonymous: e.target.checked })}
            className="h-4 w-4 mr-2"
          />
          <label className="text-sm">Post anonymously</label>
        </div>

        {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button type="submit" disabled={isCreating} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            {isCreating ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
