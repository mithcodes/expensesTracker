import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { toggleTheme } from "../store/themeSlice";

const Header = () => {
  const [profile, setProfile] = useState(false);
  const token_ID = useSelector((store) => store.auth.tokenID);
  const [displayName, setDisplayName] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((store) => store.auth.isAuthenticated);
  const isDarkTheme = useSelector((store) => store.theme.isDarkTheme);

  const handleProfile = () => {
    setProfile(!profile);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
           "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyB7T64JlII8joGSpBQsa85Hj-wiyTggarQ",
          //"https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB7T64JlII8joGSpBQsa85Hj-wiyTggarQ",
          {
            
            method: "POST",
            body: JSON.stringify({ idToken: token_ID }),
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const data1 = data.users[0];
          data1.displayName
            ? setProfileComplete(true)
            : setProfileComplete(false);
          setDisplayName(data1.displayName);
          setPhotoURL(data1.photoUrl);
        } else {
          const data1 = await response.json();
          const msg = data1.error.message;
          console.log(msg);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    isLogin && fetchData();
  }, [token_ID, isLogin]);

  const handleLogout = () => {
    localStorage.removeItem("idToken");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div>
      <div
        className={`${
          isDarkTheme ? "bg-gray-700 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between text-xl shadow-md w-full font-medium">
          
          {!profileComplete && isLogin ? (
            <h1 className="text-md  text-center  p-1 md:p-2 md:m-3 ">
              Your profile is incomplete.{" "}
              <button
                onClick={handleProfile}
                className="text-blue-500 font-semibold"
              >
                Complete Now.
              </button>
            </h1>
          ) : (
            ""
          )}
         {isLogin && (
  <div className="flex  md:flex-row items-center justify-between md:justify-between gap-y-4 gap-x-6 py-5 px-4 w-full">
    {profileComplete && (
      <div className="flex flex-col items-center gap-4">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={photoURL}
          alt="logo"
        />
        <h1 className="text-lg font-semibold">{displayName}</h1>
      </div>
    )}

    <div className="flex items-center gap-4 ">
      <button
        className="px-4 py-2 text-lg bg-blue-500 text-white font-semibold shadow-md rounded-md hover:bg-blue-600"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        className="px-3 py-2 bg-blue-500 text-white shadow-md rounded-md font-semibold hover:bg-blue-600"
        onClick={handleToggleTheme}
      >
        {isDarkTheme ? "☀️" : "🌙"}
      </button>
    </div>
  </div>
)}

        </div>
      </div>
      {profile && <Profile handleProfile={handleProfile} />}
    </div>
  );
};

export default Header;
