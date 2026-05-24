import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      backgroundColor: 'var(--bg-main)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '60px 20px' 
    }}>
      <div style={{
        maxWidth: '540px', 
        width: '100%', 
        padding: '60px 48px',
        background: 'var(--bg-card)', 
        border: '1px solid var(--border-light)',
        borderRadius: '24px', 
        boxShadow: '0 20px 40px rgba(30, 58, 95, 0.06)',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'
      }}>
        
        {/* Header Icon */}
        <div style={{ 
          marginBottom: '24px', 
          background: 'var(--bg-main)', 
          padding: '20px', 
          borderRadius: '50%',
          border: '1px solid var(--border-light)'
        }}>
          <ShieldCheck size={48} color="var(--accent-blue)" />
        </div>
        
        <h2 style={{ color: 'var(--primary-navy)', fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '40px', textAlign: 'center', lineHeight: '1.6' }}>
          Enter your credentials to access the Legisure compliance dashboard.
        </p>

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ position: 'relative' }}>
            <User size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '18px', left: '18px' }} />
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', height: '56px', paddingLeft: '52px', paddingRight: '16px',
                background: 'var(--bg-main)', border: '2px solid transparent', borderRadius: '12px',
                fontSize: '16px', color: 'var(--text-main)', outline: 'none', transition: '0.2s', fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
              required 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '18px', left: '18px' }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', height: '56px', paddingLeft: '52px', paddingRight: '16px',
                background: 'var(--bg-main)', border: '2px solid transparent', borderRadius: '12px',
                fontSize: '16px', color: 'var(--text-main)', outline: 'none', transition: '0.2s', fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
              required 
            />
          </div>

          <button 
            type="submit" 
            style={{
              marginTop: '16px', width: '100%', height: '56px',
              background: 'var(--primary-navy)', color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '18px', fontWeight: '700', cursor: 'pointer', transition: '0.2s'
            }}
            onMouseOver={(e) => { e.target.style.background = '#11223a'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.target.style.background = 'var(--primary-navy)'; e.target.style.transform = 'translateY(0)'; }}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '32px', fontSize: '15px', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-blue)', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
}