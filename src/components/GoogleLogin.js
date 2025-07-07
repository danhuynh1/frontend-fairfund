import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const GoogleLoginButton = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              // Need to move this to .env file
              const res = await axios.post(
                "http://localhost:5000/api/users/google-login",
                {
                  tokenId: response.credential,
                }
              );
              
              console.log(res.data.token);
              login(res.data.token);

              navigate("/");
            } catch (err) {
              console.error("Login failed:", err.response?.data || err.message);
            }
          },
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login"),
          { theme: "outline", size: "large" }
        );
      } else {
        setTimeout(initializeGoogle, 100);
      }
    };

    initializeGoogle();
  }, [login, navigate]);

  return <div id="google-login"></div>;
};

export default GoogleLoginButton;
