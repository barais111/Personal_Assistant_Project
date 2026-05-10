// import React, { useState, useEffect, useRef } from 'react';
// import { BarChart3, TrendingUp, Plus, X, Edit2, Trash2, Calendar, Clock, AlertCircle, Bell, Volume2, VolumeX, Mic, Move, ChevronLeft, ChevronRight, Lock } from 'lucide-react';

// const CalendarView = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [events, setEvents] = useState([
//     { 
//       id: 1, 
//       title: 'Team Meeting', 
//       date: new Date(), 
//       time: '10:00', 
//       type: 'meeting', 
//       priority: 'high',
//       description: 'Quarterly planning session',
//       duration: 60,
//       reminder: true,
//       reminderTime: 15,
//       color: '#EF4444'
//     },
//     { 
//       id: 2, 
//       title: 'Project Review', 
//       date: new Date(), 
//       time: '11:30', 
//       type: 'meeting', 
//       priority: 'high',
//       description: 'Weekly project status',
//       duration: 90,
//       reminder: true,
//       reminderTime: 10,
//       color: '#EF4444'
//     },
//     { 
//       id: 3, 
//       title: 'Lunch Break', 
//       date: new Date(), 
//       time: '13:00', 
//       type: 'personal', 
//       priority: 'low',
//       description: 'Lunch with team',
//       duration: 60,
//       reminder: false,
//       reminderTime: 0,
//       color: '#10B981'
//     }
//   ]);
  
//   const [showEventForm, setShowEventForm] = useState(false);
//   const [editingEvent, setEditingEvent] = useState(null);
//   const [newEvent, setNewEvent] = useState({ 
//     title: '', 
//     time: '', 
//     type: 'meeting', 
//     priority: 'auto',
//     description: '',
//     duration: 60,
//     reminder: true,
//     reminderTime: 15,
//     language: 'en'
//   });
  
//   const [aiSuggestions, setAiSuggestions] = useState([]);
//   const [viewMode, setViewMode] = useState('calendar');
//   const [soundEnabled, setSoundEnabled] = useState(true);
//   const [activeReminders, setActiveReminders] = useState([]);
//   const [speechLanguage, setSpeechLanguage] = useState('en');
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [dragEvent, setDragEvent] = useState(null);
  
//   // Overlap management states
//   const [showOverlapResolver, setShowOverlapResolver] = useState(false);
//   const [conflictInfo, setConflictInfo] = useState({
//     newEvent: null,
//     overlappingEvents: [],
//     availableSlots: [],
//     dayEvents: [],
//     selectedSlot: null
//   });
  
//   const [tempEvents, setTempEvents] = useState([]);
//   const [isDragging, setIsDragging] = useState(false);
  
//   const speechSynthesisRef = useRef(null);
//   const dragOffset = useRef({ x: 0, y: 0 });
  
//   // Clean up speech synthesis
//   useEffect(() => {
//     return () => {
//       if (speechSynthesisRef.current) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, []);
  
//   // Check for overlaps
//   const checkEventOverlap = (event, existingEvents = events) => {
//     if (!event.time) return [];
    
//     const eventDate = event.date || selectedDate;
//     const [hours, minutes] = event.time.split(':');
//     const eventStart = new Date(eventDate);
//     eventStart.setHours(parseInt(hours), parseInt(minutes), 0, 0);
//     const eventEnd = new Date(eventStart.getTime() + event.duration * 60000);
    
//     const overlaps = [];
    
//     existingEvents.forEach(existingEvent => {
//       if (existingEvent.id === event.id) return;
      
//       if (existingEvent.date.toDateString() === eventDate.toDateString()) {
//         const [existingHours, existingMinutes] = existingEvent.time.split(':');
//         const existingStart = new Date(existingEvent.date);
//         existingStart.setHours(parseInt(existingHours), parseInt(existingMinutes), 0, 0);
//         const existingEnd = new Date(existingStart.getTime() + existingEvent.duration * 60000);
        
//         // Check for overlap
//         if (
//           (eventStart >= existingStart && eventStart < existingEnd) ||
//           (eventEnd > existingStart && eventEnd <= existingEnd) ||
//           (eventStart <= existingStart && eventEnd >= existingEnd)
//         ) {
//           overlaps.push(existingEvent);
//         }
//       }
//     });
    
//     return overlaps;
//   };
  
//   // Generate time slots for a day
//   const generateTimeSlots = () => {
//     const slots = [];
//     for (let hour = 7; hour <= 22; hour++) {
//       for (let minute = 0; minute < 60; minute += 30) {
//         const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
//         slots.push(time);
//       }
//     }
//     return slots;
//   };
  
//   // Get all events for selected date
//   const getDayEvents = () => {
//     return events.filter(event => 
//       event.date.toDateString() === selectedDate.toDateString()
//     );
//   };
  
//   // Find available time slots
//   const findAvailableSlots = (duration = 60) => {
//     const slots = [];
//     const timeSlots = generateTimeSlots();
//     const dayEvents = getDayEvents();
//     const now = new Date();
//     const isToday = selectedDate.toDateString() === now.toDateString();
    
//     timeSlots.forEach(slot => {
//       const [hours, minutes] = slot.split(':');
//       const slotTime = new Date(selectedDate);
//       slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
//       const slotEnd = new Date(slotTime.getTime() + duration * 60000);
      
//       // Check if slot is in past for today
//       if (isToday && slotTime < now) {
//         return;
//       }
      
//       // Check for overlaps with existing events
//       let hasOverlap = false;
//       let hasHighPriorityOverlap = false;
      
//       dayEvents.forEach(event => {
//         const [eventHours, eventMinutes] = event.time.split(':');
//         const eventStart = new Date(event.date);
//         eventStart.setHours(parseInt(eventHours), parseInt(eventMinutes), 0, 0);
//         const eventEnd = new Date(eventStart.getTime() + event.duration * 60000);
        
//         if (
//           (slotTime >= eventStart && slotTime < eventEnd) ||
//           (slotEnd > eventStart && slotEnd <= eventEnd) ||
//           (slotTime <= eventStart && slotEnd >= eventEnd)
//         ) {
//           hasOverlap = true;
//           if (event.priority === 'high') {
//             hasHighPriorityOverlap = true;
//           }
//         }
//       });
      
//       if (!hasOverlap) {
//         slots.push({
//           time: slot,
//           formatted: formatTimeForDisplay(slot),
//           isAvailable: true,
//           hasHighPriorityConflict: false,
//           isPast: isToday && slotTime < now
//         });
//       } else if (!hasHighPriorityOverlap) {
//         slots.push({
//           time: slot,
//           formatted: formatTimeForDisplay(slot),
//           isAvailable: false,
//           hasHighPriorityConflict: false,
//           isPast: isToday && slotTime < now,
//           reason: 'Occupied by medium/low priority'
//         });
//       }
//     });
    
//     return slots.slice(0, 24); // Limit slots for display
//   };
  
//   // Handle adding new event
//   const handleAddEvent = () => {
//     if (!newEvent.title || !newEvent.time) {
//       alert('Please fill in all required fields');
//       return;
//     }
    
//     const eventData = {
//       ...newEvent,
//       date: selectedDate,
//       id: editingEvent ? editingEvent.id : Date.now(),
//       color: getPriorityColorHex(newEvent.priority === 'auto' ? assignPriority(newEvent) : newEvent.priority)
//     };
    
//     // Check for overlaps
//     const overlaps = checkEventOverlap(eventData);
    
//     if (overlaps.length === 0) {
//       // No overlap, add directly
//       proceedWithEventAddition(eventData);
//     } else {
//       // Has overlap, show resolver
//       const hasHighPriorityConflict = overlaps.some(e => e.priority === 'high');
//       const availableSlots = findAvailableSlots(newEvent.duration);
      
//       // Start with current day events
//       const dayEvents = getDayEvents();
      
//       // Create temporary events including the new one
//       const tempEventsList = [...dayEvents];
//       if (!editingEvent) {
//         tempEventsList.push({
//           ...eventData,
//           priority: eventData.priority === 'auto' ? assignPriority(eventData) : eventData.priority,
//           isNew: true
//         });
//       }
      
//       setConflictInfo({
//         newEvent: eventData,
//         overlappingEvents: overlaps,
//         availableSlots: availableSlots,
//         dayEvents: tempEventsList,
//         selectedSlot: null,
//         hasHighPriorityConflict
//       });
      
//       setTempEvents(tempEventsList);
//       setShowOverlapResolver(true);
//     }
//   };
  
//   // Proceed with event addition
//   const proceedWithEventAddition = (eventData) => {
//     const priority = eventData.priority === 'auto' ? assignPriority(eventData) : eventData.priority;
    
//     const finalEvent = {
//       ...eventData,
//       priority,
//       color: getPriorityColorHex(priority)
//     };
    
//     if (editingEvent) {
//       setEvents(events.map(e => e.id === editingEvent.id ? finalEvent : e));
//     } else {
//       setEvents([...events, finalEvent]);
//     }
    
//     resetEventForm();
//   };
  
//   // Handle overlap resolution - adjust new event time
//   const handleAdjustNewEventTime = () => {
//     if (!conflictInfo.selectedSlot) {
//       alert('Please select an available time slot');
//       return;
//     }
    
//     const updatedEvent = {
//       ...conflictInfo.newEvent,
//       time: conflictInfo.selectedSlot.time
//     };
    
//     // Check again for overlaps
//     const newOverlaps = checkEventOverlap(updatedEvent);
    
//     if (newOverlaps.length === 0) {
//       proceedWithEventAddition(updatedEvent);
//       setShowOverlapResolver(false);
//       setConflictInfo({
//         newEvent: null,
//         overlappingEvents: [],
//         availableSlots: [],
//         dayEvents: [],
//         selectedSlot: null
//       });
//     } else {
//       alert('Selected time still has conflicts. Please choose another slot.');
//     }
//   };
  
//   // Reset form
//   const resetEventForm = () => {
//     setNewEvent({ title: '', time: '', type: 'meeting', priority: 'auto', description: '', duration: 60, reminder: true, reminderTime: 15, language: 'en' });
//     setShowEventForm(false);
//     setEditingEvent(null);
//   };
  
//   // Edit event
//   const editEvent = (event) => {
//     setNewEvent({
//       title: event.title,
//       time: event.time,
//       type: event.type,
//       priority: event.priority,
//       description: event.description || '',
//       duration: event.duration || 60,
//       reminder: event.reminder !== undefined ? event.reminder : true,
//       reminderTime: event.reminderTime || 15,
//       language: event.language || 'en'
//     });
//     setEditingEvent(event);
//     setShowEventForm(true);
//   };
  
//   // Delete event
//   const deleteEvent = (id) => {
//     setEvents(events.filter(event => event.id !== id));
//   };
  
//   // AI Priority Assignment
//   const assignPriority = (event) => {
//     if (event.priority !== 'auto') return event.priority;
    
//     const title = event.title.toLowerCase();
//     const description = event.description.toLowerCase();
//     const type = event.type;
//     const time = event.time;
    
//     const highPriorityKeywords = ['urgent', 'important', 'deadline', 'meeting', 'presentation', 'interview', 'client'];
//     const mediumPriorityKeywords = ['appointment', 'checkup', 'review', 'call', 'discussion', 'follow-up'];
    
//     for (let keyword of highPriorityKeywords) {
//       if (title.includes(keyword) || description.includes(keyword)) {
//         return 'high';
//       }
//     }
    
//     for (let keyword of mediumPriorityKeywords) {
//       if (title.includes(keyword) || description.includes(keyword)) {
//         return 'medium';
//       }
//     }
    
//     if (type === 'meeting') return 'high';
//     if (type === 'appointment') return 'medium';
    
//     return 'low';
//   };
  
//   // Text-to-speech
//   const speakText = (text, lang = 'en') => {
//     if (!soundEnabled) return;
    
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
      
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      
//       utterance.onstart = () => setIsSpeaking(true);
//       utterance.onend = () => setIsSpeaking(false);
//       utterance.onerror = () => setIsSpeaking(false);
      
//       window.speechSynthesis.speak(utterance);
//       speechSynthesisRef.current = utterance;
//     }
//   };
  
//   // Drag and drop handlers
//   const handleDragStart = (e, event) => {
//     if (event.priority === 'high') return;
    
//     setIsDragging(true);
//     setDragEvent(event);
//     dragOffset.current = {
//       x: e.clientX - e.target.getBoundingClientRect().left,
//       y: e.clientY - e.target.getBoundingClientRect().top
//     };
    
//     // Create a ghost image
//     e.dataTransfer.setDragImage(e.target, dragOffset.current.x, dragOffset.current.y);
//   };
  
//   const handleDragEnd = () => {
//     setIsDragging(false);
//     setDragEvent(null);
//   };
  
//   const handleDrop = (e, slot) => {
//     e.preventDefault();
    
//     if (!dragEvent || dragEvent.priority === 'high') return;
    
//     // Update the event time
//     const updatedEvents = tempEvents.map(event => {
//       if (event.id === dragEvent.id) {
//         return {
//           ...event,
//           time: slot.time
//         };
//       }
//       return event;
//     });
    
//     setTempEvents(updatedEvents);
//     setConflictInfo(prev => ({
//       ...prev,
//       dayEvents: updatedEvents
//     }));
//   };
  
//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };
  
//   // Save rearranged schedule
//   const saveRearrangedSchedule = () => {
//     // Update events with new arrangement
//     const updatedMainEvents = [...events];
    
//     tempEvents.forEach(tempEvent => {
//       const index = updatedMainEvents.findIndex(e => e.id === tempEvent.id);
//       if (index !== -1) {
//         // Update existing event
//         updatedMainEvents[index] = tempEvent;
//       } else if (tempEvent.isNew) {
//         // Add new event
//         const finalEvent = {
//           ...tempEvent,
//           id: Date.now(),
//           priority: assignPriority(tempEvent),
//           color: getPriorityColorHex(assignPriority(tempEvent))
//         };
//         updatedMainEvents.push(finalEvent);
//       }
//     });
    
//     setEvents(updatedMainEvents);
//     setShowOverlapResolver(false);
//     resetEventForm();
//     setTempEvents([]);
//   };
  
//   // Format time for display
//   const formatTimeForDisplay = (time24h) => {
//     const [hours, minutes] = time24h.split(':');
//     const hour = parseInt(hours);
//     const period = hour >= 12 ? 'PM' : 'AM';
//     const hour12 = hour % 12 || 12;
//     return `${hour12}:${minutes} ${period}`;
//   };
  
//   // Get priority color
//   const getPriorityColorHex = (priority) => {
//     switch (priority) {
//       case 'high': return '#EF4444';
//       case 'medium': return '#F59E0B';
//       case 'low': return '#10B981';
//       default: return '#6B7280';
//     }
//   };
  
//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'bg-red-500';
//       case 'medium': return 'bg-yellow-500';
//       case 'low': return 'bg-green-500';
//       default: return 'bg-gray-500';
//     }
//   };
  
//   const getTypeColor = (type) => {
//     switch (type) {
//       case 'meeting': return 'bg-blue-500';
//       case 'appointment': return 'bg-green-500';
//       case 'personal': return 'bg-purple-500';
//       default: return 'bg-gray-500';
//     }
//   };
  
//   // Generate calendar days
//   const getDaysInMonth = () => {
//     const year = selectedDate.getFullYear();
//     const month = selectedDate.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();

//     const days = [];
    
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
    
//     for (let day = 1; day <= daysInMonth; day++) {
//       days.push(new Date(year, month, day));
//     }
    
//     return days;
//   };
  
//   // Get events for date
//   const getEventsForDate = (date) => {
//     if (!date) return [];
//     return events.filter(event => 
//       event.date.toDateString() === date.toDateString()
//     );
//   };
  
//   // Check for reminders
//   useEffect(() => {
//     const checkReminders = () => {
//       const now = new Date();
//       const newReminders = [];
      
//       events.forEach(event => {
//         if (event.reminder) {
//           const eventTime = new Date(event.date);
//           const [hours, minutes] = event.time.split(':');
//           eventTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
//           const reminderTime = new Date(eventTime.getTime() - event.reminderTime * 60000);
          
//           if (now >= reminderTime && now < eventTime) {
//             if (!activeReminders.find(r => r.id === event.id)) {
//               newReminders.push({
//                 id: event.id,
//                 title: event.title,
//                 time: event.time,
//                 message: `Reminder: ${event.title} is starting in ${event.reminderTime} minutes`
//               });
              
//               if (soundEnabled) {
//                 speakText(newReminders[newReminders.length - 1].message, speechLanguage);
//               }
//             }
//           }
//         }
//       });
      
//       if (newReminders.length > 0) {
//         setActiveReminders([...activeReminders, ...newReminders]);
//       }
//     };
    
//     const interval = setInterval(checkReminders, 30000);
//     checkReminders();
    
//     return () => clearInterval(interval);
//   }, [events, activeReminders, soundEnabled, speechLanguage]);
  
//   // Generate AI suggestions
//   useEffect(() => {
//     const generateSuggestions = () => {
//       const suggestions = [];
      
//       events.forEach(event => {
//         const eventTime = new Date(event.date);
//         const [hours, minutes] = event.time.split(':');
//         eventTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
//         const eventEndTime = new Date(eventTime.getTime() + event.duration * 60000);
        
//         events.forEach(otherEvent => {
//           if (event.id !== otherEvent.id && event.date.toDateString() === otherEvent.date.toDateString()) {
//             const otherEventTime = new Date(otherEvent.date);
//             const [otherHours, otherMinutes] = otherEvent.time.split(':');
//             otherEventTime.setHours(parseInt(otherHours), parseInt(otherMinutes), 0, 0);
//             const otherEventEndTime = new Date(otherEventTime.getTime() + otherEvent.duration * 60000);
            
//             if (
//               (eventTime >= otherEventTime && eventTime < otherEventEndTime) ||
//               (eventEndTime > otherEventTime && eventEndTime <= otherEventEndTime) ||
//               (eventTime <= otherEventTime && eventEndTime >= otherEventEndTime)
//             ) {
//               suggestions.push({
//                 type: 'conflict',
//                 message: `Conflict between "${event.title}" and "${otherEvent.title}"`,
//                 events: [event.id, otherEvent.id]
//               });
//             }
//           }
//         });
//       });
      
//       setAiSuggestions(suggestions);
//     };
    
//     generateSuggestions();
//   }, [events]);

//   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Active Reminders */}
//         {activeReminders.length > 0 && (
//           <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4 shadow-lg">
//             <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
//               <Bell className="w-5 h-5" />
//               Reminders
//             </h3>
//             <div className="space-y-2">
//               {activeReminders.map((reminder, index) => (
//                 <div key={index} className="flex justify-between items-start p-3 bg-yellow-50 rounded-lg">
//                   <div>
//                     <p className="text-yellow-800 font-medium">{reminder.message}</p>
//                     <p className="text-sm text-yellow-600">Scheduled for {formatTimeForDisplay(reminder.time)}</p>
//                   </div>
//                   <button
//                     onClick={() => setActiveReminders(activeReminders.filter(r => r.id !== reminder.id))}
//                     className="text-yellow-700 hover:text-yellow-900"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Smart Calendar
//           </h1>
//           <div className="flex gap-4">
//             <button
//               onClick={() => setSoundEnabled(!soundEnabled)}
//               className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
//             >
//               {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
//               {soundEnabled ? 'Sound On' : 'Sound Off'}
//             </button>
//             <button
//               onClick={() => setShowEventForm(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
//             >
//               <Plus className="w-4 h-4" />
//               Add Event
//             </button>
//           </div>
//         </div>

//         {/* AI Suggestions */}
//         {aiSuggestions.length > 0 && (
//           <div className="mb-6 bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/50">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
//               <TrendingUp className="w-5 h-5" />
//               AI Suggestions
//             </h3>
//             <div className="space-y-2">
//               {aiSuggestions.map((suggestion, index) => (
//                 <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
//                   <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
//                   <p className="text-sm text-yellow-800">{suggestion.message}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Calendar View */}
//         <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
//           {/* Calendar Grid */}
//           <div className="xl:col-span-3 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
//             <div className="flex justify-between items-center mb-6">
//               <button
//                 onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
//                 className="p-2 hover:bg-white/50 rounded-lg transition-colors"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <h2 className="text-2xl font-semibold text-gray-800">
//                 {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
//               </h2>
//               <button
//                 onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
//                 className="p-2 hover:bg-white/50 rounded-lg transition-colors"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="grid grid-cols-7 gap-2 mb-4">
//               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                 <div key={day} className="text-center font-semibold text-gray-600 p-2">
//                   {day}
//                 </div>
//               ))}
//             </div>

//             <div className="grid grid-cols-7 gap-2">
//               {getDaysInMonth().map((date, index) => (
//                 <div
//                   key={index}
//                   className={`min-h-24 p-2 border rounded-lg cursor-pointer transition-all ${
//                     date 
//                       ? 'bg-white/50 hover:bg-white/80 border-gray-200' 
//                       : 'bg-transparent'
//                   } ${
//                     date && date.toDateString() === new Date().toDateString()
//                       ? 'ring-2 ring-blue-500 bg-blue-50'
//                       : ''
//                   }`}
//                   onClick={() => date && setSelectedDate(date)}
//                 >
//                   {date && (
//                     <>
//                       <div className="font-semibold text-gray-800 flex justify-between">
//                         <span>{date.getDate()}</span>
//                         {getEventsForDate(date).length > 0 && (
//                           <span className={`w-2 h-2 rounded-full ${getPriorityColor(getEventsForDate(date)[0].priority)}`}></span>
//                         )}
//                       </div>
//                       <div className="space-y-1 mt-1">
//                         {getEventsForDate(date).slice(0, 2).map(event => (
//                           <div
//                             key={event.id}
//                             className={`text-xs p-1 rounded text-white truncate ${getTypeColor(event.type)}`}
//                           >
//                             {event.title}
//                           </div>
//                         ))}
//                         {getEventsForDate(date).length > 2 && (
//                           <div className="text-xs text-gray-500">
//                             +{getEventsForDate(date).length - 2} more
//                           </div>
//                         )}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Events Sidebar */}
//           <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">
//               {selectedDate.toDateString()}
//             </h3>
//             <div className="space-y-3">
//               {getEventsForDate(selectedDate).map(event => (
//                 <div key={event.id} className="p-3 bg-white/50 rounded-lg border-l-4" style={{ borderLeftColor: getPriorityColorHex(event.priority) }}>
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <h4 className="font-medium text-gray-800">{event.title}</h4>
//                         <span className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`}></span>
//                         {event.priority === 'high' && <Lock className="w-3 h-3 text-red-500" />}
//                       </div>
//                       <p className="text-sm text-gray-600 flex items-center gap-1">
//                         <Clock className="w-3 h-3" />
//                         {formatTimeForDisplay(event.time)} ({event.duration} mins)
//                       </p>
//                       <div className="flex items-center gap-2 mt-2">
//                         <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
//                           {event.type}
//                         </span>
//                         <span className={`text-xs px-2 py-1 rounded ${
//                           event.priority === 'high' ? 'bg-red-100 text-red-800' :
//                           event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-green-100 text-green-800'
//                         }`}>
//                           {event.priority} priority
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex gap-1">
//                       <button
//                         onClick={() => editEvent(event)}
//                         className="text-blue-500 hover:text-blue-700 transition-colors"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => deleteEvent(event.id)}
//                         className="text-red-500 hover:text-red-700 transition-colors"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {getEventsForDate(selectedDate).length === 0 && (
//                 <p className="text-gray-500 text-center py-8">No events for this day</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Event Creation Form */}
//         {showEventForm && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-slideUp">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold">
//                   {editingEvent ? 'Edit Event' : 'Add New Event'}
//                 </h3>
//                 <button
//                   onClick={resetEventForm}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter event title"
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={newEvent.title}
//                     onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
//                   <input
//                     type="time"
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={newEvent.time}
//                     onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
//                     min={selectedDate.toDateString() === new Date().toDateString() ? 
//                       new Date().getHours().toString().padStart(2, '0') + ':' + 
//                       new Date().getMinutes().toString().padStart(2, '0') : '00:00'}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
//                   <input
//                     type="number"
//                     min="15"
//                     max="480"
//                     step="15"
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={newEvent.duration}
//                     onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value) || 60})}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
//                   <select
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={newEvent.priority}
//                     onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
//                   >
//                     <option value="auto">Auto (AI Determined)</option>
//                     <option value="high">High</option>
//                     <option value="medium">Medium</option>
//                     <option value="low">Low</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
//                   <select
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={newEvent.type}
//                     onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
//                   >
//                     <option value="meeting">Meeting</option>
//                     <option value="appointment">Appointment</option>
//                     <option value="personal">Personal</option>
//                   </select>
//                 </div>
                
//                 <div className="flex gap-2 pt-4">
//                   <button
//                     onClick={handleAddEvent}
//                     className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
//                   >
//                     {editingEvent ? 'Update Event' : 'Add Event'}
//                   </button>
//                   <button
//                     onClick={resetEventForm}
//                     className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Overlap Resolver Popup */}
//         {showOverlapResolver && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                     <AlertCircle className="w-6 h-6 text-red-500" />
//                     Schedule Conflict Detected
//                   </h3>
//                   <p className="text-gray-600 mt-1">
//                     Your event conflicts with existing tasks. Please rearrange your schedule.
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowOverlapResolver(false);
//                     setTempEvents([]);
//                   }}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
//                 {/* Left: Conflict Details */}
//                 <div className="space-y-4">
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                     <h4 className="font-semibold text-red-800 mb-2">Conflict Details</h4>
//                     <div className="space-y-2">
//                       <div className="bg-white p-3 rounded border">
//                         <div className="font-medium">{conflictInfo.newEvent?.title}</div>
//                         <div className="text-sm text-gray-600">
//                           {formatTimeForDisplay(conflictInfo.newEvent?.time)} - {conflictInfo.newEvent?.duration} minutes
//                         </div>
//                       </div>
                      
//                       {conflictInfo.overlappingEvents.map((event, index) => (
//                         <div key={index} className="bg-white p-3 rounded border flex items-center justify-between">
//                           <div>
//                             <div className="font-medium flex items-center gap-2">
//                               {event.title}
//                               {event.priority === 'high' && <Lock className="w-3 h-3 text-red-500" />}
//                             </div>
//                             <div className="text-sm text-gray-600">
//                               {formatTimeForDisplay(event.time)} - {event.duration} minutes
//                             </div>
//                           </div>
//                           <span className={`px-2 py-1 text-xs rounded ${
//                             event.priority === 'high' ? 'bg-red-100 text-red-800' :
//                             event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                             'bg-green-100 text-green-800'
//                           }`}>
//                             {event.priority} priority
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {/* Available Slots */}
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <h4 className="font-semibold text-blue-800 mb-2">Available Time Slots</h4>
//                     <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
//                       {conflictInfo.availableSlots.filter(slot => slot.isAvailable).map((slot, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setConflictInfo(prev => ({ ...prev, selectedSlot: slot }))}
//                           className={`p-3 rounded-lg border transition-all ${
//                             conflictInfo.selectedSlot?.time === slot.time
//                               ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300'
//                               : 'bg-white border-gray-200 hover:bg-blue-50'
//                           }`}
//                         >
//                           <div className="font-medium">{slot.formatted}</div>
//                           <div className="text-sm text-gray-600">Available</div>
//                         </button>
//                       ))}
//                     </div>
                    
//                     {conflictInfo.selectedSlot && (
//                       <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
//                         <div className="font-medium text-green-800">Selected Slot</div>
//                         <div className="text-green-700">
//                           {conflictInfo.selectedSlot.formatted}
//                         </div>
//                         <button
//                           onClick={handleAdjustNewEventTime}
//                           className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
//                         >
//                           Move Event to {conflictInfo.selectedSlot.formatted}
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Center: Day Schedule */}
//                 <div className="col-span-2 border rounded-lg overflow-hidden flex flex-col">
//                   <div className="bg-gray-50 p-4 border-b">
//                     <h4 className="font-semibold text-gray-800">
//                       Day Schedule: {selectedDate.toDateString()}
//                     </h4>
//                     <p className="text-sm text-gray-600 mt-1">
//                       Drag and drop medium/low priority events to rearrange. High priority events are fixed.
//                     </p>
//                   </div>
                  
//                   <div className="flex-1 overflow-y-auto p-4">
//                     {/* Time Grid */}
//                     <div className="space-y-1">
//                       {generateTimeSlots().map((slot, index) => {
//                         const slotTime = new Date(selectedDate);
//                         const [hours, minutes] = slot.split(':');
//                         slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
//                         const isPast = selectedDate.toDateString() === new Date().toDateString() && slotTime < new Date();
//                         const eventAtSlot = tempEvents.find(event => event.time === slot);
                        
//                         return (
//                           <div
//                             key={index}
//                             className={`relative h-16 border-b border-gray-200 flex items-center px-4 transition-all ${
//                               isPast ? 'bg-gray-100 opacity-50' : 'bg-white hover:bg-blue-50'
//                             }`}
//                             onDragOver={handleDragOver}
//                             onDrop={(e) => handleDrop(e, { time: slot })}
//                           >
//                             <div className="w-24 text-sm font-medium text-gray-600">
//                               {formatTimeForDisplay(slot)}
//                             </div>
                            
//                             <div className="flex-1 h-full flex items-center">
//                               {eventAtSlot ? (
//                                 <div
//                                   draggable={eventAtSlot.priority !== 'high'}
//                                   onDragStart={(e) => handleDragStart(e, eventAtSlot)}
//                                   onDragEnd={handleDragEnd}
//                                   className={`p-3 rounded-lg w-full transition-all duration-200 ${
//                                     eventAtSlot.priority === 'high' 
//                                       ? 'cursor-not-allowed opacity-90' 
//                                       : 'cursor-move hover:scale-[1.02]'
//                                   } ${eventAtSlot.isNew ? 'ring-2 ring-blue-300' : ''}`}
//                                   style={{
//                                     backgroundColor: eventAtSlot.isNew ? '#DBEAFE' : `${getPriorityColorHex(eventAtSlot.priority)}20`,
//                                     borderLeft: `4px solid ${getPriorityColorHex(eventAtSlot.priority)}`
//                                   }}
//                                 >
//                                   <div className="flex justify-between items-center">
//                                     <div>
//                                       <div className="font-medium flex items-center gap-2">
//                                         {eventAtSlot.title}
//                                         {eventAtSlot.isNew && (
//                                           <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">New</span>
//                                         )}
//                                       </div>
//                                       <div className="text-sm text-gray-600">
//                                         {eventAtSlot.duration} minutes
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                       <span className={`px-2 py-1 text-xs rounded ${
//                                         eventAtSlot.priority === 'high' ? 'bg-red-100 text-red-800' :
//                                         eventAtSlot.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                                         'bg-green-100 text-green-800'
//                                       }`}>
//                                         {eventAtSlot.priority}
//                                       </span>
//                                       {eventAtSlot.priority !== 'high' && (
//                                         <Move className="w-4 h-4 text-gray-500" />
//                                       )}
//                                       {eventAtSlot.priority === 'high' && (
//                                         <Lock className="w-4 h-4 text-red-500" />
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <div className="text-gray-400 text-sm">
//                                   {isPast ? 'Past time' : 'Empty slot'}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
                  
//                   {/* Action Buttons */}
//                   <div className="border-t p-4 bg-gray-50">
//                     <div className="flex gap-3">
//                       <button
//                         onClick={saveRearrangedSchedule}
//                         className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
//                       >
//                         Save Rearranged Schedule
//                       </button>
//                       <button
//                         onClick={() => {
//                           setShowOverlapResolver(false);
//                           setTempEvents([]);
//                         }}
//                         className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* CSS Animations */}
//       <style jsx>{`
//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slideUp {
//           animation: slideUp 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CalendarView;


import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, Plus, X, Edit2, Trash2, Calendar, Clock, AlertCircle, Bell, Volume2, VolumeX, Mic, Move, ChevronLeft, ChevronRight, Lock } from 'lucide-react';

const CalendarView = ({ events, setEvents }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
 
  
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    time: '', 
    type: 'meeting', 
    priority: 'auto',
    description: '',
    duration: 60,
    reminder: true,
    reminderTime: 15,
    language: 'en'
  });
  
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [viewMode, setViewMode] = useState('calendar');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeReminders, setActiveReminders] = useState([]);
  const [speechLanguage, setSpeechLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dragEvent, setDragEvent] = useState(null);
  
  // Overlap management states
  const [showOverlapResolver, setShowOverlapResolver] = useState(false);
  const [conflictInfo, setConflictInfo] = useState({
    newEvent: null,
    overlappingEvents: [],
    availableSlots: [],
    dayEvents: [],
    selectedSlot: null
  });
  
  const [tempEvents, setTempEvents] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const speechSynthesisRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  // Clean up speech synthesis
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Check for overlaps
  const checkEventOverlap = (event, existingEvents = events) => {
    if (!event.time) return [];
    
    const eventDate = event.date || selectedDate;
    const [hours, minutes] = event.time.split(':');
    const eventStart = new Date(eventDate);
    eventStart.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const eventEnd = new Date(eventStart.getTime() + event.duration * 60000);
    
    const overlaps = [];
    
    existingEvents.forEach(existingEvent => {
      if (existingEvent.id === event.id) return;
      
      if (existingEvent.date.toDateString() === eventDate.toDateString()) {
        const [existingHours, existingMinutes] = existingEvent.time.split(':');
        const existingStart = new Date(existingEvent.date);
        existingStart.setHours(parseInt(existingHours), parseInt(existingMinutes), 0, 0);
        const existingEnd = new Date(existingStart.getTime() + existingEvent.duration * 60000);
        
        // Check for overlap
        if (
          (eventStart >= existingStart && eventStart < existingEnd) ||
          (eventEnd > existingStart && eventEnd <= existingEnd) ||
          (eventStart <= existingStart && eventEnd >= existingEnd)
        ) {
          overlaps.push(existingEvent);
        }
      }
    });
    
    return overlaps;
  };
  
  // Generate time slots for a day
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };
  
  // Get all events for selected date
  const getDayEvents = () => {
    return events.filter(event => 
      event.date.toDateString() === selectedDate.toDateString()
    );
  };
  
  // Find available time slots
  const findAvailableSlots = (duration = 60) => {
    const slots = [];
    const timeSlots = generateTimeSlots();
    const dayEvents = getDayEvents();
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    
    timeSlots.forEach(slot => {
      const [hours, minutes] = slot.split(':');
      const slotTime = new Date(selectedDate);
      slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const slotEnd = new Date(slotTime.getTime() + duration * 60000);
      
      // Check if slot is in past for today
      if (isToday && slotTime < now) {
        return;
      }
      
      // Check for overlaps with existing events
      let hasOverlap = false;
      let hasHighPriorityOverlap = false;
      
      dayEvents.forEach(event => {
        const [eventHours, eventMinutes] = event.time.split(':');
        const eventStart = new Date(event.date);
        eventStart.setHours(parseInt(eventHours), parseInt(eventMinutes), 0, 0);
        const eventEnd = new Date(eventStart.getTime() + event.duration * 60000);
        
        if (
          (slotTime >= eventStart && slotTime < eventEnd) ||
          (slotEnd > eventStart && slotEnd <= eventEnd) ||
          (slotTime <= eventStart && slotEnd >= eventEnd)
        ) {
          hasOverlap = true;
          if (event.priority === 'high') {
            hasHighPriorityOverlap = true;
          }
        }
      });
      
      if (!hasOverlap) {
        slots.push({
          time: slot,
          formatted: formatTimeForDisplay(slot),
          isAvailable: true,
          hasHighPriorityConflict: false,
          isPast: isToday && slotTime < now
        });
      } else if (!hasHighPriorityOverlap) {
        slots.push({
          time: slot,
          formatted: formatTimeForDisplay(slot),
          isAvailable: false,
          hasHighPriorityConflict: false,
          isPast: isToday && slotTime < now,
          reason: 'Occupied by medium/low priority'
        });
      }
    });
    
    return slots.slice(0, 24); // Limit slots for display
  };
  
  // Handle adding new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) {
      alert('Please fill in all required fields');
      return;
    }
    
    const eventData = {
      ...newEvent,
      date: selectedDate,
      id: editingEvent ? editingEvent.id : Date.now(),
      color: getPriorityColorHex(newEvent.priority === 'auto' ? assignPriority(newEvent) : newEvent.priority)
    };
    
    // Check for overlaps
    const overlaps = checkEventOverlap(eventData);
    
    if (overlaps.length === 0) {
      // No overlap, add directly
      proceedWithEventAddition(eventData);
    } else {
      // Has overlap, show resolver
      const hasHighPriorityConflict = overlaps.some(e => e.priority === 'high');
      const availableSlots = findAvailableSlots(newEvent.duration);
      
      // Start with current day events
      const dayEvents = getDayEvents();
      
      // Create temporary events including the new one
      const tempEventsList = [...dayEvents];
      if (!editingEvent) {
        tempEventsList.push({
          ...eventData,
          priority: eventData.priority === 'auto' ? assignPriority(eventData) : eventData.priority,
          isNew: true
        });
      }
      
      setConflictInfo({
        newEvent: eventData,
        overlappingEvents: overlaps,
        availableSlots: availableSlots,
        dayEvents: tempEventsList,
        selectedSlot: null,
        hasHighPriorityConflict
      });
      
      setTempEvents(tempEventsList);
      setShowOverlapResolver(true);
    }
  };
  
  // Proceed with event addition
  const proceedWithEventAddition = (eventData) => {
    const priority = eventData.priority === 'auto' ? assignPriority(eventData) : eventData.priority;
    
    const finalEvent = {
      ...eventData,
      priority,
      color: getPriorityColorHex(priority)
    };
    
    if (editingEvent) {
    setEvents(events.map(e => e.id === editingEvent.id ? finalEvent : e));
  } else {
    setEvents([...events, finalEvent]);
  }
    
    resetEventForm();
  };
  
  // Handle overlap resolution - adjust new event time
  const handleAdjustNewEventTime = () => {
    if (!conflictInfo.selectedSlot) {
      alert('Please select an available time slot');
      return;
    }
    
    const updatedEvent = {
      ...conflictInfo.newEvent,
      time: conflictInfo.selectedSlot.time
    };
    
    // Check again for overlaps
    const newOverlaps = checkEventOverlap(updatedEvent);
    
    if (newOverlaps.length === 0) {
      proceedWithEventAddition(updatedEvent);
      setShowOverlapResolver(false);
      setConflictInfo({
        newEvent: null,
        overlappingEvents: [],
        availableSlots: [],
        dayEvents: [],
        selectedSlot: null
      });
    } else {
      alert('Selected time still has conflicts. Please choose another slot.');
    }
  };
  
  // Reset form
  const resetEventForm = () => {
    setNewEvent({ title: '', time: '', type: 'meeting', priority: 'auto', description: '', duration: 60, reminder: true, reminderTime: 15, language: 'en' });
    setShowEventForm(false);
    setEditingEvent(null);
  };
  
  // Edit event
  const editEvent = (event) => {
    setNewEvent({
      title: event.title,
      time: event.time,
      type: event.type,
      priority: event.priority,
      description: event.description || '',
      duration: event.duration || 60,
      reminder: event.reminder !== undefined ? event.reminder : true,
      reminderTime: event.reminderTime || 15,
      language: event.language || 'en'
    });
    setEditingEvent(event);
    setShowEventForm(true);
  };
  
  // Delete event
const deleteEvent = (id) => {
  setEvents(events.filter(event => event.id !== id));   // ✅ now uses prop setEvents
};
  
  // AI Priority Assignment
  const assignPriority = (event) => {
    if (event.priority !== 'auto') return event.priority;
    
    const title = event.title.toLowerCase();
    const description = event.description.toLowerCase();
    const type = event.type;
    const time = event.time;
    
    const highPriorityKeywords = ['urgent', 'important', 'deadline', 'meeting', 'presentation', 'interview', 'client'];
    const mediumPriorityKeywords = ['appointment', 'checkup', 'review', 'call', 'discussion', 'follow-up'];
    
    for (let keyword of highPriorityKeywords) {
      if (title.includes(keyword) || description.includes(keyword)) {
        return 'high';
      }
    }
    
    for (let keyword of mediumPriorityKeywords) {
      if (title.includes(keyword) || description.includes(keyword)) {
        return 'medium';
      }
    }
    
    if (type === 'meeting') return 'high';
    if (type === 'appointment') return 'medium';
    
    return 'low';
  };
  
  // Text-to-speech
  const speakText = (text, lang = 'en') => {
    if (!soundEnabled) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      speechSynthesisRef.current = utterance;
    }
  };
  
  // Drag and drop handlers
  const handleDragStart = (e, event) => {
    if (event.priority === 'high') return;
    
    setIsDragging(true);
    setDragEvent(event);
    dragOffset.current = {
      x: e.clientX - e.target.getBoundingClientRect().left,
      y: e.clientY - e.target.getBoundingClientRect().top
    };
    
    // Create a ghost image
    e.dataTransfer.setDragImage(e.target, dragOffset.current.x, dragOffset.current.y);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDragEvent(null);
  };
  
  const handleDrop = (e, slot) => {
    e.preventDefault();
    
    if (!dragEvent || dragEvent.priority === 'high') return;
    
    // Update the event time
    const updatedEvents = tempEvents.map(event => {
      if (event.id === dragEvent.id) {
        return {
          ...event,
          time: slot.time
        };
      }
      return event;
    });
    
    setTempEvents(updatedEvents);
    setConflictInfo(prev => ({
      ...prev,
      dayEvents: updatedEvents
    }));
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Save rearranged schedule
  const saveRearrangedSchedule = () => {
    // Update events with new arrangement
    const updatedMainEvents = [...events];
    
    tempEvents.forEach(tempEvent => {
      const index = updatedMainEvents.findIndex(e => e.id === tempEvent.id);
      if (index !== -1) {
        // Update existing event
        updatedMainEvents[index] = tempEvent;
      } else if (tempEvent.isNew) {
        // Add new event
        const finalEvent = {
          ...tempEvent,
          id: Date.now(),
          priority: assignPriority(tempEvent),
          color: getPriorityColorHex(assignPriority(tempEvent))
        };
        updatedMainEvents.push(finalEvent);
      }
    });
    
    setEvents(updatedMainEvents);  
    setShowOverlapResolver(false);
    resetEventForm();
    setTempEvents([]);
  };
  
  // Format time for display
  const formatTimeForDisplay = (time24h) => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };
  
  // Get priority color
  const getPriorityColorHex = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'appointment': return 'bg-green-500';
      case 'personal': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Generate calendar days
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  // Get events for date
  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };
  
  // Check for reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const newReminders = [];
      
      events.forEach(event => {
        if (event.reminder) {
          const eventTime = new Date(event.date);
          const [hours, minutes] = event.time.split(':');
          eventTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          const reminderTime = new Date(eventTime.getTime() - event.reminderTime * 60000);
          
          if (now >= reminderTime && now < eventTime) {
            if (!activeReminders.find(r => r.id === event.id)) {
              newReminders.push({
                id: event.id,
                title: event.title,
                time: event.time,
                message: `Reminder: ${event.title} is starting in ${event.reminderTime} minutes`
              });
              
              if (soundEnabled) {
                speakText(newReminders[newReminders.length - 1].message, speechLanguage);
              }
            }
          }
        }
      });
      
      if (newReminders.length > 0) {
        setActiveReminders([...activeReminders, ...newReminders]);
      }
    };
    
    const interval = setInterval(checkReminders, 30000);
    checkReminders();
    
    return () => clearInterval(interval);
  }, [events, activeReminders, soundEnabled, speechLanguage]);
  
  // Generate AI suggestions
  useEffect(() => {
    const generateSuggestions = () => {
      const suggestions = [];
      
      events.forEach(event => {
        const eventTime = new Date(event.date);
        const [hours, minutes] = event.time.split(':');
        eventTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        const eventEndTime = new Date(eventTime.getTime() + event.duration * 60000);
        
        events.forEach(otherEvent => {
          if (event.id !== otherEvent.id && event.date.toDateString() === otherEvent.date.toDateString()) {
            const otherEventTime = new Date(otherEvent.date);
            const [otherHours, otherMinutes] = otherEvent.time.split(':');
            otherEventTime.setHours(parseInt(otherHours), parseInt(otherMinutes), 0, 0);
            const otherEventEndTime = new Date(otherEventTime.getTime() + otherEvent.duration * 60000);
            
            if (
              (eventTime >= otherEventTime && eventTime < otherEventEndTime) ||
              (eventEndTime > otherEventTime && eventEndTime <= otherEventEndTime) ||
              (eventTime <= otherEventTime && eventEndTime >= otherEventEndTime)
            ) {
              suggestions.push({
                type: 'conflict',
                message: `Conflict between "${event.title}" and "${otherEvent.title}"`,
                events: [event.id, otherEvent.id]
              });
            }
          }
        });
      });
      
      setAiSuggestions(suggestions);
    };
    
    generateSuggestions();
  }, [events]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Active Reminders */}
        {activeReminders.length > 0 && (
          <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Reminders
            </h3>
            <div className="space-y-2">
              {activeReminders.map((reminder, index) => (
                <div key={index} className="flex justify-between items-start p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-yellow-800 font-medium">{reminder.message}</p>
                    <p className="text-sm text-yellow-600">Scheduled for {formatTimeForDisplay(reminder.time)}</p>
                  </div>
                  <button
                    onClick={() => setActiveReminders(activeReminders.filter(r => r.id !== reminder.id))}
                    className="text-yellow-700 hover:text-yellow-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Calendar
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {soundEnabled ? 'Sound On' : 'Sound Off'}
            </button>
            <button
              onClick={() => setShowEventForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="mb-6 bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/50">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              AI Suggestions
            </h3>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-800">{suggestion.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar View */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <div className="xl:col-span-3 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h2>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
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
                  className={`min-h-24 p-2 border rounded-lg cursor-pointer transition-all ${
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
                      <div className="font-semibold text-gray-800 flex justify-between">
                        <span>{date.getDate()}</span>
                        {getEventsForDate(date).length > 0 && (
                          <span className={`w-2 h-2 rounded-full ${getPriorityColor(getEventsForDate(date)[0].priority)}`}></span>
                        )}
                      </div>
                      <div className="space-y-1 mt-1">
                        {getEventsForDate(date).slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded text-white truncate ${getTypeColor(event.type)}`}
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
                <div key={event.id} className="p-3 bg-white/50 rounded-lg border-l-4" style={{ borderLeftColor: getPriorityColorHex(event.priority) }}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800">{event.title}</h4>
                        <span className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`}></span>
                        {event.priority === 'high' && <Lock className="w-3 h-3 text-red-500" />}
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeForDisplay(event.time)} ({event.duration} mins)
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {event.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          event.priority === 'high' ? 'bg-red-100 text-red-800' :
                          event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {event.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => editEvent(event)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {getEventsForDate(selectedDate).length === 0 && (
                <p className="text-gray-500 text-center py-8">No events for this day</p>
              )}
            </div>
          </div>
        </div>

        {/* Event Creation Form */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-slideUp">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button
                  onClick={resetEventForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    placeholder="Enter event title"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    min={selectedDate.toDateString() === new Date().toDateString() ? 
                      new Date().getHours().toString().padStart(2, '0') + ':' + 
                      new Date().getMinutes().toString().padStart(2, '0') : '00:00'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                  <input
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value) || 60})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
                  >
                    <option value="auto">Auto (AI Determined)</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  >
                    <option value="meeting">Meeting</option>
                    <option value="appointment">Appointment</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleAddEvent}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                  <button
                    onClick={resetEventForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overlap Resolver Popup */}
        {showOverlapResolver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    Schedule Conflict Detected
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Your event conflicts with existing tasks. Please rearrange your schedule.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowOverlapResolver(false);
                    setTempEvents([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
                {/* Left: Conflict Details */}
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Conflict Details</h4>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium">{conflictInfo.newEvent?.title}</div>
                        <div className="text-sm text-gray-600">
                          {formatTimeForDisplay(conflictInfo.newEvent?.time)} - {conflictInfo.newEvent?.duration} minutes
                        </div>
                      </div>
                      
                      {conflictInfo.overlappingEvents.map((event, index) => (
                        <div key={index} className="bg-white p-3 rounded border flex items-center justify-between">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {event.title}
                              {event.priority === 'high' && <Lock className="w-3 h-3 text-red-500" />}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatTimeForDisplay(event.time)} - {event.duration} minutes
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded ${
                            event.priority === 'high' ? 'bg-red-100 text-red-800' :
                            event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {event.priority} priority
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Available Slots */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Available Time Slots</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {conflictInfo.availableSlots.filter(slot => slot.isAvailable).map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => setConflictInfo(prev => ({ ...prev, selectedSlot: slot }))}
                          className={`p-3 rounded-lg border transition-all ${
                            conflictInfo.selectedSlot?.time === slot.time
                              ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300'
                              : 'bg-white border-gray-200 hover:bg-blue-50'
                          }`}
                        >
                          <div className="font-medium">{slot.formatted}</div>
                          <div className="text-sm text-gray-600">Available</div>
                        </button>
                      ))}
                    </div>
                    
                    {conflictInfo.selectedSlot && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="font-medium text-green-800">Selected Slot</div>
                        <div className="text-green-700">
                          {conflictInfo.selectedSlot.formatted}
                        </div>
                        <button
                          onClick={handleAdjustNewEventTime}
                          className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Move Event to {conflictInfo.selectedSlot.formatted}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Center: Day Schedule */}
                <div className="col-span-2 border rounded-lg overflow-hidden flex flex-col">
                  <div className="bg-gray-50 p-4 border-b">
                    <h4 className="font-semibold text-gray-800">
                      Day Schedule: {selectedDate.toDateString()}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Drag and drop medium/low priority events to rearrange. High priority events are fixed.
                    </p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    {/* Time Grid */}
                    <div className="space-y-1">
                      {generateTimeSlots().map((slot, index) => {
                        const slotTime = new Date(selectedDate);
                        const [hours, minutes] = slot.split(':');
                        slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        const isPast = selectedDate.toDateString() === new Date().toDateString() && slotTime < new Date();
                        const eventAtSlot = tempEvents.find(event => event.time === slot);
                        
                        return (
                          <div
                            key={index}
                            className={`relative h-16 border-b border-gray-200 flex items-center px-4 transition-all ${
                              isPast ? 'bg-gray-100 opacity-50' : 'bg-white hover:bg-blue-50'
                            }`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, { time: slot })}
                          >
                            <div className="w-24 text-sm font-medium text-gray-600">
                              {formatTimeForDisplay(slot)}
                            </div>
                            
                            <div className="flex-1 h-full flex items-center">
                              {eventAtSlot ? (
                                <div
                                  draggable={eventAtSlot.priority !== 'high'}
                                  onDragStart={(e) => handleDragStart(e, eventAtSlot)}
                                  onDragEnd={handleDragEnd}
                                  className={`p-3 rounded-lg w-full transition-all duration-200 ${
                                    eventAtSlot.priority === 'high' 
                                      ? 'cursor-not-allowed opacity-90' 
                                      : 'cursor-move hover:scale-[1.02]'
                                  } ${eventAtSlot.isNew ? 'ring-2 ring-blue-300' : ''}`}
                                  style={{
                                    backgroundColor: eventAtSlot.isNew ? '#DBEAFE' : `${getPriorityColorHex(eventAtSlot.priority)}20`,
                                    borderLeft: `4px solid ${getPriorityColorHex(eventAtSlot.priority)}`
                                  }}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium flex items-center gap-2">
                                        {eventAtSlot.title}
                                        {eventAtSlot.isNew && (
                                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">New</span>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {eventAtSlot.duration} minutes
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-1 text-xs rounded ${
                                        eventAtSlot.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        eventAtSlot.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {eventAtSlot.priority}
                                      </span>
                                      {eventAtSlot.priority !== 'high' && (
                                        <Move className="w-4 h-4 text-gray-500" />
                                      )}
                                      {eventAtSlot.priority === 'high' && (
                                        <Lock className="w-4 h-4 text-red-500" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-400 text-sm">
                                  {isPast ? 'Past time' : 'Empty slot'}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="border-t p-4 bg-gray-50">
                    <div className="flex gap-3">
                      <button
                        onClick={saveRearrangedSchedule}
                        className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        Save Rearranged Schedule
                      </button>
                      <button
                        onClick={() => {
                          setShowOverlapResolver(false);
                          setTempEvents([]);
                        }}
                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;