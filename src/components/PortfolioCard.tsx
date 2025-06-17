import React from 'react';

interface PortfolioCardProps {
  name: string;
}

const PortfolioCard = React.forwardRef<HTMLDivElement, PortfolioCardProps>(({ name }, ref) => {
  const skills = ['Doctor', 'Teacher', 'Police', 'Engineer', 'Astronaut', 'Army', 'Delivery Boy', 'A Cop', 'Gamer'];
  const nextDatePeople = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis'];

  return (
    <div ref={ref} id="portfolio-card" className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-8 sm:py-12 text-white text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Digital Portfolio</h1>
        
        {/* Profile Image */}
        <div className="mb-6">
          <img
            src="https://raw.githubusercontent.com/kamilhussen24/funny-project/refs/heads/main/dist/assets/Image/profile.jpg?auto=compress&cs=tinysrgb&w=400"
            alt={name}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover mx-auto"
            crossOrigin="anonymous"
          />
        </div>
        
        {/* Name */}
        <h2 className="text-3xl sm:text-4xl font-bold">{name}</h2>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Skills & Expertise */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium"
                style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  border: '1px solid #bae6fd'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Long Time Working */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Long Time Work Record</h3>
          <p className="text-lg sm:text-xl font-semibold" style={{ color: '#0369a1' }}>4 Hours+</p>
        </div>

        {/* Next Date */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Next Date:</h3>
          <div className="space-y-2">
            {nextDatePeople.map((person, index) => (
              <div key={index} className="rounded-lg p-3 sm:p-4" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <p className="text-base sm:text-lg font-medium text-gray-700">{person}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

PortfolioCard.displayName = 'PortfolioCard';

export default PortfolioCard;