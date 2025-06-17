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
    const imageUrl = 'https://raw.githubusercontent.com/kamilhussen24/funny-project/refs/heads/main/dist/assets/Image/profile.jpg?auto=compress&cs=tinysrgb&w=1200&h=630';
    const currentUrl = window.location.href;

    // Update document title immediately
    document.title = title;

    // Function to update meta tags more aggressively
    const updateMetaTag = (selector: string, content: string, attribute: string = 'content') => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.setAttribute(attribute, content);
      });
    };

    // Update all possible meta tag variations
    updateMetaTag('meta[name="description"], #dynamic-description', description);
    updateMetaTag('meta[property="og:title"], #dynamic-og-title', title);
    updateMetaTag('meta[property="og:description"], #dynamic-og-description', description);
    updateMetaTag('meta[property="og:image"], #dynamic-og-image', imageUrl);
    updateMetaTag('meta[property="og:url"], #dynamic-og-url', currentUrl);
    updateMetaTag('meta[name="twitter:title"], #dynamic-twitter-title', title);
    updateMetaTag('meta[name="twitter:description"], #dynamic-twitter-description', description);
    updateMetaTag('meta[name="twitter:image"], #dynamic-twitter-image', imageUrl);

    // Update structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": portfolioName,
      "description": description,
      "image": imageUrl,
      "url": currentUrl,
      "jobTitle": "Professional",
      "worksFor": {
        "@type": "Organization",
        "name": "Digital Portfolio"
      }
    };

    const scriptElement = document.getElementById('structured-data');
    if (scriptElement) {
      scriptElement.textContent = JSON.stringify(structuredData);
    }

    // Force a small delay and try to trigger social media crawlers to re-read
    setTimeout(() => {
      // Create a temporary meta tag refresh hint
      const refreshMeta = document.createElement('meta');
      refreshMeta.setAttribute('property', 'og:updated_time');
      refreshMeta.setAttribute('content', new Date().toISOString());
      document.head.appendChild(refreshMeta);
    }, 100);
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
      alert(`Portfolio link copied! 📋\n\n⚠️ Note: For social media sharing (Facebook, WhatsApp, etc.) to show "${name} | Digital Portfolio" instead of the main title, the link needs to be processed by their servers first. This may take a few minutes after first sharing.`);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`Portfolio link copied! 📋\n\n⚠️ Note: For social media sharing (Facebook, WhatsApp, etc.) to show "${name} | Digital Portfolio" instead of the main title, the link needs to be processed by their servers first. This may take a few minutes after first sharing.`);
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
    
    const resetMetaTag = (selector: string, content: string) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.setAttribute('content', content);
      });
    };
    
    const defaultDescription = 'Create beautiful professional portfolios instantly. Just enter your name and share your portfolio link.';
    resetMetaTag('meta[name="description"], #dynamic-description', defaultDescription);
    resetMetaTag('meta[property="og:title"], #dynamic-og-title', 'Digital Portfolio Maker');
    resetMetaTag('meta[property="og:description"], #dynamic-og-description', defaultDescription);
    resetMetaTag('meta[name="twitter:title"], #dynamic-twitter-title', 'Digital Portfolio Maker');
    resetMetaTag('meta[name="twitter:description"], #dynamic-twitter-description', defaultDescription);

    // Reset structured data
    const defaultStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Digital Portfolio Maker",
      "description": defaultDescription,
      "url": window.location.origin,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser"
    };

    const scriptElement = document.getElementById('structured-data');
    if (scriptElement) {
      scriptElement.textContent = JSON.stringify(defaultStructuredData);
    }
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