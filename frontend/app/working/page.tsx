function HomePage() {
  return React.createElement('div', {
    className: 'min-h-screen bg-gray-50 flex items-center justify-center'
  }, 
    React.createElement('div', {
      className: 'text-center'
    },
      React.createElement('h1', {
        className: 'text-4xl font-bold text-gray-900 mb-4'
      }, 'UzimaSmart Climate Monitor'),
      React.createElement('p', {
        className: 'text-xl text-gray-600 mb-8'
      }, '✅ Connection established successfully!'),
      React.createElement('div', {
        className: 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'
      }, '🌍 Server running on localhost:3000'),
      React.createElement('div', {
        className: 'mt-6 space-y-2'
      },
        React.createElement('a', {
          href: '/test',
          className: 'block text-blue-600 hover:text-blue-800'
        }, '→ Go to Test Page'),
        React.createElement('a', {
          href: '/maps-simple',
          className: 'block text-blue-600 hover:text-blue-800'
        }, '→ Go to Maps')
      )
    )
  )
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HomePage
} else {
  window.HomePage = HomePage
}

export default HomePage
