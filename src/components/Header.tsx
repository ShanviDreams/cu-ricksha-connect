
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun, X } from 'lucide-react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };
  
  const getDashboardLink = () => {
    if (!user) return '/';
    
    return user.role === 'teacher' ? '/teacher-dashboard' : '/driver-dashboard';
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="cu-container py-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA9lEVfkq7WSDcSMPauIQxHz5Ct2Kb_Jo0Ig&s" 
                alt="CU Logo" 
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-bold">CU E-Rickshaw</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-white hover:bg-primary/80"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            {isAuthenticated ? (
              <>
                <span className="text-sm">
                  Welcome, {user?.name} ({user?.role})
                </span>
                <Link to={getDashboardLink()}>
                  <Button variant="ghost" className="text-white hover:bg-primary/80">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="secondary" 
                  onClick={handleLogout}
                  className="bg-cu-gold text-black hover:bg-cu-gold/90"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-primary/80">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    variant="secondary"
                    className="bg-cu-gold text-black hover:bg-cu-gold/90"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="text-white hover:bg-primary/80"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-3 animate-fade-in">
            {isAuthenticated ? (
              <>
                <div className="px-2 py-1 text-sm font-medium">
                  Welcome, {user?.name} ({user?.role})
                </div>
                <Link 
                  to={getDashboardLink()} 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-2 py-1 hover:bg-primary/80 rounded"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-1 text-cu-gold hover:bg-primary/80 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-2 py-1 hover:bg-primary/80 rounded"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-2 py-1 text-cu-gold hover:bg-primary/80 rounded"
                >
                  Sign Up
                </Link>
              </>
            )}
            <div className="px-2 py-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleTheme}
                className="text-white hover:bg-primary/80 p-0"
              >
                {theme === 'dark' ? (
                  <div className="flex items-center">
                    <Sun size={16} className="mr-2" /> Light Mode
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Moon size={16} className="mr-2" /> Dark Mode
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
