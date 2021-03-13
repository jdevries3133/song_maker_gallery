import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { register, clearError } from "../../actions/auth.action";
import CustomError from "../generics/custom_error";
import { Tos, Privacy } from "../legal";
import { BackendRegistrationError } from "./backend_registration_error";
import styles from "./signup.module.css";

const signup = (props) => {
  const [emailInput, updateEmail] = useState("");
  const [usernameInput, updateUsername] = useState("");
  const [passwordInput, updatePassword] = useState("");
  const [passwordConfirm, updateConfirm] = useState("");
  const [noSpace, setNoSpace] = useState(false);
  const [blanket, setBlanket] = useState(null);
  const [TOS, setTOS] = useState(false);

  useEffect(() => {
    document.title = props.title;
  }, []);

  if (usernameInput.includes(" ") && !noSpace) {
    setNoSpace(true);
  } else if (!usernameInput.includes(" ") && noSpace) {
    setNoSpace(false);
  }

  const onOk = () => {
    setBlanket(null);
    props.clearError();
  };

  const submit = () => {
    if (passwordInput !== passwordConfirm) {
      setBlanket(
        <CustomError
          header="Passwords do not match"
          message={[""]}
          onOk={() => setBlanket(null)}
        />
      );
    } else if (!TOS) {
      setBlanket(
        <CustomError
          header="Terms of Service"
          message={["You must accept the terms of service to make an account"]}
          onOk={() => setBlanket(null)}
        />
      );
    } else if (
      emailInput === "" ||
      usernameInput === "" ||
      passwordInput === "" ||
      passwordConfirm === ""
    ) {
      setBlanket(
        <CustomError
          header="Blank Fields"
          message={["Required fields are blank", "All fields are required."]}
          onOk={() => setBlanket(null)}
        />
      );
    } else {
      props.register({
        email: emailInput,
        username: usernameInput,
        password: passwordInput,
      });
    }
  };

  let pass_bool = passwordInput.length >= 8;

  if (props.isAuthenticated) {
    return <Redirect to="/teacher" />;
  } else if (props.authError && !blanket) {
    setBlanket(
      <BackendRegistrationError
        onClose={() => {
          props.clearError();
          setBlanket(null);
        }}
        errors={props.authError}
      />
    );
  }
  return (
    <div>
      {blanket}
      <h1 className={styles.signup}>sign up!</h1>
      <br />
      <div className="description">
        <div className={styles.signup_module}>
          <h3>Email</h3>
          <input
            className={styles.input}
            onChange={(event) => updateEmail(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit();
              }
            }}
          />
          <h3>Username</h3>
          <input
            style={noSpace ? { borderColor: "red" } : null}
            className={styles.input}
            value={usernameInput}
            onChange={(event) => updateUsername(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit();
              }
            }}
          />
        </div>
        <div className={styles.signup_module}>
          <h3>Password</h3>
          <input
            type="password"
            className={styles.input}
            value={passwordInput}
            onChange={(event) => updatePassword(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit();
              }
            }}
          />
          <h3>Confirm Password</h3>
          <input
            value={passwordConfirm}
            onChange={(e) => updateConfirm(e.target.value)}
            type="password"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit();
              }
            }}
          />
        </div>
        {noSpace ? (
          <p style={{ textAlign: "center", color: "red" }}>
            Username may not contain spaces.
          </p>
        ) : null}
        {pass_bool ? (
          <p className={styles.met}>
            Your password is at least eight characters long
          </p>
        ) : (
          <p className={styles.not_met}>
            Your password must be at least eight characters long
          </p>
        )}
        {/* <label for="tos"> */}
        <span style={{ position: "relative", bottom: "8px" }}>
          I agree to the <Tos /> and <Privacy />
        </span>
        <input type="checkbox" id="tos" onClick={() => setTOS(!TOS)}></input>
        <br />
        <button onClick={() => submit()} className={styles.sign_up}>
          Sign Up
        </button>
        <br />
        <Link to="/login">
          <button>Already have an account? Login here!</button>
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, { register, clearError })(signup);
