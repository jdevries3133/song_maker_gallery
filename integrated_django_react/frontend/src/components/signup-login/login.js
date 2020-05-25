import React, { useState } from "react";
import UsernamePassword from "./username_password";
import styles from "./signup.module.css";

const login = (props) => {
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");

  return (
    <div>
      <h1>login!</h1>
      <div className="description">
        <UsernamePassword
          username={(u) => updateUsername(u)}
          password={(p) => updatePassword(p)}
        />
        <div className={styles.loginButtonSpace}>
          <button>Login</button>
        </div>
      </div>
    </div>
  );
};

export default login;
