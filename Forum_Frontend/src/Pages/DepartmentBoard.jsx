import React, { useState, useEffect, useRef } from 'react';
import { useDepartment } from '../context/DepartmentContext';
import FilterBar from '../components/FilterBar';
import PostList from '../components/PostList';
import CreatePostButton from '../components/CreatePostButton';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function DepartmentBoard() {
  const { deptId } = useParams();
  const departmentId = parseInt(deptId, 10);
  const navigate = useNavigate();

  const {
    currentDepartment,
    classes,
    professors,
    departmentPosts,
    fetchDepartmentById,
    fetchDepartmentPosts,
    loading: deptLoading
  } = useDepartment();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCourse = searchParams.get('course');
  const selectedProfessor = searchParams.get('professor');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);

  const rawCourses = currentDepartment?.classes || [];
  const courses = rawCourses.map(c => ({
    code: c.courseTitle,
    name: c.courseTitle
  }));


  async function loadDepartmentData(departmentId) {
    setLoading(true);
    try {
      await fetchDepartmentById(departmentId);
      await fetchDepartmentPosts(deptId);
    } catch (err) {
      console.error('Error loading department data:', err);
    } finally {
      setLoading(false);
    }
  }

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      loadDepartmentData(departmentId);
      hasFetched.current = true;
    }
  }, [departmentId]);

  useEffect(() => {
    let filtered = [...(departmentPosts || [])];

    if (selectedCourse) {
    filtered = filtered.filter(post => {
      const code = post.clazz?.courseTitle;            // ← look here
      const match = code === selectedCourse;
      if (!match) console.log(`✖ ${post.id}: "${code}" !== "${selectedCourse}"`);
      return match;
    });
  }
   if (selectedProfessor) {
  filtered = filtered.filter(post =>
    String(post.professor?.id) === selectedProfessor
  );
}

    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.upvotes + b.comments.length) - (a.upvotes + a.comments.length));
        break;
      case 'unanswered':
        filtered = filtered.filter(post => post.comments.length === 0);
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }


    setFilteredPosts(filtered);
  }, [departmentPosts, selectedCourse, selectedProfessor, sortBy]);

  const handleCourseChange = (courseCode) => {
    const params = {};
    if (courseCode) params.course = courseCode;
    if (selectedProfessor) params.professor = selectedProfessor;
    setSearchParams(params, { replace: true });
  };

  const handleProfessorChange = (profId) => {
    const params = {};
    if (selectedCourse) params.course = selectedCourse;
    if (profId) params.professor = profId;
    setSearchParams(params, { replace: true });
  };

  const handleClearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  if (loading || deptLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!currentDepartment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Department not found</h2>
        <button 
          onClick={() => navigate('/posts')}
          className="text-red-600 hover:text-red-700 underline"
        >
          Return to home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentDepartment.name}
        </h1>
        <p className="text-gray-600 mb-4">{currentDepartment.description}</p>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{courses.length} Courses</span>
          <span>•</span>
          <span>{professors.length} Professors</span>
          <span>•</span>
          <span>{departmentPosts.length / 4} Posts</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <FilterBar
            courses={courses}
            professors={professors}
            selectedCourse={selectedCourse}
            selectedProfessor={selectedProfessor}
            onCourseSelect={handleCourseChange}
            onProfessorSelect={handleProfessorChange}
            onClearFilters={handleClearFilters}
          />

          <div className="flex gap-4 items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="unanswered">Unanswered</option>
            </select>
            
            <CreatePostButton 
              departmentId={departmentId}
              prefilledCourse={selectedCourse}
              prefilledProfessor={selectedProfessor}
            />
          </div>
        </div>
        {(selectedCourse || selectedProfessor) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCourse && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                Course: {selectedCourse}
                <button
                  onClick={() => {
                    const params = {};
                    if (selectedProfessor) params.professor = selectedProfessor;
                    setSearchParams(params, { replace: true });
                  }}
                  className="ml-2 hover:text-red-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedProfessor && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                Professor: {
                  professors.find(p => p.id === parseInt(selectedProfessor))?.name || `ID: ${selectedProfessor}`
                }
                <button
                  onClick={() => {
                    const params = {};
                    if (selectedCourse) params.course = selectedCourse;
                    setSearchParams(params, { replace: true });
                  }}
                  className="ml-2 hover:text-red-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          <PostList posts={filteredPosts} showDepartment={false} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No posts yet
            </h2>
            <CreatePostButton 
              departmentId={departmentId}
              variant="primary"
              text="Be the first to post"
            />
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
