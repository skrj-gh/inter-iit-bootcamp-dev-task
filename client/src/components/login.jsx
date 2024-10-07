// src/components/Login.jsx
import React, { useContext } from "react";
import { auth, provider, signInWithPopup } from "../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/context";
import "./login.css"; // Import the CSS file
import googleLogo from '../assets/google.png'; // Import the Google logo
import { browserLocalPersistence, setPersistence } from "firebase/auth";


function Login() {
  const {setProfileImage, setName, setEmail} = useContext(Context)

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setPersistence(auth, browserLocalPersistence)
    .then(async () => {
      try {
          const result = await signInWithPopup(auth, provider);
          // User signed in successfully
          // console.log("User Info: ", result.user);
          
          // console.log(result.user.photoURL)
          const response = await fetch(result.user.photoURL);
          // console.log(response)
          if(response.status===200){
            const blob = await response.blob();
            const imgURL = URL.createObjectURL(blob);
            setProfileImage(imgURL);
          }
          
          setName(result.user.displayName)
          setEmail(result.user.email)
          // Redirect to main page
          navigate("/home");
        } catch (error) {
          console.error("Error during login: ", error);
        }
    });
  };

  return (
    <div className="login-container"> {/* Apply the login-container class */}
      <div className="login-content"> {/* New div for login text and button */}
        <h3>Let's get creative!</h3>
        <h2>Login to LazarusAi</h2>
        <button className="google-login-button" onClick={handleGoogleLogin}>
          <img src={googleLogo} alt="Google" /> {/* Use the imported Google logo */}
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
