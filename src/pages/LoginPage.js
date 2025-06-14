import React from 'react';
import GoogleLoginButton from '../components/GoogleLogin';

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">FairFund</h1>
      <p className="mb-8">Sign in to manage your shared expenses.</p>
      <GoogleLoginButton />
    </div>
  );
};

export default LoginPage;