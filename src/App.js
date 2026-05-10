// import React, { useState } from 'react';
// import LoginScreen from './components/LoginScreen';
// import Dashboard from './components/Dashboard';
// import CalendarView from './components/CalendarView';
// import VoiceAssistant from './components/VoiceAssistant';
// import NewsView from './components/NewsView';
// import Navigation from './components/Navigation';

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState('');
//   const [currentView, setCurrentView] = useState('dashboard');

//   const handleLogin = (username) => {
//     setUser(username);
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUser('');
//     setCurrentView('dashboard');
//   };

//   if (!isLoggedIn) {
//     return <LoginScreen onLogin={handleLogin} />;
//   }

//   const renderCurrentView = () => {
//     switch (currentView) {
//       case 'dashboard':
//         return <Dashboard user={user} onLogout={handleLogout} />;
//       case 'calendar':
//         return <CalendarView />;
//       case 'voice':
//         return <VoiceAssistant />;
//       case 'news':
//         return <NewsView />;
//       default:
//         return <Dashboard user={user} onLogout={handleLogout} />;
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       <Navigation 
//         currentView={currentView} 
//         setCurrentView={setCurrentView} 
//         user={user} 
//         onLogout={handleLogout} 
//       />
//       {renderCurrentView()}
//     </div>
//   );
// };

// export default App;import React, { useState } from "react";
import React, { useState, useEffect, useRef } from 'react';
import LoginScreen from "./components/LoginScreen";
import Dashboard from "./components/Dashboard";
import CalendarView from "./components/CalendarView";
import VoiceAssistant from "./components/VoiceAssistant";
import NewsView from "./components/NewsView";
import Navigation from "./components/Navigation";
import Task from "./components/Task";

// Initial events data - This is shared between Calendar and Dashboard
const initialEvents = [
  { 
    id: 1, 
    title: 'Team Meeting', 
    date: new Date(), 
    time: '10:00', 
    type: 'meeting', 
    priority: 'high',
    description: 'Quarterly planning session with the entire team',
    duration: 60,
    reminder: true,
    reminderTime: 15,
    color: '#EF4444',
    completed: false
  },
  { 
    id: 2, 
    title: 'Doctor Appointment', 
    date: new Date(Date.now() + 86400000), 
    time: '14:30', 
    type: 'appointment', 
    priority: 'medium',
    description: 'Annual checkup with Dr. Smith',
    duration: 30,
    reminder: true,
    reminderTime: 30,
    color: '#F59E0B',
    completed: true
  },
  { 
    id: 3, 
    title: 'Birthday Party', 
    date: new Date(Date.now() + 172800000), 
    time: '18:00', 
    type: 'personal', 
    priority: 'low',
    description: 'Birthday celebration at downtown restaurant',
    duration: 120,
    reminder: false,
    reminderTime: 0,
    color: '#10B981',
    completed: false
  },
  { 
    id: 4, 
    title: 'Project Review', 
    date: new Date(), 
    time: '11:30', 
    type: 'meeting', 
    priority: 'high',
    description: 'Weekly project status review',
    duration: 90,
    reminder: true,
    reminderTime: 10,
    color: '#EF4444',
    completed: false
  },
  { 
    id: 5, 
    title: 'Lunch Break', 
    date: new Date(), 
    time: '13:00', 
    type: 'personal', 
    priority: 'low',
    description: 'Lunch with team',
    duration: 60,
    reminder: false,
    reminderTime: 0,
    color: '#10B981',
    completed: false
  },
  { 
    id: 6, 
    title: 'Client Call', 
    date: new Date(Date.now() + 86400000), 
    time: '11:00', 
    type: 'meeting', 
    priority: 'high',
    description: 'Monthly client sync',
    duration: 45,
    reminder: true,
    reminderTime: 15,
    color: '#EF4444',
    completed: false
  },
  { 
    id: 7, 
    title: 'Gym Session', 
    date: new Date(), 
    time: '17:00', 
    type: 'personal', 
    priority: 'low',
    description: 'Evening workout',
    duration: 60,
    reminder: true,
    reminderTime: 10,
    color: '#10B981',
    completed: false
  }
];

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [events, setEvents] = useState(initialEvents);
  const handleToggleEventCompletion = (eventId) => {
  setEvents(prevEvents =>
    prevEvents.map(event =>
      event.id === eventId ? { ...event, completed: !event.completed } : event
    )
  );
};

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation
        currentView={page}
        setCurrentView={setPage}
        user={user}
        onLogout={() => setUser(null)}
      />
      
      <div className="pt-16">
        {page === "dashboard" && (
          <Dashboard 
  user={user} 
  onLogout={() => setUser(null)}
  calendarEvents={events}
  onNavigateToCalendar={() => setPage('calendar')}
  onNavigateToNews={() => setPage('news')} 
  onToggleEventCompletion={handleToggleEventCompletion}   // ✅ optional
/>
        )}
        {page === "calendar" && (
          <CalendarView 
            events={events}
            setEvents={setEvents}
          />
        )}
        {page === "voice" && <VoiceAssistant />}
        {page === "news" && <NewsView />}
        {page === "task" && <Task />}
      </div>
    </div>
  );
};

export default App;