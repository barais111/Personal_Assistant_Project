import React, { useState, useEffect } from 'react';
import {
  LogOut,
  CheckCircle,
  Newspaper,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  Clock,
  Bell,
  BarChart3,
  Target,
  Zap,
  Thermometer,
  Wind,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';


const DEEPSEEK_API_KEY = 'sk-c229e6e64f7c47879a99927a10b0b7f3';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const Dashboard = ({
  user,
  onLogout,
  calendarEvents = [],
  onNavigateToCalendar,
  onNavigateToNews,
  onToggleEventCompletion
}) => {
  // State for different sections
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({
    completedTasks: 0,
    totalTasks: 0,
    productivityScore: 85,
    meetingHours: 0,
    focusTime: 0
  });

  const [weather] = useState({
    temperature: 72,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 8,
    icon: '☀️',
    forecast: [
      { day: 'Mon', high: 75, low: 68, condition: 'Sunny' },
      { day: 'Tue', high: 78, low: 70, condition: 'Partly Cloudy' },
      { day: 'Wed', high: 80, low: 72, condition: 'Sunny' },
      { day: 'Thu', high: 76, low: 69, condition: 'Rain' }
    ]
  });

  const [news] = useState([
    {
      id: 1,
      title: 'AI Innovation Summit 2025',
      summary: 'Latest advances in AI and machine learning discussed at global summit',
      category: 'Technology',
      time: '2h ago'
    },
    {
      id: 2,
      title: 'Market Analysis Report',
      summary: 'Global markets show positive trends with tech sector leading growth',
      category: 'Finance',
      time: '4h ago'
    },
    {
      id: 3,
      title: 'Remote Work Study',
      summary: 'New research shows 40% increase in remote work productivity',
      category: 'Business',
      time: '1d ago'
    }
  ]);

  const [activeTab, setActiveTab] = useState('today');
  const [productivityData] = useState([
    { day: 'Mon', value: 75 },
    { day: 'Tue', value: 82 },
    { day: 'Wed', value: 68 },
    { day: 'Thu', value: 90 },
    { day: 'Fri', value: 88 },
    { day: 'Sat', value: 60 },
    { day: 'Sun', value: 55 }
  ]);

  // AI Assistant state
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Format time for display
  const formatTimeForDisplay = (time24h) => {
    if (!time24h) return '';
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  // Update tasks and stats when calendarEvents or selectedDate changes
  useEffect(() => {
    if (!calendarEvents || calendarEvents.length === 0) return;

    const dateStr = selectedDate.toDateString();

    // Get events for the selected date
    const dayEvents = calendarEvents.filter(
      (event) => new Date(event.date).toDateString() === dateStr
    );

    // Convert to tasks format
    const todayTasks = dayEvents.map((event) => ({
      id: event.id,
      title: event.title,
      time: formatTimeForDisplay(event.time),
      completed: event.completed || false,
      priority: event.priority,
      duration: event.duration,
      type: event.type,
      description: event.description
    }));

    setTasks(todayTasks);

    // Calculate statistics
    const completedTasks = todayTasks.filter((task) => task.completed).length;
    const totalTasks = todayTasks.length;

    const meetingHours = dayEvents
      .filter((event) => event.type === 'meeting')
      .reduce((sum, event) => sum + (event.duration / 60), 0);

    const focusTime = dayEvents
      .filter((event) => event.type !== 'meeting')
      .reduce((sum, event) => sum + (event.duration / 60), 0);

    setStats({
      completedTasks,
      totalTasks,
      productivityScore:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 85,
      meetingHours,
      focusTime
    });

    // Upcoming events (next 3 days) – relative to today
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);

    const nextThreeDays = calendarEvents
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate > today && eventDate <= threeDaysLater;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);

    setUpcomingEvents(nextThreeDays);
  }, [calendarEvents, selectedDate]);

  // Toggle task completion
  const toggleTask = (id) => {
    // Update local state for immediate UI feedback
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    // Notify parent to update the shared events
    if (onToggleEventCompletion) {
      onToggleEventCompletion(id);
    }
  };

  // Navigate days
  const navigateDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'meeting':
        return '👥';
      case 'appointment':
        return '📅';
      case 'personal':
        return '👤';
      default:
        return '📌';
    }
  };

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'today') return true;
    if (activeTab === 'high') return task.priority === 'high';
    if (activeTab === 'meetings') return task.type === 'meeting';
    return true;
  });

  // Get events for selected date
  const getDateEvents = (date) => {
    if (!calendarEvents) return [];
    return calendarEvents.filter(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );
  };

  // Format date display
  const formatDateDisplay = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fetch AI insight from DeepSeek
  const fetchAIInsight = async () => {
    setAiLoading(true);
    setAiError('');
    setAiInsight('');

    // Build a prompt using current data
    const taskSummary =
      tasks.length > 0
        ? tasks
            .map(
              (t) =>
                `- ${t.title} (${t.priority} priority, ${t.type}, ${t.duration}min, completed: ${t.completed})`
            )
            .join('\n')
        : 'No tasks scheduled for today.';

    const upcomingSummary =
      upcomingEvents.length > 0
        ? upcomingEvents
            .map(
              (e) =>
                `- ${e.title} on ${new Date(e.date).toLocaleDateString()} at ${
                  e.time
                } (${e.priority} priority)`
            )
            .join('\n')
        : 'No upcoming events in the next 3 days.';

    const prompt = `
      You are an AI productivity assistant. Based on the user's calendar and tasks, provide a concise, actionable insight.
      
      Today's tasks:
      ${taskSummary}
      
      Upcoming events (next 3 days):
      ${upcomingSummary}
      
      Statistics:
      - Completed today: ${stats.completedTasks} / ${stats.totalTasks}
      - Meeting hours today: ${stats.meetingHours.toFixed(1)}h
      - Focus time today: ${stats.focusTime.toFixed(1)}h
      - Total calendar events: ${calendarEvents.length}
      
      Please give one specific recommendation to improve productivity or manage time better today. Keep it under 150 words.
    `;

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are a helpful productivity coach.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const insight = data.choices[0]?.message?.content || 'Sorry, I could not generate an insight.';
      setAiInsight(insight);
    } catch (err) {
      setAiError('Failed to fetch AI insight. Please try again later.');
      console.error('DeepSeek API error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back, {user}!
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {formatDateDisplay(new Date())}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Weather Widget */}
            <div className="hidden md:flex items-center gap-2 bg-white/70 backdrop-blur-lg rounded-xl px-4 py-2 shadow-sm">
              <span className="text-2xl">{weather.icon}</span>
              <div>
                <div className="font-semibold text-gray-800">{weather.temperature}°F</div>
                <div className="text-xs text-gray-600">{weather.condition}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="mb-6 bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {formatDateDisplay(selectedDate)}
              </h3>
              <p className="text-sm text-gray-600">
                {getDateEvents(selectedDate).length} events scheduled
              </p>
            </div>

            <button
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks & Productivity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tasks Card */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Today's Tasks from Calendar
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {stats.completedTasks} of {stats.totalTasks} completed
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDate(new Date())}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* Task Tabs */}
              <div className="flex gap-2 mb-4">
                {['today', 'high', 'meetings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab === 'today' ? 'All Tasks' : tab === 'high' ? 'High Priority' : 'Meetings'}
                  </button>
                ))}
              </div>

              {/* Task List */}
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group p-4 rounded-xl border transition-all duration-300 ${
                        task.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white/50 border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-green-400 group-hover:scale-110'
                          }`}
                        >
                          {task.completed && <CheckCircle className="w-3 h-3 text-white m-auto" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3
                                className={`font-medium ${
                                  task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                                }`}
                              >
                                {getTypeIcon(task.type)} {task.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {task.time} • {task.duration}m
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    task.priority === 'high'
                                      ? 'bg-red-100 text-red-800'
                                      : task.priority === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}
                              ></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">No tasks for today</div>
                    <p className="text-sm text-gray-500">
                      Add tasks in the Calendar view to see them here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Productivity Score */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Calendar Stats
                  </h3>
                  <span className="text-xs text-gray-500">This Month</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Events</span>
                    <span className="font-bold text-lg">{calendarEvents.length}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">High Priority</span>
                    <span className="font-bold text-lg text-red-600">
                      {calendarEvents.filter((e) => e.priority === 'high').length}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Meetings</span>
                    <span className="font-bold text-lg text-blue-600">
                      {calendarEvents.filter((e) => e.type === 'meeting').length}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-bold text-lg text-green-600">
                      {calendarEvents.filter((e) => e.completed).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Distribution */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Time Distribution
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Meetings</span>
                      <span className="font-medium">{stats.meetingHours.toFixed(1)}h</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${Math.min(stats.meetingHours * 15, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Focus Time</span>
                      <span className="font-medium">{stats.focusTime.toFixed(1)}h</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${Math.min(stats.focusTime * 15, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Tip:</span> Try to keep meetings under 4 hours
                      for optimal productivity
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats, Weather, News, AI Assistant */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 opacity-80" />
                  <span className="text-xs opacity-90">Completed</span>
                </div>
                <div className="text-2xl font-bold">
                  {stats.completedTasks}/{stats.totalTasks}
                </div>
                <div className="text-sm opacity-90">Today's Tasks</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 opacity-80" />
                  <span className="text-xs opacity-90">Meetings</span>
                </div>
                <div className="text-2xl font-bold">
                  {tasks.filter((t) => t.type === 'meeting').length}
                </div>
                <div className="text-sm opacity-90">Today</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-5 h-5 opacity-80" />
                  <span className="text-xs opacity-90">Total</span>
                </div>
                <div className="text-2xl font-bold">{calendarEvents.length}</div>
                <div className="text-sm opacity-90">All Events</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Bell className="w-5 h-5 opacity-80" />
                  <span className="text-xs opacity-90">Reminders</span>
                </div>
                <div className="text-2xl font-bold">
                  {calendarEvents.filter((e) => e.reminder).length}
                </div>
                <div className="text-sm opacity-90">Active</div>
              </div>
            </div>

            {/* AI Assistant Card */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI Assistant
                </h3>
                <button
                  onClick={fetchAIInsight}
                  disabled={aiLoading}
                  className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {aiLoading ? 'Thinking...' : 'Get Insight'}
                  {!aiLoading && <Zap className="w-4 h-4" />}
                </button>
              </div>

              {aiError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-3">{aiError}</div>
              )}

              {aiInsight && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <p className="text-gray-800 text-sm leading-relaxed">{aiInsight}</p>
                </div>
              )}

              {!aiInsight && !aiLoading && !aiError && (
                <p className="text-gray-500 text-sm">
                  Click the button to get AI-powered recommendations based on your calendar.
                </p>
              )}
            </div>

            {/* Weather Card */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  Weather
                </h3>
                <span className="text-sm text-gray-500">New York</span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{weather.icon}</span>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{weather.temperature}°F</div>
                    <div className="text-gray-600">{weather.condition}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Wind className="w-4 h-4" />
                    {weather.windSpeed} mph
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Humidity: {weather.humidity}%</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="text-center p-2 rounded-lg bg-white/50">
                    <div className="font-medium text-gray-700">{day.day}</div>
                    <div className="text-2xl my-2">
                      {day.condition === 'Sunny'
                        ? '☀️'
                        : day.condition === 'Partly Cloudy'
                        ? '⛅'
                        : day.condition === 'Rain'
                        ? '🌧️'
                        : '☁️'}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-800">{day.high}°</div>
                      <div className="text-gray-500">{day.low}°</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events and News */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Upcoming Events from Calendar */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                Upcoming Events
              </h3>
              <span className="text-xs text-gray-500">Next 3 days</span>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-white/50 rounded-lg border-l-4"
                    style={{
                      borderLeftColor:
                        event.priority === 'high'
                          ? '#EF4444'
                          : event.priority === 'medium'
                          ? '#F59E0B'
                          : '#10B981'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{event.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="text-sm text-gray-600">•</span>
                          <span className="text-sm text-gray-600">
                            {formatTimeForDisplay(event.time)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              event.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : event.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {event.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {event.duration}m • {event.type}
                          </span>
                        </div>
                      </div>
                      {event.reminder && <Bell className="w-4 h-4 text-yellow-500" />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No upcoming events in calendar</div>
              )}
            </div>

            <button
              onClick={onNavigateToCalendar}
              className="w-full mt-4 py-2 text-center text-blue-500 hover:text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
            >
              View Full Calendar →
            </button>
          </div>

          {/* News Feed */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-500" />
                Latest News
              </h3>
              <span className="text-xs text-gray-500">Trending</span>
            </div>

            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="p-3 rounded-lg bg-white/50 group-hover:bg-white/80 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600">{item.summary}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onNavigateToNews}
              className="w-full mt-4 py-2 text-center text-blue-500 hover:text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
            >
              View All News →
            </button>
          </div>
        </div>

        {/* Bottom Section - Quick Tips */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Calendar Integration</h3>
              <p className="opacity-90">
                All your calendar events are automatically synced to the dashboard. Mark tasks as
                complete here, and they'll update across the entire system.
              </p>
            </div>
            <button
              onClick={onNavigateToCalendar}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Go to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;