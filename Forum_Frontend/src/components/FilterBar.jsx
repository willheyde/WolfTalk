// components/FilterBar.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function FilterBar({
  courses = [],
  professors = [],
  selectedCourse = null,
  selectedProfessor = null,
  onCourseSelect,
  onProfessorSelect,
  onClearFilters,
  showCourseFilter = true,
  showProfessorFilter = true,
  className = ''
}) {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isProfessorsOpen, setIsProfessorsOpen] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const [professorSearch, setProfessorSearch] = useState('');

  const coursesRef = useRef(null);
  const professorsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (coursesRef.current && !coursesRef.current.contains(event.target)) {
        setIsCoursesOpen(false);
      }
      if (professorsRef.current && !professorsRef.current.contains(event.target)) {
        setIsProfessorsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.name.toLowerCase().includes(courseSearch.toLowerCase())
    );
  }, [courses, courseSearch]);

  const filteredProfessors = useMemo(() => {
    return professors.filter(professor =>
      professor.name.toLowerCase().includes(professorSearch.toLowerCase())
    );
  }, [professors, professorSearch]);

  const anyFilterSelected = selectedCourse || selectedProfessor;

  return (
    <div className={`filter-bar ${className} p-4 bg-white shadow-md rounded-2xl space-y-4`}>
      {(showCourseFilter || showProfessorFilter) && (
        <div className="filter-controls flex flex-wrap items-center gap-4">
          {showCourseFilter && (
            <div className="filter-section relative" ref={coursesRef}>
              <button
                onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                className={`px-4 py-2 rounded-xl shadow border border-gray-300 ${selectedCourse ? 'bg-red-100 text-red-800' : 'bg-white hover:bg-red-50 text-gray-800'}`}
              >
                {selectedCourse || 'Select Course'}
              </button>
              {isCoursesOpen && (
                <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-2">
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full p-2 mb-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                  <ul className="max-h-48 overflow-y-auto">
                    {filteredCourses.map(course => (
                      <li
                        key={course.code}
                        onClick={() => {
                          onCourseSelect(course.code);
                          setIsCoursesOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-red-100 cursor-pointer rounded-xl"
                      >
                        {course.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {showProfessorFilter && (
            <div className="filter-section relative" ref={professorsRef}>
              <button
                onClick={() => setIsProfessorsOpen(!isProfessorsOpen)}
                className={`px-4 py-2 rounded-xl shadow border border-gray-300 ${selectedProfessor ? 'bg-red-100 text-red-800' : 'bg-white hover:bg-red-50 text-gray-800'}`}
              >
                {professors.find(p => p.id.toString() === selectedProfessor)?.name || 'Select Professor'}
              </button>
              {isProfessorsOpen && (
                <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-2">
                  <input
                    type="text"
                    value={professorSearch}
                    onChange={(e) => setProfessorSearch(e.target.value)}
                    placeholder="Search professors..."
                    className="w-full p-2 mb-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                  <ul className="max-h-48 overflow-y-auto">
                    {filteredProfessors.map(prof => (
                      <li
                        key={prof.id}
                        onClick={() => {
                          onProfessorSelect(prof.id.toString());
                          setIsProfessorsOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-red-100 cursor-pointer rounded-xl"
                      >
                        {prof.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {anyFilterSelected && (
            <button
              className="px-4 py-2 bg-red-100 text-red-800 rounded-xl shadow border border-gray-300 hover:bg-red-200"
              onClick={onClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
