'use client'

import { useState } from 'react'
import { UserGroupIcon, ChatBubbleLeftRightIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { AIInsights } from '@/components/insights/AIInsights'

const communityPosts = [
  {
    id: 1,
    author: 'John Kamau',
    location: 'Kiambu County',
    timestamp: '2 hours ago',
    type: 'observation',
    content: 'Unusual rainfall patterns observed in our area. Crops are responding well but soil erosion is a concern.',
    image: '/api/placeholder/300/200',
    likes: 12,
    comments: 3
  },
  {
    id: 2,
    author: 'Mary Wanjiku',
    location: 'Nakuru County',
    timestamp: '4 hours ago',
    type: 'alert',
    content: 'Early signs of drought stress in maize crops. Community members should consider water conservation measures.',
    likes: 8,
    comments: 5
  },
  {
    id: 3,
    author: 'Peter Ochieng',
    location: 'Kisumu County',
    timestamp: '1 day ago',
    type: 'success',
    content: 'Successful harvest using climate-smart agriculture techniques. Happy to share knowledge with other farmers.',
    image: '/api/placeholder/300/200',
    likes: 24,
    comments: 8
  }
]

const communityStats = {
  totalMembers: 15680,
  activeUsers: 2340,
  postsToday: 127,
  alertsShared: 45
}

export default function CommunityPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [newPost, setNewPost] = useState('')

  const handlePostSubmit = () => {
    // Handle post submission
    console.log('Submitting post:', newPost)
    setNewPost('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Platform</h1>
          <p className="text-gray-600">Connect with farmers and climate monitors across Kenya</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Share with Community</h2>
              <div className="space-y-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your climate observations, farming tips, or ask questions..."
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">📸 Photo</button>
                    <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">📍 Location</button>
                    <button className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full">⚠️ Alert</button>
                  </div>
                  <button
                    onClick={handlePostSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex space-x-1">
                {[
                  { id: 'all', name: 'All Posts' },
                  { id: 'observations', name: 'Observations' },
                  { id: 'alerts', name: 'Alerts' },
                  { id: 'tips', name: 'Tips' },
                  { id: 'questions', name: 'Questions' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === filter.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Community Posts */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{post.author.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{post.author}</h3>
                        <span className="text-sm text-gray-500 flex items-center">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {post.location}
                        </span>
                        <span className="text-sm text-gray-500">{post.timestamp}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.type === 'alert' ? 'bg-red-100 text-red-700' :
                          post.type === 'success' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {post.type}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      {post.image && (
                        <div className="mb-3">
                          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
                        </div>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-blue-600">
                          <span>👍</span>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-600">
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="hover:text-blue-600">Share</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Community Insights */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Insights</h2>
              <AIInsights
                data={{
                  totalPosts: communityPosts.length,
                  activeUsers: communityStats.activeUsers,
                  commonTopics: ['drought', 'rainfall', 'crop health'],
                  engagementRate: '78%'
                }}
                type="community_analysis"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-gray-600">Members</span>
                  </div>
                  <span className="font-semibold">{communityStats.totalMembers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-gray-600">Active Today</span>
                  </div>
                  <span className="font-semibold">{communityStats.activeUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posts Today</span>
                  <span className="font-semibold">{communityStats.postsToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Alerts Shared</span>
                  <span className="font-semibold text-orange-600">{communityStats.alertsShared}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  Report Emergency
                </button>
                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                  Share Alert
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Ask Expert
                </button>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Members</h3>
              <div className="space-y-3">
                {['Sarah M.', 'James K.', 'Grace N.', 'David O.'].map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">{user.charAt(0)}</span>
                      </div>
                      <span className="text-gray-900">{user}</span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Help */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  <PhoneIcon className="h-4 w-4" />
                  <span>Call Support</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span>Live Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
