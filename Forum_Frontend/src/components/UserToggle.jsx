
import React from 'react';

export default function UserToggle({ userRole, currentView, onSwitchView }) {
  const isFaculty = userRole === 'faculty';

  return (
    <div className="flex gap-4 items-center">
      {/* Student-only view toggle (hidden from faculty) */}
      {!isFaculty && (
        <button
          className={`px-4 py-2 rounded shadow ${
            currentView === 'student'
              ? 'bg-red-700 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => onSwitchView?.('student')}
        >
          Student View
        </button>
      )}

      {/* Shared view (student/faculty) */}
      <button
        className={`px-4 py-2 rounded shadow ${
          currentView === 'shared'
            ? 'bg-red-700 text-white'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => onSwitchView?.('shared')}
      >
        {isFaculty ? 'Faculty View' : 'Student–Faculty View'}
      </button>
    </div>
  );
}
