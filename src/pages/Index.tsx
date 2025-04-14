
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div 
        className="relative flex flex-col items-center justify-center py-20 px-4 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://blogger.googleusercontent.com/img/a/AVvXsEhhTgvVUO5-bFLFJXtTovOE_f4gMjD1ACVzTfZNKtZonYTe77nV8dSeymhqePAkIFqdKMMvTcAfyFyE2KHVdn5E2wlmQM2y_4ukcw-1Op7EE60jOXY-2qwAqSXvThKC8ldt6LLcdOUYLMNyQvQyXeNT5YEq590_0Nq_frXh9WzPEmUx55T1Ufyj-SLkfw=s16000")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '500px'
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Welcome! CU E-Rickshaw
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            The convenient and eco-friendly way to travel around Chandigarh University campus
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-cu-blue hover:bg-blue-800 text-white px-8">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" className="bg-cu-gold hover:bg-yellow-600 text-black px-8">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="cu-container">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-blue-100 dark:bg-blue-900 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-cu-blue dark:text-blue-300 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Register as a teacher or driver to use the CU E-Rickshaw service
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-blue-100 dark:bg-blue-900 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-cu-blue dark:text-blue-300 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Teachers can view available drivers and contact them directly
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-blue-100 dark:bg-blue-900 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-cu-blue dark:text-blue-300 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Ride</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enjoy a convenient and eco-friendly ride around campus
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
