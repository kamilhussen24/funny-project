import React, { useState, useRef } from 'react';
import { Download, User, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import PortfolioCard from './components/PortfolioCard';

function App() {
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const portfolioRef = useRef<HTMLDivElement>(null);

  // Check if we're viewing a shared portfolio
  const urlParams = new URLSearchParams(window.location.search);
  const sharedName = urlParams.get('name');
  const isViewingShared = !!sharedName;

  React.useEffect(() => {
    if (sharedName) {
      setName(sharedName);
      setShowPortfolio(true);
    }
  }, [sharedName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsGenerating(true);
    
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setShowPortfolio(true);
      // Generate shareable URL
      const shareUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(name)}`;
      setPortfolioUrl(shareUrl);
    }, 2500);
  };

  const downloadPortfolio = async () => {
    if (!portfolioRef.current) return;

    try {
      // Wait a bit for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(portfolioRef.current, {
        scale: 3, // Higher scale for better quality
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        logging: false,
        width: portfolioRef.current.scrollWidth,
        height: portfolioRef.current.scrollHeight,
        windowWidth: portfolioRef.current.scrollWidth,
        windowHeight: portfolioRef.current.scrollHeight,
      });

      const link = document.createElement('a');
      link.download = `${name}-portfolio.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error downloading image. Please try again.');
    }
  };

  const sharePortfolio = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(name)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s Digital Portfolio`,
          text: `Check out ${name}'s professional portfolio`,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to copying to clipboard
        copyToClipboard(shareUrl);
      }
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Portfolio link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Portfolio link copied to clipboard!');
    });
  };

  const resetForm = () => {
    setName('');
    setShowPortfolio(false);
    setPortfolioUrl('');
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Portfolio Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Enter your name and get a beautiful portfolio instantly
          </p>
        </div>

        {!showPortfolio ? (
          /* Input Form */
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Enter Your Name
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-base sm:text-lg"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !name.trim()}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  {isGenerating ? 'Generating...' : 'Generate Portfolio'}
                </button>
              </form>

              {isGenerating && (
                <div className="mt-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-gray-600">
                    Creating your portfolio...
                  </p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Portfolio Display */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                {isViewingShared ? `${name}'s Portfolio` : 'Your Portfolio is Ready!'}
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  onClick={downloadPortfolio}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <Download className="w-5 h-5" />
                  Download as Image
                </button>
                <button
                  onClick={sharePortfolio}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors duration-200"
                >
                  Create New Portfolio
                </button>
              </div>
            </div>

            <PortfolioCard ref={portfolioRef} name={name} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-600 text-sm">
            Design by <span className="font-semibold">Kamil Dex</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;