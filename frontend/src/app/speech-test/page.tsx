import SpeechDemo from '@/components/ui/SpeechDemo';

export default function SpeechTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Rayna Chatbot - Speech-to-Text Test
          </h1>
          <p className="text-gray-600 mt-2">
            Test the speech recognition functionality before integrating into the main chat.
          </p>
        </div>
        
        <SpeechDemo />
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">💡 Testing Tips</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-green-600 mb-2">✅ Browser API (Free)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Works best in Chrome/Edge</li>
                  <li>• Requires HTTPS or localhost</li>
                  <li>• Real-time transcription</li>
                  <li>• Try: "Show me Dubai tours"</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-600 mb-2">⚡ Whisper API (Premium)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Requires OpenAI API key</li>
                  <li>• Better accuracy</li>
                  <li>• Processes after recording</li>
                  <li>• Supports more languages</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}