import { useState } from 'react';
import './Signup.css';

export default function Signup() {
  return (
    <div className="signup-container container">
      <div className="form-header">
        <h1>Reach out</h1>
        <p>We'd love to know how we can help you! Please fill out the form and we'll get back to you as soon as possible.</p>
      </div>

      <form className="reach-out-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-row">
          <div className="input-group">
            <label>First name<span className="req">*</span></label>
            <input type="text" required />
          </div>
          <div className="input-group">
            <label>Last name<span className="req">*</span></label>
            <input type="text" required />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Email<span className="req">*</span></label>
            <input type="email" required />
          </div>
          <div className="input-group">
            <label>Phone number<span className="req">*</span></label>
            <div className="phone-input">
              <select className="country-code">
                <option>IN ▼</option>
                <option>US ▼</option>
              </select>
              <input type="tel" placeholder="+91" required />
            </div>
          </div>
        </div>

        <div className="input-group full-width">
          <label>Company name<span className="req">*</span></label>
          <input type="text" required />
        </div>

        <div className="form-footer">
          <div className="progress-indicator">
            <span className="step-text">1/2</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '50%' }}></div>
            </div>
          </div>
          <button className="btn-next">Next</button>
        </div>
      </form>
    </div>
  );
}