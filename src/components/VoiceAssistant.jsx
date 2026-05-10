import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Bell, Trash2, Clock, Calendar, Cloud, Sun, Plus } from 'lucide-react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responses, setResponses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [newNote, setNewNote] = useState('');
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2 text-center">
          Voice Assistant
        </h1>
        <p className="text-gray-600 text-center mb-8">Speak to create notes, set reminders, and get information</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voice Control */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50">
            <div className="text-center mb-6">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                    : 'bg-gradient-to-r from-blue-500 to-teal-500'
                }`}>
                  {isListening ? (
                    <MicOff className="w-16 h-16 text-white" />
                  ) : (
                    <Mic className="w-16 h-16 text-white" />
                  )}
                </div>
                {isListening && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-ping"></div>
                )}
              </div>
              
              <button
                onClick={toggleListening}
                className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
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
          </div>

          {/* Notes & Reminders */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Notes & Reminders</h2>
              <Bell className="w-6 h-6 text-yellow-500" />
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
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
                <Clock size={16} className="mr-2 text-blue-500" />
                <strong>Time:</strong> "What time is it?", "What's the date today?"
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 flex items-center">
                <Sun size={16} className="mr-2 text-yellow-500" />
                <strong>Assistant:</strong> "Tell me a joke", "How's the weather?"
              </p>
              <p className="text-gray-700 flex items-center">
                <Calendar size={16} className="mr-2 text-blue-500" />
                <strong>Calculator:</strong> "Calculate 15 plus 27", "What's 100 divided by 5?"
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
      `}</style>
    </div>
  );
};

export default VoiceAssistant;