import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProfessor } from '../context/ProfessorContext';
import { useDepartment } from '../context/DepartmentContext';
import { postService } from '../services/postService';
import PostList from '../components/PostList';
import CreatePostButton from '../components/CreatePostButton';

export default function ProfessorBoard() {
  const { profId } = useParams();
  const navigate = useNavigate();
  
  // Context hooks
  const { 
    currentProfessor, 
    fetchProfessorById,
    loading: profLoading 
  } = useProfessor();
  
  const { getDepartmentById } = useDepartment();

  // Local state
  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // posts, about, courses

  // Fetch professor data and posts
  useEffect(() => {
    const loadProfessorData = async () => {
      setLoading(true);
      try {
        const prof = await fetchProfessorById(profId);
        if (prof) {
          const professorPosts = await postService.getPostsByProfessor(profId);
          setPosts(professorPosts);
          setCourses(prof.courses || []);
        }
      } catch (error) {
        console.error('Error loading professor data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profId) {
      loadProfessorData();
    }
  }, [profId]);

  // Filter and sort posts
  const getFilteredPosts = () => {
    let filtered = [...posts];

    if (selectedCourse) {
      filtered = filtered.filter(post => post.courseCode === selectedCourse);
    }

    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.upvotes + b.comments.length) - (a.upvotes + a.comments.length));
        break;
      case 'helpful':
        filtered.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    return filtered;
  };

  if (loading || profLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!currentProfessor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Professor not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-red-600 hover:text-red-700 underline"
        >
          Return to home
        </button>
      </div>
    );
  }

  const department = getDepartmentById(currentProfessor.departmentId);
  const filteredPosts = getFilteredPosts();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Professor Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentProfessor.name}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <Link 
                to={`/departments/${currentProfessor.departmentId}`}
                className="hover:text-red-600 transition-colors"
              >
                {department?.name || 'Department'}
              </Link>
              {currentProfessor.email && (
                <>
                  <span>•</span>
                  <a 
                    href={`mailto:${currentProfessor.email}`}
                    className="hover:text-red-600 transition-colors"
                  >
                    {currentProfessor.email}
                  </a>
                </>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-semibold text-gray-900">{posts.length}</span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">{courses.length}</span>
                <span className="text-gray-600 ml-1">Courses</span>
              </div>
              {currentProfessor.rating && (
                <div>
                  <span className="font-semibold text-gray-900">{currentProfessor.rating}</span>
                  <span className="text-gray-600 ml-1">/ 5.0 Rating</span>
                </div>
              )}
            </div>
          </div>

          <CreatePostButton 
            departmentId={currentProfessor.departmentId}
            prefilledProfessor={profId}
            text="Ask Question"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'posts'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Discussion Posts
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'courses'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Courses Taught
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'about'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'posts' && (
            <div>
              {/* Filters for Posts */}
                            {/* Filters for Posts */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
                <div className="flex gap-4 items-center">
                  {courses.length > 0 && (
                    <select
                      value={selectedCourse || ''}
                      onChange={(e) => setSelectedCourse(e.target.value || null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">All Courses</option>
                      {courses.map(course => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>

                {selectedCourse && (
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              {/* Posts List */}
              {filteredPosts.length > 0 ? (
                <PostList 
                  posts={filteredPosts} 
                  showDepartment={false}
                  showProfessor={false}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    {selectedCourse 
                      ? `No posts found for ${selectedCourse}.` 
                      : 'No posts yet for this professor.'}
                  </p>
                  <CreatePostButton 
                    departmentId={currentProfessor.departmentId}
                    prefilledProfessor={profId}
                    variant="primary"
                    text="Ask the first question"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-4">
              {courses.length > 0 ? (
                courses.map(course => (
                  <div 
                    key={course}
                    className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{course}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {posts.filter(p => p.courseCode === course).length} discussions
                        </p>
                      </div>
                      <Link
                        to={`/departments/${currentProfessor.departmentId}?course=${course}&professor=${profId}`}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        View Posts →
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No courses listed for this professor.
                </p>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="prose max-w-none">
              {currentProfessor.bio ? (
                <div>
                  <p className="text-gray-700">{currentProfessor.bio}</p>
                  
                  {currentProfessor.officeHours && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900">Office Hours</h4>
                      <p className="text-gray-700">{currentProfessor.officeHours}</p>
                    </div>
                  )}
                  
                  {currentProfessor.office && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900">Office Location</h4>
                      <p className="text-gray-700">{currentProfessor.office}</p>
                    </div>
                  )}
                  
                  {currentProfessor.researchInterests && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900">Research Interests</h4>
                      <ul className="list-disc list-inside text-gray-700">
                        {currentProfessor.researchInterests.map((interest, index) => (
                          <li key={index}>{interest}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No additional information available for this professor.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Professors Section */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Other Professors in {department?.name}
          </h3>
          <RelatedProfessors 
            departmentId={currentProfessor.departmentId} 
            currentProfId={profId}
          />
        </div>
      )}
    </div>
  );
}

// Related Professors Component
function RelatedProfessors({ departmentId, currentProfId }) {
  const { professorsByDepartment } = useProfessor();
  const professors = professorsByDepartment[departmentId] || [];
  
  const relatedProfessors = professors
    .filter(prof => prof.id !== currentProfId)
    .slice(0, 5);

  if (relatedProfessors.length === 0) {
    return (
      <p className="text-gray-500 text-sm">No other professors found in this department.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {relatedProfessors.map(prof => (
        <Link
          key={prof.id}
          to={`/professors/${prof.id}`}
          className="block p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors"
        >
          <h4 className="font-medium text-gray-900">{prof.name}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {prof.courses?.length || 0} courses
          </p>
          {prof.rating && (
            <div className="flex items-center mt-2">
              <span className="text-sm font-medium text-gray-900">{prof.rating}</span>
              <span className="text-sm text-gray-600 ml-1">/ 5.0</span>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}