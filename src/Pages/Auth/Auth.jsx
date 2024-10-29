import React, { useState, useContext } from "react";
import classes from "./SignUp.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../Utility/Firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { DataContext } from "../../components/DataProvider/DataProvider";
import { Type } from "../../Utility/Action.type";
import { ClipLoader } from "react-spinners";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [{ user }, dispatch] = useContext(DataContext);
  const [loading, setLoading] = useState({
    signIn: false,
    signUp: false,
  });
  const navigate = useNavigate();
  const navStateData = useLocation();

  const authHandler = (e) => {
    e.preventDefault();
    const isSignIn = e.target.name === "signin";

    const trimmedEmail = email.trim(); // Trim whitespace
    if (!trimmedEmail) {
      setError("Email cannot be empty.");
      return;
    }

    setLoading((prevState) => ({
      ...prevState,
      [isSignIn ? "signIn" : "signUp"]: true,
    }));

    const authMethod = isSignIn
      ? signInWithEmailAndPassword
      : createUserWithEmailAndPassword;

    authMethod(auth, trimmedEmail, password)
      .then((userInfo) => {
        dispatch({ type: Type.SET_USER, user: userInfo.user });
        setLoading({ signIn: false, signUp: false });
        navigate(navStateData?.state?.redirect || "/");
      })
      .catch((err) => {
        console.error("Authentication error:", err);
        setError(err.message);
        setLoading((prevState) => ({
          ...prevState,
          [isSignIn ? "signIn" : "signUp"]: false,
        }));
      });
  };

  return (
    <section className={classes.login}>
      <Link to={"/"}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          alt="Amazon Logo"
        />
      </Link>

      <div className={classes.login_container}>
        <h1>Sign In</h1>
        {navStateData?.state?.msg && (
          <small
            style={{
              padding: "5px",
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
            }}
          >
            {navStateData?.state?.msg}
          </small>
        )}
        <form action="">
          <div>
            <label htmlFor="">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type={"submit"}
            onClick={authHandler}
            name="signin"
            className={classes.signInBtn}
          >
            {loading.signIn ? <ClipLoader color="#000" size={15} /> : "Sign In"}
          </button>
        </form>
        <p>
          By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use &
          Sale. Please see our Privacy Notice, our Cookies Notice and our
          interest-Based Ads Notice.
        </p>
        <button
          type={"submit"}
          onClick={authHandler}
          name="signup"
          className={classes.registerBtn}
        >
          {loading.signUp ? (
            <ClipLoader color="#000" size={15} />
          ) : (
            "Create your Amazon Account"
          )}
        </button>
        {error && (
          <small style={{ paddingTop: "5px", color: "red" }}>{error}</small>
        )}
      </div>
    </section>
  );
};

export default Auth;
