
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center animate-fade-in"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://scontent.fluh1-2.fna.fbcdn.net/v/t1.6435-9/191230189_3739112682862090_9220374159950932563_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=XuDkxuQ3hGEQ7kNvwHZ_ieU&_nc_oc=AdlWCuRDPPz3vcpT8ae6I4OSrri8so7JlD-h6mnITmuTTTvXxT2tfuLyQ7HikNJr1qQ&_nc_zt=23&_nc_ht=scontent.fluh1-2.fna&_nc_gid=xZDRu3PGtiyZUihu8NiHow&oh=00_AfEANS6Day2wxrBTNFAimrx_SPF3g1q9IdMey6ajR8EiKw&oe=68232DC7")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="bg-white dark:bg-black/70 p-8 rounded-lg shadow-lg w-full max-w-md mx-4 animate-scale-in">
        <h1 className="text-3xl font-bold mb-6 text-center text-cu-blue">CU E-Ricksha Login</h1>
        <LoginForm />
        <div className="mt-6 text-center text-sm">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-cu-gold hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
