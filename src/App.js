import React, { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import './App.css';
import logo from './logo.png';

function App() {
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [pwnedCount, setPwnedCount] = useState(0);

  // FEATURE: Password Generator Logic
  const generateSecurePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    const array = new Uint32Array(16);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < 16; i++) {
      retVal += charset.charAt(array[i] % charset.length);
    }
    setPassword(retVal);
  };

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setAnalysis(result);
      checkPwned(password);
    } else {
      setAnalysis(null);
      setPwnedCount(0);
    }
  }, [password]);

  const checkPwned = async (pwd) => {
    const hash = CryptoJS.SHA1(pwd).toString().toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);
    try {
      const res = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const match = res.data.split('\n').find(line => line.startsWith(suffix));
      setPwnedCount(match ? parseInt(match.split(':')[1]) : 0);
    } catch (err) { console.error("API Error", err); }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={logo} alt="Vault-X Pro Logo" className="app-logo" />
        </div>
        
        <div className="input-container">
          <input 
            type="text" 
            value={password}
            placeholder="Test your password..." 
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
          <button onClick={generateSecurePassword} className="gen-btn">🎲 Generate</button>
        </div>

        {analysis && (
          <div className="results-card">
            <div className="score-header">
              <h3>Strength Score: {analysis.score}/4</h3>
              {/* FEATURE: Entropy Display */}
              <span className="entropy-tag">{Math.round(analysis.guesses_log10 * 3.32)} Bits of Entropy</span>
            </div>

            <div className="score-bar"><div className="fill" style={{ width: `${(analysis.score + 1) * 20}%`, backgroundColor: ['#ff4d4d', '#ffa64d', '#ffdb4d', '#99ff33', '#00cc44'][analysis.score] }}></div></div>
            
            {pwnedCount > 0 && (
              <div className="alert-box">
                🚨 This password has been leaked <strong>{pwnedCount.toLocaleString()}</strong> times! Change it immediately.
              </div>
            )}

            <div className="details-grid">
              <div className="detail-item">
                <small>Cracking Time (Desktop):</small>
                <p>{analysis.crack_times_display.offline_fast_hashing_1e10_per_second}</p>
              </div>
              {analysis.feedback.warning && (
                <div className="detail-item warning-text">
                   <small>Security Note:</small>
                   <p>{analysis.feedback.warning}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;