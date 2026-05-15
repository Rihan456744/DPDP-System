import { ShieldCheck, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="logo">
          <ShieldCheck size={28} color="var(--brand-dark)" />
          <span>AuditEase</span>
        </Link>
        
        <div className="nav-links">
          <div className="nav-item">Products <ChevronDown size={14} /></div>
          <div className="nav-item">Resources <ChevronDown size={14} /></div>
          <div className="nav-item">Company <ChevronDown size={14} /></div>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn-dark">Login</Link>
        </div>
      </div>
    </nav>
  );
}