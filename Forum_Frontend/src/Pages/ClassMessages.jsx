// pages/ClassMessages.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { useDepartment } from '../context/DepartmentContext';
import { useClass } from '../context/ClassContext';
import { useProfessor } from '../context/ProfessorContext';
import PostList from '../components/PostList';
import CreatePostButton from '../components/CreatePostButton';

export default function ClassMessages() {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  // Context hooks
  const { departments } = useDepartment();
  const { fetchClassInfo, getRelatedClasses, toggleClassChat } = useClass();
  const { professors } = useProfessor();
  
  // Local state
  const [posts, setPosts] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [relatedClasses, setRelatedClasses] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(false);

  // Fetch class data and posts
  useEffect(() => {
    const loadClassData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch class info and related classes
        const [classData, related] = await Promise.all([
          fetchClassInfo(classId),
          getRelatedClasses(classId)
        ]);
        
        setClassInfo(classData);
        setRelatedClasses(related);
        setChatEnabled(classData.chatEnabled || false);
        
        // Fetch initial posts for this class
        const postsData = await postService.getPostsByClass(classId, {
          page: 1,
          limit: 20,
          sortBy
        });
        
        setPosts(postsData.posts || postsData);
        setHasMore(postsData.hasMore || false);
        setPage(1);
      } catch (err) {
        console.error('Error loading class data:', err);
        setError('Failed to load class information');
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      loadClassData();
    }
  }, [classId, sortBy]);

  // Handle professor filter change
  useEffect(() => {
    if (selectedProfessor !== null) {
      filterPosts();
    }
  }, [selectedProfessor]);

  // Filter posts by professor
  const filterPosts = async () => {
    setLoading(true);
    try {
      const filters = {
        professorId: selectedProfessor,
        sortBy,
        page: 1,
        limit: 20
      };
      
      const postsData = await postService.getPostsByClass(classId, filters);
      setPosts(postsData.posts || postsData);
      setHasMore(postsData.hasMore || false);
      setPage(1);
    } catch (err) {
      console.error('Error filtering posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load more posts (pagination)
  const loadMorePosts = async () => {
    if (!hasMore || loading) return;
    
    try {
      const nextPage = page + 1;
      const filters = {
        professorId: selectedProfessor,
        sortBy,
        page: nextPage,
        limit: 20
      };
      
      const postsData = await postService.getPostsByClass(classId, filters);
      setPosts(prev => [...prev, ...(postsData.posts || postsData)]);
      setHasMore(postsData.hasMore || false);
      setPage(nextPage);
    } catch (err) {
      console.error('Error loading more posts:', err);
    }
  };

  // Toggle chat functionality
  const handleToggleChat = async () => {
    try {
      const updatedClass = await toggleClassChat(classId, !chatEnabled);
      setChatEnabled(updatedClass.chatEnabled);
    } catch (err) {
      console.error('Error toggling chat:', err);
    }
  };

  // Get post count by professor
  const getPostCountByProfessor = (profId) => {
    return posts.filter(post => post.professorId === profId).length;
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-red-600 hover:text-red-700 underline"
        >
          Return to home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Class Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500 text-sm">Class</span>
              {classInfo?.department && (
                <Link 
                  to={`/departments/${classInfo.department.id}`}
                  className="text-gray-500 text-sm hover:text-red-600"
                >
                  {classInfo.department.name}
                </Link>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {classInfo?.code} - {classInfo?.name}
            </h1>
            
            {classInfo?.description && (
              <p className="text-gray-600 mb-4">{classInfo.description}</p>
            )}
            
            <div className="flex gap-6 text-sm text-gray-500">
              <span>
                <strong className="text-gray-900">{classInfo?.credits || 3}</strong> credits
              </span>
              <span>
                <strong className="text-gray-900">{posts.length}</strong> posts
              </span>
              <span>
                <strong className="text-gray-900">{classInfo?.followerCount || 0}</strong> followers
              </span>
              {classInfo?.professorCount && (
                <span>
                  <strong className="text-gray-900">{classInfo.professorCount}</strong> professors
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleToggleChat}
              className={`px-4 py-2 rounded-lg transition-colors ${
                chatEnabled 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {chatEnabled ? 'Chat Enabled' : 'Chat Disabled'}
                        </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Follow Class
            </button>
            <CreatePostButton 
              prefilledClass={classInfo}
              text="New Post"
            />
          </div>
        </div>
      </div>

      {/* Class Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Prerequisites */}
        {classInfo?.prerequisites && classInfo.prerequisites.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites</h3>
            <div className="space-y-1">
              {classInfo.prerequisites.map(prereq => (
                <Link
                  key={prereq.id}
                  to={`/classes/${prereq.id}`}
                  className="block text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  {prereq.code} - {prereq.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Current Professors */}
        {classInfo?.professors && classInfo.professors.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Professors</h3>
            <div className="space-y-1">
              {classInfo.professors.map(prof => (
                <Link
                  key={prof.id}
                  to={`/professors/${prof.id}`}
                  className="block text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  {prof.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Class Times */}
        {classInfo?.sections && classInfo.sections.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Sections</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {classInfo.sections.map((section, idx) => (
                <div key={idx}>
                  <span className="font-medium">{section.sectionNumber}</span>: {section.time}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Classes */}
      {relatedClasses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Related Classes</h3>
          <div className="flex flex-wrap gap-2">
            {relatedClasses.map(relatedClass => (
              <Link
                key={relatedClass.id}
                to={`/classes/${relatedClass.id}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {relatedClass.code} - {relatedClass.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex gap-4 items-center">
            {/* Professor Filter */}
            {classInfo?.professors && classInfo.professors.length > 1 && (
              <select
                value={selectedProfessor || ''}
                onChange={(e) => setSelectedProfessor(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Professors</option>
                {classInfo.professors.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name} ({getPostCountByProfessor(prof.id)})
                  </option>
                ))}
              </select>
            )}
            
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
              <option value="unanswered">Unanswered</option>
            </select>
          </div>
          
          {selectedProfessor && (
            <button
              onClick={() => setSelectedProfessor(null)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear professor filter
            </button>
          )}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          <>
            <PostList 
              posts={posts} 
              showProfessor={true}
              showClass={false}
            />
            
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMorePosts}
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Posts'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-4">
              {selectedProfessor 
                ? 'No posts found for this class with the selected professor.' 
                : `No posts yet for ${classInfo?.code}.`}
            </p>
            <CreatePostButton 
              prefilledClass={classInfo}
              variant="primary"
              text="Be the first to post"
            />
          </div>
        )}
      </div>

      {/* Class Stats Sidebar */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Resources */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Class Resources</h3>
          <div className="space-y-3">
            <a
              href={`/classes/${classId}/syllabus`}
              className="flex items-center text-sm text-gray-700 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Syllabus
            </a>
            <a
              href={`/classes/${classId}/materials`}
              className="flex items-center text-sm text-gray-700 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Course Materials
            </a>
            {chatEnabled && (
              <a
                href={`/classes/${classId}/chat`}
                className="flex items-center text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Join Class Chat
              </a>
            )}
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Contributors</h3>
          <div className="space-y-3">
            {classInfo?.topContributors?.slice(0, 5).map(user => (
              <Link
                key={user.id}
                to={`/users/${user.id}`}
                className="flex justify-between items-center text-sm hover:text-red-600 transition-colors"
              >
                <span>{user.username}</span>
                <span className="text-gray-500">{user.postCount} posts</span>
              </Link>
            )) || (
              <p className="text-sm text-gray-500">No contributor data available</p>
            )}
          </div>
        </div>

        {/* Class Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Activity</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Posts today</span>
              <span className="font-medium">{classInfo?.postsToday || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Posts this week</span>
              <span className="font-medium">{classInfo?.postsThisWeek || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active discussions</span>
              <span className="font-medium">{classInfo?.activeDiscussions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Response rate</span>
              <span className="font-medium">{classInfo?.responseRate || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}