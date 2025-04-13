
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun, X } from 'lucide-react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
              <span className="ml-2 text-xl font-bold">CU E-Ricksha</span>
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
                <Button 
                  variant="secondary" 
                  onClick={logout}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              className="flex items-center w-full justify-start text-white hover:bg-primary/80"
            >
              {theme === 'dark' ? <Sun className="mr-2" size={18} /> : <Moon className="mr-2" size={18} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>

            {isAuthenticated ? (
              <>
                <div className="text-sm py-1">
                  Welcome, {user?.name} ({user?.role})
                </div>
                <Button 
                  variant="secondary" 
                  onClick={logout}
                  size="sm"
                  className="w-full bg-cu-gold text-black hover:bg-cu-gold/90"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="block">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-white hover:bg-primary/80"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="w-full bg-cu-gold text-black hover:bg-cu-gold/90"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
