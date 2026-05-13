import { useState } from 'react';
import { Search, MapPin, Navigation, ArrowRight } from 'lucide-react';

const SearchForm = ({ onSearch, loading }) => {
  const [origin, setOrigin] = useState('CBD');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin && destination) {
      onSearch(origin, destination);
    }
  };

  const popularDestinations = ['Westlands', 'Ngong Road', 'Eastlands', 'Thika Road', 'South B'];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Input Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g., CBD"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Prestige Mall"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 py-1">Popular:</span>
          {popularDestinations.map((dest) => (
            <button
              key={dest}
              type="button"
              onClick={() => setDestination(dest)}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 rounded-full transition-colors"
            >
              {dest}
            </button>
          ))}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-matatu-green hover:bg-matatu-dark text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Finding routes...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Search Routes</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
