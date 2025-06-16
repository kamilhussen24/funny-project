import React, { useState, useRef } from 'react';
import { User, Share2, Github } from 'lucide-react';
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
      updateMetaTags(sharedName);
    }
  }, [sharedName]);

  const updateMetaTags = (portfolioName: string) => {
    const title = `${portfolioName}'s Digital Portfolio`;
    const description = `Check out ${portfolioName}'s professional digital portfolio with skills, experience, and contact information.`;
    const imageUrl = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400';
    const currentUrl = window.location.href;

    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (id: string, content: string) => {
      const element = document.getElementById(id);
      if (element) {
        if (element.hasAttribute('content')) {
          element.setAttribute('content', content);
        } else if (element.hasAttribute('property')) {
          element.setAttribute('content', content);
        }
      }
    };

    updateMetaTag('dynamic-title', title);
    updateMetaTag('dynamic-description', description);
    updateMetaTag('dynamic-og-title', title);
    updateMetaTag('dynamic-og-description', description);
    updateMetaTag('dynamic-og-image', imageUrl);
    updateMetaTag('dynamic-og-url', currentUrl);
    updateMetaTag('dynamic-twitter-title', title);
    updateMetaTag('dynamic-twitter-description', description);
    updateMetaTag('dynamic-twitter-image', imageUrl);
  };

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
      updateMetaTags(name);
    }, 2500);
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
    // Clear URL parameters and reset meta tags
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Reset meta tags to default
    document.title = 'Portfolio Generator - Create Professional Portfolios Instantly';
    const updateMetaTag = (id: string, content: string) => {
      const element = document.getElementById(id);
      if (element) {
        element.setAttribute('content', content);
      }
    };
    
    updateMetaTag('dynamic-title', 'Portfolio Generator - Create Professional Portfolios Instantly');
    updateMetaTag('dynamic-description', 'Generate beautiful professional portfolios instantly. Just enter your name and share your portfolio link.');
    updateMetaTag('dynamic-og-title', 'Portfolio Generator - Create Professional Portfolios Instantly');
    updateMetaTag('dynamic-og-description', 'Generate beautiful professional portfolios instantly. Just enter your name and share your portfolio link.');
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
                  onClick={sharePortfolio}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5" />
                  Share Portfolio
                </button>
                {!isViewingShared && (
                  <button
                    onClick={resetForm}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors duration-200"
                  >
                    Create New Portfolio
                  </button>
                )}
              </div>
            </div>

            <PortfolioCard ref={portfolioRef} name={name} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
            Design by 
            <a 
              href="https://github.com/kamilhussen24" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors duration-200"
            >
              <Github className="w-4 h-4" />
              Kamil Dex
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;