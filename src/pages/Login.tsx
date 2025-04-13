
import { Link } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Login to CU E-Ricksha</h2>
          <LoginForm />
          <div className="mt-6 text-center text-sm">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-cu-blue hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
