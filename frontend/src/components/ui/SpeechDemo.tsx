"use client";

import { useState } from 'react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useWhisperSTT } from '@/hooks/useWhisperSTT';

export default function SpeechDemo() {
  const [selectedMode, setSelectedMode] = useState<'browser' | 'whisper'>('browser');
  const [results, setResults] = useState<string[]>([]);

  const {
    transcript: browserTranscript,
    isListening,
    isSupported: browserSupported,
    startListening,
    stopListening,
    error: browserError
  } = useSpeechToText();

  const {
    transcript: whisperTranscript,
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    error: whisperError,
    isSupported: whisperSupported
  } = useWhisperSTT();

  const handleBrowserComplete = () => {
    if (browserTranscript) {
      setResults(prev => [...prev, `[Browser] ${browserTranscript}`]);
    }
  };

  const handleWhisperComplete = () => {
    if (whisperTranscript) {
      setResults(prev => [...prev, `[Whisper] ${whisperTranscript}`]);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">🎤 Speech-to-Text Demo</h2>
      
      {/* Mode Selection */}
      <div className="mb-6">
        <div className="flex gap-4 justify-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="browser"
              checked={selectedMode === 'browser'}
              onChange={(e) => setSelectedMode(e.target.value as 'browser')}
              disabled={!browserSupported}
            />
            <span className={browserSupported ? '' : 'opacity-50'}>
              Browser API (Free)
              {!browserSupported && ' - Not supported'}
            </span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="whisper"
              checked={selectedMode === 'whisper'}
              onChange={(e) => setSelectedMode(e.target.value as 'whisper')}
              disabled={!whisperSupported}
            />
            <span className={whisperSupported ? '' : 'opacity-50'}>
              Whisper API (Premium)
              {!whisperSupported && ' - Not supported'}
            </span>
          </label>
        </div>
      </div>

      {/* Browser Mode */}
      {selectedMode === 'browser' && browserSupported && (
        <div className="mb-6">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={isListening ? () => { stopListening(); handleBrowserComplete(); } : startListening}
              className={`px-6 py-3 rounded-lg font-semibold ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isListening ? '🔴 Stop Listening' : '🎤 Start Listening'}
            </button>
            
            {browserTranscript && (
              <div className="p-3 bg-gray-100 rounded-lg w-full">
                <p className="text-sm text-gray-600">Live Transcript:</p>
                <p className="font-medium">{browserTranscript}</p>
              </div>
            )}
            
            {browserError && (
              <div className="p-3 bg-red-100 rounded-lg w-full">
                <p className="text-sm text-red-600">Error: {browserError}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Whisper Mode */}
      {selectedMode === 'whisper' && whisperSupported && (
        <div className="mb-6">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={isRecording ? () => { stopRecording(); handleWhisperComplete(); } : startRecording}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-lg font-semibold ${
                isProcessing
                  ? 'bg-yellow-500 text-white cursor-not-allowed'
                  : isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isProcessing ? '⏳ Processing...' : isRecording ? '🔴 Stop Recording' : '🎤 Start Recording'}
            </button>
            
            {whisperTranscript && (
              <div className="p-3 bg-gray-100 rounded-lg w-full">
                <p className="text-sm text-gray-600">Whisper Result:</p>
                <p className="font-medium">{whisperTranscript}</p>
              </div>
            )}
            
            {whisperError && (
              <div className="p-3 bg-red-100 rounded-lg w-full">
                <p className="text-sm text-red-600">Error: {whisperError}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Results:</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-800">{result}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setResults([])}
            className="mt-3 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Results
          </button>
        </div>
      )}
    </div>
  );
}