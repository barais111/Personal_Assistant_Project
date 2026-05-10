
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

// ============ Firebase Configuration ============
// IMPORTANT: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDX7E1tTtBea615vugPJCdiemz6zJtsA3c",
  authDomain: "personalassist-1.firebaseapp.com",
  databaseURL: "https://personalassist-1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "personalassist-1",
  storageBucket: "personalassist-1.firebasestorage.app",
  messagingSenderId: "235298939554",
  appId: "1:235298939554:web:71cc1445aae40abac2edfb",
  measurementId: "G-H2N6WBNX46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Mock Data
const initialHabits = [
  { id: 1, name: '5:30 AM Wake Up', emoji: '⏰', category: 'health', difficulty: 3 },
  { id: 2, name: 'Daily Office Meeting', emoji: '🍀', category: 'work', difficulty: 1 },
  { id: 3, name: 'Studies', emoji: '📘📘', category: 'learning', difficulty: 2 },
  { id: 4, name: 'Budget Tracking', emoji: '💰', category: 'finance', difficulty: 2 },
  { id: 5, name: 'Diet Follow', emoji: '🍃', category: 'health', difficulty: 3 },
  { id: 6, name: 'No social media', emoji: '❌', category: 'digital', difficulty: 4 },
  { id: 7, name: 'Project Work', emoji: '🎯', category: 'work', difficulty: 3 },
  { id: 8, name: '5 Pages Reading', emoji: '📘', category: 'learning', difficulty: 2 },
  { id: 9, name: 'Cold Shower', emoji: '❄️', category: 'health', difficulty: 4 },
  { id: 10, name: 'Workout', emoji: '💻', category: 'health', difficulty: 3 }
];

// ============ Helper Functions ============
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDateFromKey = (dateKey) => {
  return new Date(dateKey);
};

const getDayOfWeek = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

const getShortDay = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const formatDisplayDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// ============ COMPONENT DEFINITIONS ============

// Header Component
const Header = ({ showAI, onToggleAI, currentDate, onDateChange, isToday, onTodayClick, showAllDates, onToggleViewAll }) => {
  const [isPast, setIsPast] = useState(false);
  
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(currentDate);
    compareDate.setHours(0, 0, 0, 0);
    setIsPast(compareDate < today);
  }, [currentDate]);

  return (
    <div style={{
      background: '#f8f9fa',
      padding: '12px 24px',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <div style={{ fontSize: '14px', color: '#5f6368', fontWeight: '500' }}>
        Habit Tracker Dashboard
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: 'white',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <button
            onClick={() => onDateChange(-1)}
            style={{
              background: '#4E73DF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              minWidth: '36px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#3b5ed9'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#4E73DF'}
          >
            ←
          </button>
          
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#2c3e50',
            minWidth: '200px',
            textAlign: 'center',
            padding: '0 12px'
          }}>
            <div>{formatDisplayDate(currentDate)}</div>
            <div style={{ 
              fontSize: '12px', 
              color: isToday ? '#10b981' : isPast ? '#6b7280' : '#f59e0b', 
              fontWeight: '600',
              marginTop: '2px'
            }}>
              {isToday ? '✓ Today (Editable)' : isPast ? '✗ Past Date (View Only)' : '→ Future Date (View Only)'}
            </div>
          </div>
          
          <button
            onClick={() => onDateChange(1)}
            style={{
              background: '#4E73DF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              minWidth: '36px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#3b5ed9'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#4E73DF'}
          >
            →
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onTodayClick}
            style={{
              padding: '6px 12px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#0da271'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
          >
            <span>📅</span> Today
          </button>
          
          <button
            onClick={onToggleViewAll}
            style={{
              padding: '6px 12px',
              background: showAllDates ? '#4E73DF' : '#e5e7eb',
              color: showAllDates ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{showAllDates ? '📊' : '📈'}</span>
            {showAllDates ? 'Daily View' : 'View All Dates'}
          </button>
          
          <button
            onClick={onToggleAI}
            style={{
              padding: '6px 12px',
              background: showAI ? '#8b5cf6' : '#e5e7eb',
              color: showAI ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>🤖</span>
            {showAI ? 'AI ON' : 'AI OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Circular Progress Component
const CircularProgress = ({ percentage, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e8eaf0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#4E73DF"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        style={{
          fontSize: '24px',
          fontWeight: '600',
          fill: '#2c3e50',
          transform: 'rotate(90deg)',
          transformOrigin: 'center'
        }}
      >
        {percentage}%
      </text>
    </svg>
  );
};

// Habit List Component
const HabitList = ({ habits }) => (
  <div style={{
    background: '#4E73DF',
    borderRadius: '12px',
    padding: '24px',
    color: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  }}>
    <h3 style={{
      margin: '0 0 20px 0',
      fontSize: '18px',
      fontWeight: '600'
    }}>My Habits</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {habits.map(habit => (
        <div key={habit.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          padding: '8px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '6px'
        }}>
          <span style={{ fontSize: '18px' }}>{habit.emoji}</span>
          <span>{habit.name}</span>
          <span style={{ 
            fontSize: '11px', 
            opacity: 0.8, 
            marginLeft: 'auto',
            background: 'rgba(255,255,255,0.2)',
            padding: '2px 6px',
            borderRadius: '10px'
          }}>
            {habit.category}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Weekly Tracker Component
const WeeklyTracker = ({ habits, currentDate, dayData, isToday, onToggle, dailyData }) => {
  const dateKey = formatDateKey(currentDate);
  const currentDayData = dayData || {};
  const isEditable = isToday;

  const completedCount = Object.values(currentDayData).filter(Boolean).length;
  const totalCount = habits.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div style={{
      background: '#F5F6FA',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'relative'
    }}>
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            margin: '0 0 4px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            {isEditable ? "Today's Habits" : `Habits for ${formatDisplayDate(currentDate)}`}
          </h3>
          <div style={{
            fontSize: '13px',
            color: '#6b7280'
          }}>
            Use ← → arrows in header to navigate dates • Click habits to toggle (today only)
          </div>
        </div>
        <div style={{
          fontSize: '13px',
          color: isEditable ? '#10b981' : '#6b7280',
          fontWeight: '600',
          background: isEditable ? '#d1fae5' : '#f3f4f6',
          padding: '6px 12px',
          borderRadius: '20px'
        }}>
          {isEditable ? '✓ Editable' : '✗ View Only'}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 1fr) 60px',
        gap: '12px',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: '600', fontSize: '14px', color: '#5f6368' }}>Habit</div>
        <div style={{ 
          fontWeight: '600', 
          fontSize: '13px', 
          color: '#5f6368', 
          textAlign: 'center' 
        }}>
          {getShortDay(currentDate)}
        </div>
        
        {habits.map(habit => (
          <React.Fragment key={habit.id}>
            <div style={{
              fontSize: '14px',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              background: 'white',
              borderRadius: '6px'
            }}>
              <span style={{ fontSize: '18px' }}>{habit.emoji}</span>
              <span>{habit.name}</span>
              <div style={{
                fontSize: '11px',
                padding: '2px 8px',
                background: '#e5e7eb',
                borderRadius: '10px',
                marginLeft: 'auto'
              }}>
                {habit.category}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                onClick={() => isEditable && onToggle(habit.id)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: currentDayData[habit.id] ? 'none' : '2px solid #d1d5db',
                  background: currentDayData[habit.id] ? '#10b981' : 'white',
                  borderRadius: '6px',
                  cursor: isEditable ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  opacity: isEditable ? 1 : 0.7
                }}
                title={isEditable ? 'Click to toggle' : `Cannot edit past/future dates`}
              >
                {currentDayData[habit.id] && (
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M13 4L6 11L3 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Completion Stats */}
      <div style={{
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '14px', color: '#5f6360' }}>
          {completedCount} of {totalCount} completed
        </div>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#4E73DF'
        }}>
          {percentage}%
        </div>
      </div>
    </div>
  );
};

// NEW: All Dates View Component
const AllDatesView = ({ dailyData, habits, onDateSelect }) => {
  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(dailyData).sort().reverse();
  
  if (sortedDates.length === 0) {
    return (
      <div style={{
        background: '#F5F6FA',
        borderRadius: '12px',
        padding: '40px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: '#2c3e50'
        }}>No Data Yet</h3>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
          Start tracking your habits today! Your history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#F5F6FA',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#2c3e50'
        }}>
          📅 All Tracked Dates ({sortedDates.length} days)
        </h3>
        <div style={{
          fontSize: '13px',
          color: '#6b7280',
          background: '#e5e7eb',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          Click any date to view details
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        maxHeight: '500px',
        overflowY: 'auto',
        padding: '10px'
      }}>
        {sortedDates.map(dateKey => {
          const date = getDateFromKey(dateKey);
          const dayData = dailyData[dateKey] || {};
          const completed = Object.values(dayData).filter(Boolean).length;
          const total = habits.length;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          const isToday = isSameDay(date, new Date());
          
          return (
            <div
              key={dateKey}
              onClick={() => onDateSelect(date)}
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: isToday ? '2px solid #10b981' : '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    {getDayOfWeek(date)}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                {isToday && (
                  <span style={{
                    fontSize: '10px',
                    color: '#10b981',
                    fontWeight: '600',
                    background: '#d1fae5',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}>
                    Today
                  </span>
                )}
              </div>
              
              <div style={{
                height: '6px',
                background: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: percentage > 70 ? '#10b981' : percentage > 40 ? '#f59e0b' : '#ef4444',
                  borderRadius: '3px'
                }} />
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <span>{completed}/{total} habits</span>
                <span style={{
                  fontWeight: '600',
                  color: percentage > 70 ? '#10b981' : percentage > 40 ? '#f59e0b' : '#ef4444'
                }}>
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ percentage }) => (
  <div style={{
    background: '#F5F6FA',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  }}>
    <h3 style={{
      margin: '0 0 16px 0',
      fontSize: '16px',
      fontWeight: '600',
      color: '#2c3e50'
    }}>Overall Progress</h3>
    <div style={{
      width: '100%',
      height: '32px',
      background: '#e8eaf0',
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        background: '#10b981',
        borderRadius: '16px',
        transition: 'width 0.3s ease'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '14px',
        fontWeight: '600',
        color: percentage > 50 ? 'white' : '#2c3e50'
      }}>
        {percentage.toFixed(1)}%
      </div>
    </div>
  </div>
);

// Analysis Table Component
const AnalysisTable = ({ data }) => (
  <div style={{
    background: '#F5F6FA',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  }}>
    <h3 style={{
      margin: '0 0 20px 0',
      fontSize: '16px',
      fontWeight: '600',
      color: '#2c3e50'
    }}>Analysis</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '100px 80px 1fr',
        gap: '16px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#5f6368',
        paddingBottom: '8px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div>Goal</div>
        <div>Actual</div>
        <div>Progress</div>
      </div>
      {data.map((item, index) => (
        <div key={index} style={{
          display: 'grid',
          gridTemplateColumns: '100px 80px 1fr',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#2c3e50' }}>{item.goal}</div>
          <div style={{ fontSize: '14px', color: '#2c3e50' }}>{item.actual}</div>
          <div style={{
            height: '24px',
            background: '#e8eaf0',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: `${(item.actual / item.goal) * 100}%`,
              height: '100%',
              background: '#10b981',
              borderRadius: '12px'
            }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============ MAIN APP COMPONENT ============
export default function App() {
  const [showAI, setShowAI] = useState(true);
  const [showAllDates, setShowAllDates] = useState(false);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyData, setDailyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Create sample data function
  const createSampleData = () => {
    const sampleData = {};
    const today = new Date();
    
    // Create data for the last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = formatDateKey(date);
      sampleData[dateKey] = {};
      
      initialHabits.forEach(habit => {
        // Realistic completion patterns
        let completionChance = 0.7;
        
        // Adjust by difficulty
        completionChance -= (habit.difficulty - 1) * 0.1;
        
        // Make weekends different
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
          completionChance += 0.1;
        }
        
        // Specific habit patterns
        if (habit.name.includes('Workout') && (dayOfWeek === 0 || dayOfWeek === 6)) {
          completionChance -= 0.3;
        }
        if (habit.name.includes('Wake Up') && (dayOfWeek === 0 || dayOfWeek === 6)) {
          completionChance -= 0.2;
        }
        if (habit.name.includes('Office Meeting') && (dayOfWeek === 0 || dayOfWeek === 6)) {
          completionChance = 0; // No office meetings on weekends
        }
        
        sampleData[dateKey][habit.id] = Math.random() < completionChance;
      });
    }
    
    return sampleData;
  };

  // Initialize Firebase with sample data if empty
  const initializeFirebase = async () => {
    try {
      const habitsRef = ref(database, 'habits');
      
      // Check if data exists
      onValue(habitsRef, (snapshot) => {
        const data = snapshot.val();
        
        if (!data && !initialized) {
          console.log('No data found in Firebase, creating sample data...');
          const sampleData = createSampleData();
          
          // Save sample data to Firebase
          set(habitsRef, sampleData).then(() => {
            console.log('Sample data created successfully');
            setInitialized(true);
            setDailyData(sampleData);
            setLoading(false);
          }).catch((error) => {
            console.error('Error saving sample data:', error);
            setLoading(false);
          });
        } else if (data) {
          console.log('Data loaded from Firebase');
          setDailyData(data);
          setLoading(false);
        }
      }, (error) => {
        console.error('Firebase error:', error);
        // If Firebase fails, use local sample data
        const sampleData = createSampleData();
        setDailyData(sampleData);
        setLoading(false);
      });
      
    } catch (error) {
      console.error('Initialization error:', error);
      // Fallback to local data
      const sampleData = createSampleData();
      setDailyData(sampleData);
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    initializeFirebase();
  }, []);

  // Save to Firebase
  const saveToFirebase = async (dateKey, habitId, completed) => {
    try {
      const habitRef = ref(database, `habits/${dateKey}/${habitId}`);
      await set(habitRef, completed);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  };

  const handleDateChange = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleDateSelect = (date) => {
    setCurrentDate(date);
    setShowAllDates(false);
  };

  const handleToggle = (habitId) => {
    const today = new Date();
    const isToday = isSameDay(currentDate, today);
    
    if (!isToday) {
      alert(`You can only edit habits for today (${formatDisplayDate(new Date())})!`);
      return;
    }

    const dateKey = formatDateKey(currentDate);
    const currentDayData = dailyData[dateKey] || {};
    const newCompleted = !currentDayData[habitId];
    
    // Update local state
    setDailyData(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [habitId]: newCompleted
      }
    }));

    // Save to Firebase
    saveToFirebase(dateKey, habitId, newCompleted);
  };

  const calculateOverallProgress = () => {
    if (Object.keys(dailyData).length === 0) return 0;
    
    let totalPossible = 0;
    let totalCompleted = 0;
    
    Object.values(dailyData).forEach(dayData => {
      initialHabits.forEach(habit => {
        totalPossible++;
        if (dayData[habit.id]) {
          totalCompleted++;
        }
      });
    });
    
    return totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
  };

  const getRecentDaysData = () => {
    const days = [];
    const today = new Date();
    
    // Get last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = formatDateKey(date);
      days.push({
        date,
        data: dailyData[dateKey] || {}
      });
    }
    
    return days;
  };

  const isToday = isSameDay(currentDate, new Date());
  const currentDateKey = formatDateKey(currentDate);
  const currentDayData = dailyData[currentDateKey] || {};

  const analysisData = [
    { goal: 70, actual: Math.round(calculateOverallProgress()) },
    { goal: initialHabits.length, actual: Object.values(currentDayData).filter(Boolean).length },
    { goal: 7, actual: Math.min(7, Object.keys(dailyData).length) }
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#4E73DF', marginBottom: '16px' }}>
            Initializing habit tracker...
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #4E73DF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <Header 
        showAI={showAI} 
        onToggleAI={() => setShowAI(!showAI)}
        currentDate={currentDate}
        onDateChange={handleDateChange}
        isToday={isToday}
        onTodayClick={handleTodayClick}
        onViewAllClick={() => setShowAllDates(true)}
        showAllDates={showAllDates}
        onToggleViewAll={() => setShowAllDates(!showAllDates)}
      />
      
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {showAllDates ? (
          // ALL DATES VIEW
          <AllDatesView 
            dailyData={dailyData}
            habits={initialHabits}
            onDateSelect={handleDateSelect}
          />
        ) : (
          // DAILY VIEW
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', marginBottom: '24px' }}>
              <HabitList habits={initialHabits} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <WeeklyTracker 
                  habits={initialHabits}
                  currentDate={currentDate}
                  dayData={currentDayData}
                  isToday={isToday}
                  onToggle={handleToggle}
                  dailyData={dailyData}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <ProgressBar percentage={calculateOverallProgress()} />
                  <AnalysisTable data={analysisData} />
                </div>
              </div>
            </div>

            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  margin: 0
                }}>
                  Last 7 Days Overview
                </h3>
                <button
                  onClick={() => setShowAllDates(true)}
                  style={{
                    padding: '6px 12px',
                    background: '#4E73DF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>📊</span> View All Dates ({Object.keys(dailyData).length})
                </button>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px'
              }}>
                {getRecentDaysData().map((day, index) => {
                  const completed = Object.values(day.data || {}).filter(Boolean).length;
                  const total = initialHabits.length;
                  const percentage = Math.round((completed / total) * 100);
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleDateSelect(day.date)}
                      style={{
                        background: '#F5F6FA',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: isSameDay(day.date, currentDate) ? '2px solid #4E73DF' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSameDay(day.date, currentDate)) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSameDay(day.date, currentDate)) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                        }
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#2c3e50',
                          marginBottom: '4px'
                        }}>
                          {getShortDay(day.date)}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#5f6368'
                        }}>
                          {day.date.getDate()}/{day.date.getMonth() + 1}
                        </div>
                      </div>
                      <CircularProgress percentage={percentage} size={100} strokeWidth={8} />
                      <div style={{
                        fontSize: '13px',
                        color: '#5f6368',
                        textAlign: 'center'
                      }}>
                        {completed} of {total} tasks completed
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}