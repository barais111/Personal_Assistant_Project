import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Bell, Trash2, Clock, Calendar, Cloud, Sun, Plus, Newspaper, ExternalLink } from 'lucide-react';

const NewsVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responses, setResponses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'business', name: 'Business' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'health', name: 'Health' },
    { id: 'science', name: 'Science' },
    { id: 'sports', name: 'Sports' },
    { id: 'technology', name: 'Technology' }
  ];

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
      
      if (finalTranscript) {
        processVoiceCommand(finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      addResponse('System', `Error: ${event.error}`);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis;

    // Load saved notes from localStorage
    const savedNotes = JSON.parse(localStorage.getItem('voice_notes')) || [];
    setNotes(savedNotes);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // Using a free News API - you'll need to get your own API key from https://newsapi.org/
        // For demonstration, I'm using a placeholder API call
        // In a real app, you would use: 
        const apiKey = 'YOUR_API_KEY';
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=in&category=${selectedCategory === 'all' ? '' : selectedCategory}&apiKey=${apiKey}`);
        
        // Mock data for demonstration
        const mockNews = [
          {
            title: 'India\'s Economy Shows Strong Growth in Q2',
            description: 'India\'s GDP grew by 7.8% in the second quarter, exceeding economists\' expectations and signaling a robust recovery.',
            url: 'https://example.com/article1',
            urlToImage: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Economic Times' },
            category: 'business'
          },
          {
            title: 'Bollywood Star Announces New Project',
            description: 'Popular actor announces new film project with acclaimed director, creating buzz among fans.',
            url: 'https://example.com/article2',
            urlToImage: 'https://images.unsplash.com/photo-1489599102910-59206b8ca314?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Entertainment Now' },
            category: 'entertainment'
          },
          {
            title: 'New Health Policy to Benefit Millions',
            description: 'Government announces new health insurance scheme that will cover pre-existing conditions for millions of citizens.',
            url: 'https://example.com/article3',
            urlToImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Health Daily' },
            category: 'health'
          },
          {
            title: 'Indian Scientists Make Breakthrough in Renewable Energy',
            description: 'Research team develops more efficient solar cells that could reduce the cost of solar power by 40%.',
            url: 'https://example.com/article4',
            urlToImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Science India' },
            category: 'science'
          },
          {
            title: 'Cricket Team Prepares for World Cup',
            description: 'Indian cricket team begins intensive training camp ahead of the upcoming ICC World Cup tournament.',
            url: 'https://example.com/article5',
            urlToImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Sports Today' },
            category: 'sports'
          },
          {
            title: 'Indian Tech Startup Raises $100 Million',
            description: 'Bangalore-based AI startup secures significant funding round led by international investors.',
            url: 'https://example.com/article6',
            urlToImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Tech News India' },
            category: 'technology'
          }
        ];

        // Filter by category if needed
        const filteredNews = selectedCategory === 'all' 
          ? mockNews 
          : mockNews.filter(item => item.category === selectedCategory);
        
        setNews(filteredNews);
      } catch (error) {
        console.error('Error fetching news:', error);
        addResponse('System', 'Failed to fetch news. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('voice_notes', JSON.stringify(notes));
  }, [notes]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const speak = (text) => {
    if (!synthesisRef.current) return;
    
    // Cancel any ongoing speech
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthesisRef.current.speak(utterance);
  };

  const addResponse = (speaker, text) => {
    setResponses(prev => [
      ...prev.slice(-9), // Keep only the last 10 responses
      { speaker, text, timestamp: new Date() }
    ]);
  };

  const addNote = (content) => {
    const newNote = {
      id: Date.now(),
      content,
      timestamp: new Date().toLocaleString()
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const addNoteManually = () => {
    if (newNote.trim()) {
      addNote(newNote);
      addResponse('You', `Added note: ${newNote}`);
      speak(`Added note: ${newNote}`);
      setNewNote('');
    }
  };

  const processVoiceCommand = (command) => {
    let response = '';
    
    // Convert to lowercase for easier matching but keep original for note content
    const lowerCommand = command.toLowerCase();
    
    // Create a note - improved pattern matching
    if (/(create|make|add|take).*note/gi.test(lowerCommand) || 
        /note.*(create|make|add|take)/gi.test(lowerCommand)) {
      let noteContent = command.replace(/(create|make|add|take).*note|note.*(create|make|add|take)/gi, '').trim();
      
      // Alternative pattern if the first one didn't capture content
      if (!noteContent || noteContent.length < 3) {
        noteContent = command.replace(/(please|can you|could you)/gi, '').trim();
      }
      
      if (noteContent && noteContent.length > 2) {
        const newNote = addNote(noteContent);
        response = `I've created a note: "${noteContent}"`;
        addResponse('You', command);
        addResponse('Assistant', response);
        speak(response);
        return;
      } else {
        response = "What would you like me to write in the note?";
        addResponse('You', command);
        addResponse('Assistant', response);
        speak(response);
        return;
      }
    }
    // News commands
    else if (/(news|headlines|latest).*(india|indian)/gi.test(lowerCommand) || 
             /(india|indian).*(news|headlines)/gi.test(lowerCommand)) {
      response = "Here are the latest news headlines from India.";
      addResponse('You', command);
      addResponse('Assistant', response);
      speak(response);
      return;
    }
    else if (/(business|finance|economy).*news/gi.test(lowerCommand)) {
      setSelectedCategory('business');
      response = "Showing business news from India.";
      addResponse('You', command);
      addResponse('Assistant', response);
      speak(response);
      return;
    }
    else if (/(sports|sport|cricket).*news/gi.test(lowerCommand)) {
      setSelectedCategory('sports');
      response = "Showing sports news from India.";
      addResponse('You', command);
      addResponse('Assistant', response);
      speak(response);
      return;
    }
    else if (/(technology|tech|computer).*news/gi.test(lowerCommand)) {
      setSelectedCategory('technology');
      response = "Showing technology news from India.";
      addResponse('You', command);
      addResponse('Assistant', response);
      speak(response);
      return;
    }
    // Add reminder - improved pattern matching
    else if (/(set|create|add).*reminder/gi.test(lowerCommand) || 
             /reminder.*(set|create|add)/gi.test(lowerCommand)) {
      let reminderContent = command.replace(/(set|create|add).*reminder|reminder.*(set|create|add)/gi, '').trim();
      
      // Try alternative extraction if the first didn't work
      if (!reminderContent || reminderContent.length < 3) {
        reminderContent = command.replace(/(please|can you|could you|for)/gi, '').trim();
      }
      
      if (reminderContent && reminderContent.length > 2) {
        const newNote = addNote(`🔔 REMINDER: ${reminderContent}`);
        response = `I've set a reminder: "${reminderContent}"`;
        addResponse('You', command);
        addResponse('Assistant', response);
        speak(response);
        return;
      } else {
        response = "What would you like me to remind you about?";
        addResponse('You', command);
        addResponse('Assistant', response);
        speak(response);
        return;
      }
    }
    // Time
    else if (/(what.*time|current time|time.*now)/gi.test(lowerCommand)) {
      const now = new Date();
      response = `It's ${now.toLocaleTimeString()}`;
      addResponse('You', command);
      addResponse('Assistant', response);
      speak(response);
      return;
    }
    // Date
    else if (/(what.*date|current date|today.*date|date.*today)/gi.test(lowerCommand)) {
      const now = new Date();
      response = `Today is ${now.toLocaleDateString()}`;
      addResponse('You', command);
      addResponse('Assistant', response);
      speak(response);
      return;
    }
    // Joke
    else if (/(tell.*joke|say.*joke|make.*laugh)/gi.test(lowerCommand)) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "What do you call a fake noodle? An impasta!",
        "How does a penguin build its house? Igloos it together!",
        "Why did the math book look so sad? Because it had too many problems!"
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      response = randomJoke;
      addResponse('You', command);
      addResponse('Assistant', response);
      speak(response);
      return;
    }
    // Weather (simulated)
    else if (/(how.*weather|what.*weather|weather.*like)/gi.test(lowerCommand)) {
      const weatherOptions = [
        "It's sunny and 75 degrees outside. Perfect day!",
        "Currently raining. Don't forget your umbrella!",
        "Cloudy with a chance of meatballs. Just kidding! But it is cloudy.",
        "Snowing outside. Great day to stay in with hot chocolate!"
      ];
      response = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      addResponse('You', command);
      addResponse('Assistant', response);
      speak(response);
      return;
    }
    // Calculation
    else if (/(calculate|what.*plus|what.*minus|what.*times|what.*divided)/gi.test(lowerCommand)) {
      try {
        // Extract calculation part
        let calcStr = command;
        
        // Remove common phrases
        calcStr = calcStr.replace(/(please|can you|could you|calculate|what is|what's)/gi, '');
        
        // Replace words with operators
        calcStr = calcStr.replace(/plus/gi, '+')
                         .replace(/minus/gi, '-')
                         .replace(/times/gi, '*')
                         .replace(/multiplied by/gi, '*')
                         .replace(/divided by/gi, '/')
                         .replace(/[^0-9+\-*/().]/g, '');
        
        // Evaluate safely
        const result = Function('"use strict"; return (' + calcStr + ')')();
        response = `The result is ${result}`;
        addResponse('You', command);
        addResponse('Assistant', response);
        speak(response);
        return;
      } catch (e) {
        response = "Sorry, I couldn't calculate that.";
        addResponse('You', command);
        addResponse('Assistant', response);
        speak(response);
        return;
      }
    }
    // List notes
    else if (/(list.*notes|show.*notes|my notes)/gi.test(lowerCommand)) {
      if (notes.length === 0) {
        response = "You don't have any notes yet.";
      } else {
        response = `You have ${notes.length} note${notes.length === 1 ? '' : 's'}.`;
        // We'll just show the notes in the UI rather than reading them all
        addResponse('You', command);
        addResponse('Assistant', response);
        speak(response);
        return;
      }
      addResponse('You', command);
      addResponse('Assistant', response);
      speak(response);
      return;
    }
    // Clear notes
    else if (/(clear.*notes|delete.*notes|remove.*notes)/gi.test(lowerCommand)) {
      setNotes([]);
      response = "All notes have been cleared.";
      addResponse('You', command);
      addResponse('Assistant', response);
      speak(response);
      return;
    }
    // Default response
    else {
      response = "I heard you, but I'm not sure how to help with that. Try asking me to create a note or tell you a joke.";
      addResponse('You', command);
      addResponse('Assistant', response);
      speak(response);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2 text-center">
          Indian News Voice Assistant
        </h1>
        <p className="text-gray-600 text-center mb-8">Stay updated with the latest Indian news and manage tasks with voice commands</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Voice Control */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50 lg:col-span-1">
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                    : 'bg-gradient-to-r from-blue-500 to-teal-500'
                }`}>
                  {isListening ? (
                    <MicOff className="w-12 h-12 text-white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </div>
                {isListening && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-ping"></div>
                )}
              </div>
              
              <button
                onClick={toggleListening}
                className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-pink-500'
                    : 'bg-gradient-to-r from-blue-500 to-teal-500'
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
                  <p className="text-gray-800"><strong>You said:</strong> {transcript}</p>
                </div>
              )}

              {isSpeaking && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-600"><strong>Assistant is speaking...</strong></p>
                </div>
              )}
            </div>

            {/* Manual Note Input */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Add Note Manually</h3>
              <div className="flex">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type a note here..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addNoteManually()}
                />
                <button
                  onClick={addNoteManually}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-1" /> Add
                </button>
              </div>
            </div>

            {/* Notes & Reminders */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Notes & Reminders</h2>
                <Bell className="w-6 h-6 text-yellow-500" />
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No notes yet. Speak to create one!</p>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="p-3 bg-white/50 rounded-lg flex justify-between items-start note-item">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{note.content}</p>
                        <p className="text-xs text-gray-600 mt-1">{note.timestamp}</p>
                      </div>
                      <button 
                        onClick={() => deleteNote(note.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* News Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <Newspaper className="mr-2 text-blue-500" /> Indian News
              </h2>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                      : 'bg-white/70 text-gray-700 hover:bg-white/90'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* News Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white/70 rounded-2xl overflow-hidden shadow-md border border-white/50 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedArticle(item)}
                  >
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={item.urlToImage} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {item.source.name}
                        </span>
                        <span className="text-xs text-gray-500">{formatTime(item.publishedAt)}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                      <button className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                        Read more <ExternalLink size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assistant Responses */}
        <div className="mt-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversation History</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {responses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No conversation yet. Speak to interact!</p>
            ) : (
              responses.map((response, index) => (
                <div key={index} className="p-4 bg-white/50 rounded-lg fade-in">
                  <div className="flex justify-between items-start mb-2">
                    <p className={`font-medium ${response.speaker === 'You' ? 'text-blue-600' : 'text-teal-600'}`}>
                      {response.speaker}:
                    </p>
                    <span className="text-xs text-gray-500">
                      {response.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-800">{response.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedArticle.title}</h2>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <img 
                  src={selectedArticle.urlToImage} 
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 mb-4">{selectedArticle.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Source: {selectedArticle.source.name}</span>
                  <span className="text-sm text-gray-500">{formatTime(selectedArticle.publishedAt)}</span>
                </div>
                <a 
                  href={selectedArticle.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Read full article <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Voice Commands Help */}
        <div className="mt-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Voice Commands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-700 flex items-center">
                <Cloud size={16} className="mr-2 text-blue-500" />
                <strong>Notes:</strong> "Create a note [content]", "Add reminder [content]"
              </p>
              <p className="text-gray-700 flex items-center">
                <Newspaper size={16} className="mr-2 text-blue-500" />
                <strong>News:</strong> "Show me Indian news", "Business news", "Sports news"
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 flex items-center">
                <Sun size={16} className="mr-2 text-yellow-500" />
                <strong>Assistant:</strong> "Tell me a joke", "How's the weather?"
              </p>
              <p className="text-gray-700 flex items-center">
                <Calendar size={16} className="mr-2 text-blue-500" />
                <strong>Information:</strong> "What time is it?", "What's the date?"
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .note-item {
          transition: all 0.3s ease;
        }
        .note-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NewsVoiceAssistant;