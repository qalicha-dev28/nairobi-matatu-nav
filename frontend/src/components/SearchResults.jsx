import { Bus, MapPin, Clock, DollarSign, Star, Users, ArrowRight } from 'lucide-react';

const SearchResults = ({ results, responseTime, cacheHit }) => {
  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bus className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No routes found</h3>
        <p className="text-gray-500">Try different locations or check your spelling</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex justify-between items-center px-2">
        <span className="text-sm font-medium text-gray-600">
          {results.length} route{results.length !== 1 ? 's' : ''} found
        </span>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {responseTime}ms {cacheHit && '• cached'}
        </span>
      </div>

      {results.map((result, index) => (
        <div key={result.route.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          
          {/* Route Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 md:p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-white/20 px-2 py-1 rounded text-sm font-mono">{result.route.number}</span>
                  <span className="text-green-100 text-sm">{(result.match_quality * 100).toFixed(0)}% match</span>
                </div>
                <h3 className="text-xl font-bold">{result.route.name}</h3>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-100 text-2xl font-bold">
                  <DollarSign className="w-6 h-6" />
                  <span>{result.fare?.min}-{result.fare?.max}</span>
                </div>
                <span className="text-green-200 text-sm">{result.fare?.currency}</span>
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="p-4 md:p-6 space-y-4">
            
            {/* Stages */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                <div className="flex items-center text-green-700 font-semibold mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>Board at</span>
                </div>
                <p className="text-lg font-medium text-gray-800">{result.boarding?.stage?.name}</p>
                <p className="text-sm text-gray-500 mt-1">CBD Stage</p>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
                <div className="flex items-center text-orange-700 font-semibold mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>Alight at</span>
                </div>
                <p className="text-lg font-medium text-gray-800">{result.alighting?.stage?.name}</p>
                <p className="text-sm text-gray-500 mt-1">Destination Stage</p>
              </div>
            </div>

            {/* Duration & Info */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                <span>{result.estimated_duration_minutes?.min}-{result.estimated_duration_minutes?.max} minutes</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2 text-gray-400" />
                <span>{result.matatus?.length || 0} matatus available</span>
              </div>
            </div>

            {/* Matatus List */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <Bus className="w-5 h-5 mr-2 text-matatu-green" />
                Available Matatus
              </h4>
              <div className="space-y-2">
                {result.matatus?.map((matatu) => (
                  <div key={matatu.id} className="flex items-center justify-between bg-gray-50 hover:bg-green-50 rounded-xl p-4 transition-colors border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="bg-matatu-green text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm">
                        {matatu.matatu_number.split(' ')[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{matatu.matatu_number}</p>
                        <p className="text-sm text-gray-500">{matatu.capacity} seats • {matatu.vehicle_type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 font-medium">{matatu.sacco?.reliability_score}</span>
                      </div>
                      <p className="text-sm text-gray-500">{matatu.sacco?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
