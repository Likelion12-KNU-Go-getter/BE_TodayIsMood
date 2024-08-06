import React from 'react';
import { Link } from 'react-router-dom';
import './IntroPage.css';

const IntroPage = () => {
  return (
    <div className="intro">
      <h1 className="title">Today's<br />Mood</h1>
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
      <div className="shapes-container">
        <div className="shape1">
          <img src="images/Shape1.png" alt="Shape1" />
        </div>
        <div className="shape2">
          <img src="images/Shape2.png" alt="Shape2" />
        </div>
        <div className="shape3">
          <img src="images/Shape3.png" alt="Shape3" />
        </div>
      </div>
    </div>
  );
};

export default IntroPage;