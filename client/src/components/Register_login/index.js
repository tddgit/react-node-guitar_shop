import React from "react";
import MyButton from "../utils/button";
import Login from "./login";

const RegisterLogin = () => {
  return (
    <div className={"page_wrapper"}>
      <div className={"container"}>
        <div className={"register_login_container"}>
          <div className={"left"}>
            <h1>New customer</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <MyButton
              type={"default"}
              title={"Create an account"}
              linkTo={"/register"}
              addStyles={{ margin: "10px 0 0 0" }}
            />
          </div>
          <div className="right">
            <h2>Registered customers</h2>
            <p>If you an account please log in.</p>
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLogin;
