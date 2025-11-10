import React from "react";

const SignIn = () => {
  const signIn = () => {
    console.log("signIn");
  };
  return (
    <div>
      <h1 className="text-4xl font-bold text-red-500">Sign In</h1>
      <button
        onClick={signIn}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Sign In
      </button>
    </div>
  );
};

export default SignIn;
