import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../thunk/MiddlewareFunctions";
import { SetloggedUser } from "../Redusers/ChatSlice";

const Login = () => {
const dispatch=useDispatch()
  const navigate = useNavigate(); // Correct hook for navigation in React Router v6+
useEffect(()=>{
const userInfo=JSON.parse(localStorage.getItem("userInfo"))
dispatch(SetloggedUser(userInfo))
if(userInfo){
  navigate("/chats")
}
},[navigate])    


  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const login = async (data2, setSubmitting) => {
    console.log("login",data2)
    dispatch(loginUser(data2))
    const result = await dispatch(loginUser(data2));

    if (result.success) {
      navigate("/chats"); // ✅ Navigate only on successful login
    } else {
      alert("Failed to login. Please try again.");
    }

    setSubmitting(false);
    // }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={(values, { setSubmitting }) => {
        login(values, setSubmitting); 
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="login-container">
            <div className="login-form">
              <h3>Login</h3>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
                <ErrorMessage name="email" component="div" style={{ color: "red" }} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                />
                <ErrorMessage name="password" component="div" style={{ color: "red" }} />
              </div>
              <div className="form-group">
                <button type="submit" disabled={isSubmitting}>Login</button>
              </div>
              <div>
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                >
                  Sign up
                </span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Login;



