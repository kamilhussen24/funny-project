import React, { useState, useRef } from 'react';
import { User, Share2, Github, Plus } from 'lucide-react';
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
      // Update URL without the query parameter for cleaner sharing
      const newUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(sharedName)}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [sharedName]);

  const updateMetaTags = (portfolioName: string) => {
    const title = `${portfolioName} | Digital Portfolio`;
    const description = `Check out ${portfolioName}'s professional digital portfolio with skills, experience, and contact information.`;
    const imageUrl = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1200';
    const currentUrl = window.location.href;

    // Update document title
    document.title = title;

    // Function to update or create meta tags
    const setMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update all meta tags
    setMetaTag('description', description);
    
    // Open Graph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', imageUrl, true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:type', 'website', true);
    
    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', imageUrl);

    // Also update existing meta tags with IDs if they exist
    const updateExistingMetaTag = (id: string, content: string) => {
      const element = document.getElementById(id);
      if (element) {
        element.setAttribute('content', content);
      }
    };

    updateExistingMetaTag('dynamic-title', title);
    updateExistingMetaTag('dynamic-description', description);
    updateExistingMetaTag('dynamic-og-title', title);
    updateExistingMetaTag('dynamic-og-description', description);
    updateExistingMetaTag('dynamic-og-image', imageUrl);
    updateExistingMetaTag('dynamic-og-url', currentUrl);
    updateExistingMetaTag('dynamic-twitter-title', title);
    updateExistingMetaTag('dynamic-twitter-description', description);
    updateExistingMetaTag('dynamic-twitter-image', imageUrl);
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
          title: `${name} | Digital Portfolio`,
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
      alert('Portfolio link copied to clipboard! Share this link on social media to show the personalized preview.');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Portfolio link copied to clipboard! Share this link on social media to show the personalized preview.');
    });
  };

  const resetForm = () => {
    setName('');
    setShowPortfolio(false);
    setPortfolioUrl('');
    // Clear URL parameters and reset meta tags
    window.history.replaceState({}, '', window.location.pathname);
    
    // Reset meta tags to default
    document.title = 'Digital Portfolio Maker';
    
    const resetMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      const element = document.querySelector(selector) as HTMLMetaElement;
      if (element) {
        element.setAttribute('content', content);
      }
    };
    
    resetMetaTag('description', 'Create beautiful professional portfolios instantly. Just enter your name and share your portfolio link.');
    resetMetaTag('og:title', 'Digital Portfolio Maker', true);
    resetMetaTag('og:description', 'Create beautiful professional portfolios instantly. Just enter your name and share your portfolio link.', true);
    resetMetaTag('twitter:title', 'Digital Portfolio Maker');
    resetMetaTag('twitter:description', 'Create beautiful professional portfolios instantly. Just enter your name and share your portfolio link.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Digital Portfolio Maker
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
                {isViewingShared ? (
                  <button
                    onClick={resetForm}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Portfolio
                  </button>
                ) : (
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