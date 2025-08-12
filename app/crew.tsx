import React, { useState } from 'react';
import { MapPin, Plus, Users, Trophy, Star, Navigation, Play, Share2, Camera, Filter, Clock, TrendingUp } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  distance: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  reviews: number;
  location: string;
  type: 'Park' | 'School' | 'Street' | 'Track';
  tags: string[];
  image: string;
}

interface RunningRecord {
  id: string;
  date: string;
  distance: string;
  time: string;
  pace: string;
  calories: number;
  track: string;
}

const sampleTracks: Track[] = [
  {
    id: '1',
    name: 'Hangang River Park Route',
    distance: '5.2 km',
    difficulty: 'Easy',
    rating: 4.8,
    reviews: 124,
    location: '0.8 km away',
    type: 'Park',
    tags: ['Scenic', 'Flat', 'Well-lit'],
    image: 'https://images.pexels.com/photos/1556710/pexels-photo-1556710.jpeg'
  },
  {
    id: '2',
    name: 'Gangnam Elementary Track',
    distance: '400 m lap',
    difficulty: 'Easy',
    rating: 4.5,
    reviews: 89,
    location: '0.3 km away',
    type: 'School',
    tags: ['Track', 'Measured', 'Safe'],
    image: 'https://images.pexels.com/photos/2402448/pexels-photo-2402448.jpeg'
  },
  {
    id: '3',
    name: 'Namsan Tower Trail',
    distance: '3.8 km',
    difficulty: 'Hard',
    rating: 4.9,
    reviews: 156,
    location: '2.1 km away',
    type: 'Park',
    tags: ['Hill', 'Challenging', 'View'],
    image: 'https://images.pexels.com/photos/1005648/pexels-photo-1005648.jpeg'
  }
];

const sampleRecords: RunningRecord[] = [
  {
    id: '1',
    date: '2024-12-24',
    distance: '5.2 km',
    time: '28:45',
    pace: '5:32/km',
    calories: 412,
    track: 'Hangang River Park'
  },
  {
    id: '2',
    date: '2024-12-22',
    distance: '3.8 km',
    time: '24:12',
    pace: '6:22/km',
    calories: 298,
    track: 'Namsan Tower Trail'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'community' | 'records' | 'create'>('discover');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredTracks = selectedDifficulty === 'all' 
    ? sampleTracks 
    : sampleTracks.filter(track => track.difficulty.toLowerCase() === selectedDifficulty);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Park': return '🌳';
      case 'School': return '🏫';
      case 'Street': return '🛣️';
      case 'Track': return '🏃‍♂️';
      default: return '📍';
    }
  };

  const TabButton = ({ tab, icon: Icon, label, isActive }: { 
    tab: string; 
    icon: any; 
    label: string; 
    isActive: boolean 
  }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg transform -translate-y-0.5' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      <Icon size={20} />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );

  const TrackCard = ({ track }: { track: Track }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-32 bg-gradient-to-r from-blue-400 to-blue-600">
        <img 
          src={track.image} 
          alt={track.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(track.difficulty)}`}>
            {track.difficulty}
          </span>
        </div>
        <div className="absolute top-3 left-3 text-white">
          <span className="text-lg">{getTypeIcon(track.type)}</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{track.name}</h3>
          <div className="flex items-center ml-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{track.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{track.location}</span>
          <span className="mx-2">•</span>
          <span className="font-medium text-blue-600">{track.distance}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {track.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{track.reviews} reviews</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Start Run
          </button>
        </div>
      </div>
    </div>
  );

  const RecordCard = ({ record }: { record: RunningRecord }) => (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{record.track}</h3>
          <p className="text-sm text-gray-500">{record.date}</p>
        </div>
        <button className="text-gray-400 hover:text-blue-600 transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{record.distance}</p>
          <p className="text-xs text-gray-500">Distance</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{record.time}</p>
          <p className="text-xs text-gray-500">Time</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-orange-600">{record.pace}</p>
          <p className="text-xs text-gray-500">Pace</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">{record.calories}</p>
          <p className="text-xs text-gray-500">Calories</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RunWhere</h1>
                <p className="text-sm text-gray-500">Find your perfect run</p>
              </div>
            </div>
            <button className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pb-20">
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Location Status */}
            <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Current Location</span>
              </div>
              <p className="text-blue-100">Gangnam-gu, Seoul</p>
              <p className="text-sm text-blue-200 mt-1">12 tracks found nearby</p>
            </div>

            {/* Quick Filters */}
            <div className="flex space-x-2">
              {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    selectedDifficulty === difficulty
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {difficulty === 'all' ? 'All' : difficulty}
                </button>
              ))}
            </div>

            {/* Recommended Tracks */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended Tracks</h2>
              <div className="space-y-4">
                {filteredTracks.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="mt-6 space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Community</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">2.4k</p>
                  <p className="text-sm text-gray-500">Active Runners</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">156</p>
                  <p className="text-sm text-gray-500">Running Crews</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">89</p>
                  <p className="text-sm text-gray-500">Gear Reviews</p>
                </div>
              </div>
            </div>

            {/* Community Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Find Crews</h3>
                <p className="text-sm text-gray-500">Join local running groups</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Gear Reviews</h3>
                <p className="text-sm text-gray-500">Share equipment insights</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">JK</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Jina completed <span className="font-medium">Hangang River Route</span></p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">MH</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">MinHo shared a gear review for <span className="font-medium">Nike Air Zoom</span></p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="mt-6 space-y-6">
            {/* Stats Overview */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Your Stats</h2>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">47.2 km</p>
                  <p className="text-sm text-gray-500">This Month</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">5:48</p>
                  <p className="text-sm text-gray-500">Avg Pace</p>
                </div>
              </div>
            </div>

            {/* Recent Records */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Runs</h3>
                <button className="text-blue-600 hover:text-blue-700 transition-colors">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {sampleRecords.map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Create New Track</h2>
              <p className="text-gray-500 mb-6">Plan your own running route and share it with the community</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors w-full">
                Start Planning
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-4">Track Creation Tools</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Map Drawing</p>
                    <p className="text-sm text-gray-500">Draw your route on the map</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">GPS Recording</p>
                    <p className="text-sm text-gray-500">Record while you run</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Share2 className="h-6 w-6 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Import Route</p>
                    <p className="text-sm text-gray-500">Upload from other apps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="grid grid-cols-4 gap-1">
            <TabButton 
              tab="discover" 
              icon={MapPin} 
              label="Discover" 
              isActive={activeTab === 'discover'} 
            />
            <TabButton 
              tab="community" 
              icon={Users} 
              label="Community" 
              isActive={activeTab === 'community'} 
            />
            <TabButton 
              tab="records" 
              icon={Trophy} 
              label="Records" 
              isActive={activeTab === 'records'} 
            />
            <TabButton 
              tab="create" 
              icon={Plus} 
              label="Create" 
              isActive={activeTab === 'create'} 
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;
