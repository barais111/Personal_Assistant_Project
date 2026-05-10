import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Mic, MicOff, Bell, User, LogOut, Home, Clock, CheckCircle, X, Edit3, Newspaper } from 'lucide-react';

// Login Component
const LoginScreen = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      onLogin(credentials.username);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Personal Assistant</h1>
          <p className="text-purple-200">Your AI-powered productivity companion</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Team meeting', time: '10:00 AM', completed: false },
    { id: 2, title: 'Review project proposal', time: '2:00 PM', completed: true },
    { id: 3, title: 'Call client', time: '4:30 PM', completed: false }
  ]);

  const [news] = useState([
    { id: 1, title: 'Tech Innovation Summit 2025', summary: 'Latest advances in AI and machine learning discussed...' },
    { id: 2, title: 'Market Updates', summary: 'Global markets show positive trends this week...' },
    { id: 3, title: 'Weather Alert', summary: 'Sunny weather expected throughout the week...' }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome back, {user}!
            </h1>
            <p className="text-gray-600 mt-2">Here's what's happening today</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Today's Tasks</h2>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-full border-2 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300 hover:border-green-400'
                    } transition-colors`}
                  >
                    {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">{task.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                <span>Tasks Completed</span>
                <span className="font-bold">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg text-white">
                <span>This Week</span>
                <span className="font-bold">12 Tasks</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
                <span>Reminders</span>
                <span className="font-bold">3 Active</span>
              </div>
            </div>
          </div>

          {/* Daily News */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Daily News</h2>
              <Newspaper className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-3">
              {news.map(item => (
                <div key={item.id} className="p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors cursor-pointer">
                  <h3 className="font-medium text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calendar Component
const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Meeting', date: new Date(), time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Doctor Appointment', date: new Date(Date.now() + 86400000), time: '2:00 PM', type: 'appointment' },
    { id: 3, title: 'Birthday Party', date: new Date(Date.now() + 172800000), time: '6:00 PM', type: 'personal' }
  ]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'meeting' });

  const addEvent = () => {
    if (newEvent.title && newEvent.time) {
      setEvents([...events, {
        id: Date.now(),
        ...newEvent,
        date: selectedDate
      }]);
      setNewEvent({ title: '', time: '', type: 'meeting' });
      setShowEventForm(false);
    }
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Calendar
          </h1>
          <button
            onClick={() => setShowEventForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <div className="xl:col-span-3 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                ←
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h2>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth().map((date, index) => (
                <div
                  key={index}
                  className={`h-24 p-2 border rounded-lg cursor-pointer transition-all ${
                    date 
                      ? 'bg-white/50 hover:bg-white/80 border-gray-200' 
                      : 'bg-transparent'
                  } ${
                    date && date.toDateString() === new Date().toDateString()
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : ''
                  }`}
                  onClick={() => date && setSelectedDate(date)}
                >
                  {date && (
                    <>
                      <div className="font-semibold text-gray-800">{date.getDate()}</div>
                      <div className="space-y-1 mt-1">
                        {getEventsForDate(date).slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded text-white truncate ${
                              event.type === 'meeting' ? 'bg-blue-500' :
                              event.type === 'appointment' ? 'bg-green-500' :
                              'bg-purple-500'
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {getEventsForDate(date).length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{getEventsForDate(date).length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Events Sidebar */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedDate.toDateString()}
            </h3>
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className="p-3 bg-white/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.time}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                        event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'appointment' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {getEventsForDate(selectedDate).length === 0 && (
                <p className="text-gray-500 text-center py-8">No events for this day</p>
              )}
            </div>
          </div>
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Add New Event</h3>
                <button
                  onClick={() => setShowEventForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Event title"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                />
                <input
                  type="time"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <option value="meeting">Meeting</option>
                  <option value="appointment">Appointment</option>
                  <option value="personal">Personal</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={addEvent}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add Event
                  </button>
                  <button
                    onClick={() => setShowEventForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Voice Assistant Component
const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responses, setResponses] = useState([]);
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Call dentist tomorrow', time: '9:00 AM', active: true },
    { id: 2, text: 'Buy groceries', time: '6:00 PM', active: true }
  ]);

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const sampleCommands = [
          'Add reminder to call mom at 3 PM',
          'What are my tasks for today?',
          'Set reminder for meeting tomorrow',
          'Show my calendar for this week'
        ];
        const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
        setTranscript(randomCommand);
        processVoiceCommand(randomCommand);
        setIsListening(false);
      }, 2000);
    }
  };

  const processVoiceCommand = (command) => {
    let response = '';
    
    if (command.toLowerCase().includes('reminder')) {
      response = 'I\'ve added a reminder for you!';
      const newReminder = {
        id: Date.now(),
        text: command.replace(/add reminder to |set reminder for /gi, ''),
        time: 'Custom time',
        active: true
      };
      setReminders([...reminders, newReminder]);
    } else if (command.toLowerCase().includes('tasks')) {
      response = 'You have 3 tasks pending today. Would you like me to list them?';
    } else if (command.toLowerCase().includes('calendar')) {
      response = 'Opening your calendar view. You have 2 meetings this week.';
    } else {
      response = 'I understood your command. How can I help you further?';
    }
    
    setResponses([...responses, { command, response, timestamp: new Date() }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-8">
          Voice Assistant
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voice Control */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50 text-center">
            <div className="mb-6">
              <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all duration-300 ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                  : 'bg-gradient-to-r from-green-500 to-teal-500'
              }`}>
                {isListening ? (
                  <MicOff className="w-16 h-16 text-white" />
                ) : (
                  <Mic className="w-16 h-16 text-white" />
                )}
              </div>
            </div>
            
            <button
              onClick={toggleListening}
              className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-pink-500'
                  : 'bg-gradient-to-r from-green-500 to-teal-500'
              }`}
            >
              {isListening ? 'Stop Listening' : 'Start Voice Command'}
            </button>
            
            {isListening && (
              <div className="mt-4">
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-8 bg-green-500 rounded animate-pulse"></div>
                  <div className="w-2 h-12 bg-teal-500 rounded animate-pulse delay-100"></div>
                  <div className="w-2 h-6 bg-blue-500 rounded animate-pulse delay-200"></div>
                  <div className="w-2 h-10 bg-green-500 rounded animate-pulse delay-300"></div>
                </div>
                <p className="text-gray-600 mt-2">Listening...</p>
              </div>
            )}
            
            {transcript && (
              <div className="mt-4 p-4 bg-white/50 rounded-lg">
                <p className="text-gray-800"><strong>You said:</strong> "{transcript}"</p>
              </div>
            )}
          </div>

          {/* Active Reminders */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Voice Reminders</h2>
              <Bell className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="space-y-3">
              {reminders.map(reminder => (
                <div key={reminder.id} className="p-3 bg-white/50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{reminder.text}</p>
                    <p className="text-sm text-gray-600">{reminder.time}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${reminder.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Command History */}
        {responses.length > 0 && (
          <div className="mt-6 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Commands</h2>
            <div className="space-y-4">
              {responses.slice(-5).reverse().map((item, index) => (
                <div key={index} className="p-4 bg-white/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-800">You: "{item.command}"</p>
                    <span className="text-xs text-gray-500">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-green-600">Assistant: {item.response}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voice Commands Help */}
        <div className="mt-6 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Voice Commands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Calendar:</strong> "Show my calendar", "Add meeting tomorrow"</p>
              <p className="text-gray-700"><strong>Reminders:</strong> "Set reminder to...", "Add reminder for..."</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Tasks:</strong> "What are my tasks?", "Mark task as done"</p>
              <p className="text-gray-700"><strong>Articles:</strong> "Read me the news", "What's in the articles?"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// News Component
const NewsView = () => {
  const [news] = useState([
    {
      id: 1,
      title: 'Revolutionary AI Breakthrough in Healthcare',
      summary: 'Scientists develop new AI system that can predict diseases with 99% accuracy, potentially saving millions of lives.',
      category: 'Technology',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'Global Climate Summit Reaches Historic Agreement',
      summary: 'World leaders unite on comprehensive climate action plan, setting ambitious targets for carbon neutrality.',
      category: 'Environment',
      time: '4 hours ago'
    },
    {
      id: 3,
      title: 'Space Tourism Takes Giant Leap Forward',
      summary: 'Private space companies announce new affordable space travel packages for civilians starting next year.',
      category: 'Space',
      time: '6 hours ago'
    },
    {
      id: 4,
      title: 'Quantum Computing Milestone Achieved',
      summary: 'Researchers successfully demonstrate quantum advantage in practical real-world applications.',
      category: 'Technology',
      time: '8 hours ago'
    },
    {
      id: 5,
      title: 'Renewable Energy Costs Hit Record Low',
      summary: 'Solar and wind energy become cheaper than fossil fuels in most markets worldwide.',
      category: 'Energy',
      time: '10 hours ago'
    },
    {
      id: 6,
      title: 'Medical Breakthrough in Gene Therapy',
      summary: 'New gene therapy treatment shows promise in curing rare genetic diseases, offering hope to millions.',
      category: 'Health',
      time: '12 hours ago'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Technology', 'Environment', 'Space', 'Energy', 'Health'];

  const filteredNews = selectedCategory === 'All' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Daily News
          </h1>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-white/70 text-gray-700 hover:bg-white/90'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map(item => (
            <div key={item.id} className="bg-white/70 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-white/50 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer">
              <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                <Newspaper className="w-12 h-12 text-gray-500" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.category === 'Technology' ? 'bg-blue-100 text-blue-800' :
                    item.category === 'Environment' ? 'bg-green-100 text-green-800' :
                    item.category === 'Space' ? 'bg-purple-100 text-purple-800' :
                    item.category === 'Energy' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.summary}
                </p>
                <button className="mt-4 text-orange-600 hover:text-orange-800 font-medium text-sm transition-colors">
                  Read more →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Breaking News Ticker */}
        <div className="mt-8 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl p-4 overflow-hidden">
          <div className="flex items-center">
            <span className="bg-white text-red-500 px-3 py-1 rounded-full text-sm font-bold mr-4 flex-shrink-0">
              BREAKING
            </span>
            <div className="animate-marquee whitespace-nowrap">
              <span className="mx-4">🚀 SpaceX launches successful Mars mission</span>
              <span className="mx-4">💡 New renewable energy record set globally</span>
              <span className="mx-4">🏥 COVID-19 variant successfully contained</span>
              <span className="mx-4">📱 Tech giants announce major AI collaboration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = ({ currentView, setCurrentView, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'news', label: 'News', icon: Newspaper }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg border-b border-white/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-800">Assistant</span>
            </div>
            <nav className="flex gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = (username) => {
    setUser(username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser('');
    setCurrentView('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} onLogout={handleLogout} />;
      case 'calendar':
        return <CalendarView />;
      case 'voice':
        return <VoiceAssistant />;
      case 'news':
        return <NewsView />;
      default:
        return <Dashboard user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={user} 
        onLogout={handleLogout} 
      />
      {renderCurrentView()}
    </div>
  );
};

export default App;