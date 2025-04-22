
import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '@/components/SignupForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Signup = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center animate-fade-in p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://scontent.fluh1-2.fna.fbcdn.net/v/t1.6435-9/191230189_3739112682862090_9220374159950932563_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=XuDkxuQ3hGEQ7kNvwHZ_ieU&_nc_oc=AdlWCuRDPPz3vcpT8ae6I4OSrri8so7JlD-h6mnITmuTTTvXxT2tfuLyQ7HikNJr1qQ&_nc_zt=23&_nc_ht=scontent.fluh1-2.fna&_nc_gid=xZDRu3PGtiyZUihu8NiHow&oh=00_AfEANS6Day2wxrBTNFAimrx_SPF3g1q9IdMey6ajR8EiKw&oe=68232DC7")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Card className="w-full max-w-md mx-auto bg-white dark:bg-black/70 shadow-xl animate-scale-in">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-cu-blue">
            CU E-Rickshaw Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <div className="mt-6 text-center text-sm">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-cu-gold hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
