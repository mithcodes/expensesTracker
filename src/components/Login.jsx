import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import Typewriter from "typewriter-effect";
const Login = () => {
  const [signIn, setSignIn] = useState(true);
  const [errMsg, setErrMsg] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [forgotPassword, setForgotPassword] = useState(false);

  const email = useRef(null);
  const pass = useRef(null);
  const confirmpass = useRef(null);

  const matchPassword = () => {
    if (pass.current.value === confirmpass.current.value) {
      setErrMsg("Password Matched!");
    }
  };

  useEffect(() => {
    if (errMsg) {
      const timer = setTimeout(() => {
        setErrMsg(null);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [errMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredEmail = email.current.value;
    const enteredPass = pass.current.value;

    if (signIn) {
      // Sign in
      try {
        const response = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB7T64JlII8joGSpBQsa85Hj-wiyTggarQ",
          {
            method: "POST",
            body: JSON.stringify({
              email: enteredEmail,
              password: enteredPass,
              returnSecureToken: true,
            }),
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          const idToken = data.idToken;
          localStorage.setItem("idToken", idToken);
          dispatch(login({ tokenID: idToken, userID: enteredEmail }));
          localStorage.setItem("user", enteredEmail);
          navigate("/home");
        } else {
          setErrMsg(data.error.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      // Sign up
      try {
        const response = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB7T64JlII8joGSpBQsa85Hj-wiyTggarQ",
          {
            method: "POST",
            body: JSON.stringify({
              email: enteredEmail,
              password: enteredPass,
              returnSecureToken: true,
            }),
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setErrMsg("Sign up successful! You can now log in.");
          // Optionally, switch to sign-in mode after successful signup
          setSignIn(true);
        } else {
          setErrMsg(data.error.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const enteredEmail = email.current.value;

    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyB7T64JlII8joGSpBQsa85Hj-wiyTggarQ",
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            requestType: "PASSWORD_RESET",
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Password reset link has been sent to your email.");
      } else {
        const data = await response.json();
        setErrMsg(data.error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggle = () => {
    setSignIn(!signIn);
  };

  const forgotPasswordToggle = () => {
    setForgotPassword(!forgotPassword);
  };

  return (
    <div className=" h-screen  flex flex-col justify-center items-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-4">

      <div className="w-full absolute top-2   text-center text-3xl mt-4 text-indigo-700 font-bold  mb-[100px] ">
      <Typewriter
        options={{
          strings: ['Welcome to My App', 'Track Your Daily Expenses 💸 ',
  'Visualize Your Spending 📊',
  'Save More, Spend Smarter 💡',
  'Your Money, Your Control 💼',],
          autoStart: true,
          loop: true,
        }}
      />
      </div>
    
      {!forgotPassword ? (
      
        <div className="w-3/4 md:w-[0vw] h-auto mx-auto border bg-white border-gray-300   text-center rounded-xl shadow-2xl">
          <h1 className="text-2xl py-8  text-center text-indigo-700 font-bold">
            {!signIn ? "Sign up" : "Login"}
          </h1>
          <p className="text-lg py-1 font-semibold text-red-500">{errMsg}</p>
          <form
            className="flex justify-center flex-col w-[70%] mx-auto space-y-4"
            onSubmit={handleSubmit}
          >
            <input
              className="border border-gray-300 bg-gray-100 text-gray-800 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Email"
              type="email"
              ref={email}
              required
            />
            <input
              className="border border-gray-300 bg-gray-100 text-gray-800 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Password"
              type="password"
              ref={pass}
              required
            />
            {!signIn && (
              <input
                className="border border-gray-300 bg-gray-100 text-gray-800 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Confirm password"
                onChange={matchPassword}
                type="password"
                ref={confirmpass}
                required
              />
            )}
            <button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-pink-500 text-white font-semibold rounded-lg p-2 shadow-lg transition duration-300 ease-in-out">
              {!signIn ? "Sign up" : "Login"}
            </button>
          </form>
          <button className="my-6 font-semibold text-indigo-600 hover:underline" onClick={toggle}>
            {!signIn ? "Have an account? Login" : "New user? Sign up"}
          </button>
          <div className="pb-10 font-semibold text-red-500">
            <Link onClick={forgotPasswordToggle}>Forgot password?</Link>
          </div>
        </div>
      ) : (
        <div className="w-3/4 md:w-2/4 h-auto mx-auto border bg-white border-gray-300 mb-30 text-center rounded-2xl shadow-2xl">
          <form
            className="flex justify-center  pt-10 flex-col w-[70%] mx-auto space-y-4"
            onSubmit={handleForgotPassword}
          >
            <input
              className="border border-gray-300 bg-gray-100 text-gray-800 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Email"
              type="email"
              ref={email}
              required
            />
            <button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-pink-500 text-white font-semibold rounded-lg p-2 shadow-lg transition duration-300 ease-in-out">
              Set Password
            </button>
          </form>
          <div className="py-5 font-semibold text-red-500 ">
            <Link onClick={forgotPasswordToggle}>
              Already set password? Login now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
