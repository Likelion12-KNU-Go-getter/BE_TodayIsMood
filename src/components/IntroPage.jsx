import React from 'react';
import { Link } from 'react-router-dom';
import './IntroPage.css';

const IntroPage = () => {
  return (
    <div className="intro">
      <h1 className="title">Today's Mood</h1>
      <div className="btn-container">
        <Link to="/auth?mode=login">
          <button className="intro-btn">
            LogIn
          </button>
        </Link>
        <Link to="/auth?mode=signup">
          <button className="intro-btn">
            SignUp
          </button>
        </Link>
      </div>
    </div>
  );
};

export default IntroPage;