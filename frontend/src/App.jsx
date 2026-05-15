import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth defaultMode="login" />} />
            <Route path="/signup" element={<Auth defaultMode="signup" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;