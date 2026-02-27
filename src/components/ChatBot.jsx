import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setSelectedOption(null);
  };

  const options = [
    {
      id: 1,
      title: "📅 Book Appointment",
      content: "Schedule a consultation with your preferred doctor",
      link: "/client/book",
    },
    {
      id: 2,
      title: "📋 My Appointments",
      content: "View all your scheduled appointments",
      link: "/client/appointments",
    },
    {
      id: 3,
      title: "🏥 Dashboard",
      content: "Go to your main dashboard",
      link: "/client/dashboard",
    },
    {
      id: 4,
      title: "ℹ️ About Platform",
      content:
        "Smart healthcare appointment booking platform - connecting patients with doctors efficiently",
      link: null,
    },
    {
      id: 5,
      title: "📞 Contact Us",
      content: "Inquiries: info@healthcare.com | Phone: +1 (800) 123-4567",
      link: null,
    },
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleBack = () => {
    setSelectedOption(null);
  };

  return (
    <>
      {/* Chat Icon Button */}
      <button
        className="chatbot-toggle-btn"
        onClick={toggleChat}
        title="Quick links & help"
        aria-label="Open menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </button>

      {/* Options Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>How can we help?</h3>
            <button
              className="chatbot-close-btn"
              onClick={toggleChat}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-content">
            {!selectedOption ? (
              // Show options list
              <div className="chatbot-options">
                <p className="options-intro">Select an option:</p>
                {options.map((option) => (
                  <button
                    key={option.id}
                    className="option-btn"
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.title}
                  </button>
                ))}
              </div>
            ) : (
              // Show selected option details
              <div className="chatbot-answer">
                <button className="back-btn" onClick={handleBack}>
                  ← Back to menu
                </button>
                <div className="answer-content">
                  <h4>{selectedOption.title}</h4>
                  <p>{selectedOption.content}</p>
                  {selectedOption.link && (
                    <Link
                      to={selectedOption.link}
                      className="answer-link"
                      onClick={toggleChat}
                    >
                      Go to page →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
