import { useState } from 'react';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import { searchRoutes } from './services/api';
import { Bus, MapPin, Navigation } from 'lucide-react';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (origin, destination) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchRoutes(origin, destination);
      setResults(data);
    } catch (err) {
      setError('Failed to find routes. Please make sure the backend server is running on port 3000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-matatu-green text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bus className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nairobi Matatu Nav</h1>
            <p className="text-green-100 text-sm">Navigate Nairobi's transport with ease</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Hero Section */}
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Find Your Route</h2>
          <p className="text-gray-600">Discover matatu routes, stages, fares, and available matatus</p>
        </div>

        {/* Search Form */}
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <SearchResults 
            results={results.results} 
            responseTime={results.meta?.response_time_ms}
            cacheHit={results.meta?.cache_hit}
          />
        )}

        {/* Empty State */}
        {!results && !loading && !error && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md mx-auto">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-matatu-green" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Navigate</h3>
              <p className="text-gray-500">Enter your origin and destination to find the best matatu routes</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p> Nairobi Matatu Nav. Built for Nairobi commuters.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
