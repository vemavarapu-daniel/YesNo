
import React, { useState, useEffect } from 'react';
import { encodeData, getBaseUrl } from '../utils';

const Creator: React.FC = () => {
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);

  useEffect(() => {
    // Detect if we are in a sandbox/blob environment
    if (window.location.protocol === 'blob:' || window.location.hostname.includes('usercontent.goog')) {
      setIsSandbox(true);
    }
  }, []);

  const handleGenerate = () => {
    if (!message) return;
    const encoded = encodeData({ message, sender });
    const fullLink = `${getBaseUrl()}#p=${encoded}`;
    setGeneratedLink(fullLink);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white/85 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-pink-100 transition-all duration-500">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">💌</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Proposal Maker</h1>
        <p className="text-gray-500 text-sm px-4">Create a magic link to ask that special someone a very important question.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-pink-500 uppercase tracking-widest mb-2 ml-1">Your Message</label>
          <textarea
            className="w-full p-4 rounded-2xl border border-pink-100 bg-pink-50/30 focus:bg-white focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all h-28 resize-none text-gray-700"
            placeholder="Write something from the heart..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-pink-500 uppercase tracking-widest mb-2 ml-1">Your Name (Optional)</label>
          <input
            type="text"
            className="w-full p-4 rounded-2xl border border-pink-100 bg-pink-50/30 focus:bg-white focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-gray-700"
            placeholder="e.g. Victor"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!message}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all transform active:scale-95 ${
            message ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-pink-300' : 'bg-gray-300 cursor-not-allowed shadow-none'
          }`}
        >
          Generate Romantic Link ✨
        </button>

        {generatedLink && (
          <div className="mt-6 p-5 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-pink-100 animate-fadeIn overflow-hidden">
            <p className="text-[10px] font-bold text-pink-600 uppercase tracking-widest mb-2">Your Proposal Link:</p>
            <div className="flex gap-2 mb-3">
              <input
                readOnly
                className="flex-1 bg-white/80 p-3 text-xs rounded-xl border border-pink-100 truncate text-gray-500 font-mono"
                value={generatedLink}
              />
              <button
                onClick={copyToClipboard}
                className="bg-pink-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-pink-600 transition-colors shadow-sm"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            
            {isSandbox && (
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
                <p className="text-[10px] text-amber-700 leading-tight">
                  <strong>Note:</strong> You're in a preview environment. To share this link, please host the files on <strong>GitHub Pages</strong>. This generated link will work perfectly once deployed!
                </p>
              </div>
            )}
            
            <div className="mt-3 flex justify-center">
              <a 
                href={generatedLink} 
                className="text-[11px] text-pink-400 hover:text-pink-600 underline font-medium"
              >
                Preview my proposal page →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Creator;
