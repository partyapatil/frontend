import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import axiosInstance from "../../src/axiosInstance";

// Define types for the component's state
interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  pic: File | string | null;
  picLoading: boolean;
}

// Define the type for the API response
interface ApiResponse {
  // Define the structure of the API response here
  // For example:
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    pic: string;
  };
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // State variables for each form field
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: null,
    picLoading: false,
  });

  // Destructure state for easier access
  const { name, email, password, confirmPassword, pic, picLoading } = formState;

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match!");
      return;
    }
    if (!password || !email || !name) {
      toast.warning("Please enter all fields!");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

const { data } = await axiosInstance.post<ApiResponse>(
  "/api/user",
  {
          name,
          email,
          password,
          pic: pic || undefined,
        },
        config
      );

      toast.success("You are successfully signed up!");
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during signup.");
    }

    // Clear form after submission
    setFormState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      pic: null,
      picLoading: false,
    });
  };

  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormState((prevState) => ({
        ...prevState,
        pic: e.target.files![0],
      }));
      uploadImageToCloudinary(e.target.files[0]);
    }
  };

  // Function to upload the image to Cloudinary
  const uploadImageToCloudinary = async (pics: File) => {
    setFormState((prevState) => ({ ...prevState, picLoading: true }));

    if (pics === undefined) {
      toast.warning("Please select an image!");
      setFormState((prevState) => ({ ...prevState, picLoading: false }));
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const formData = new FormData();
      formData.append("file", pics);
      formData.append("upload_preset", "chatApp"); // Your upload preset
      formData.append("cloud_name", "ddpunpqre"); // Your Cloudinary cloud name

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/ddpunpqre/image/upload",
          {
            method: "post",
            body: formData,
          }
        );
        const data = await res.json();
        const imageUrl = data.secure_url; // Image URL from Cloudinary
        setFormState((prevState) => ({ ...prevState, pic: imageUrl }));
        setFormState((prevState) => ({ ...prevState, picLoading: false }));
      } catch (err) {
        console.error(err);
        toast.error("Error uploading image! Please try again.");
        setFormState((prevState) => ({ ...prevState, picLoading: false }));
      }
    } else {
      toast.error("Invalid file type. Please select a JPEG or PNG image.");
      setFormState((prevState) => ({ ...prevState, picLoading: false }));
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h3>Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={name}
              onChange={(e) =>
                setFormState((prevState) => ({ ...prevState, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setFormState((prevState) => ({ ...prevState, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setFormState((prevState) => ({ ...prevState, password: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  confirmPassword: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="profile-picture">Upload a Picture</label>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" disabled={picLoading}>
              {picLoading ? "Uploading..." : "Sign Up"}
            </button>
          </div>
          <div>
            Have an account?{" "}
            <span
              onClick={() => navigate("/")}
              style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
            >
              Login
            </span>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;







/*
import { useEditable } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SignUp = () => {
  const navigate = useNavigate();

  // State variables for each form field
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setProfilePicture] = useState(null);
  const [picLoading, setPicLoading] = useState(false);

  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match!");
      return;
    }
    if (!password || !email || !name) {
      toast.warning("Pls enter all feilds!");
      return;
    }
    // Log form data for now
    console.log({
      name,
      email,
      password,
      pic,
    });

    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/user",
        {
          name,
          email,
          password,
          pic: pic || undefined,
        },
        config
      );
toast.success("You Are Successfully Signup")
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (err) {
      console.log(err + "4455");
    }

    // Clear form after submission
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setProfilePicture(null);

    // Redirect after successful form submission (for now)
  };
  
  // Handle image upload
  const handleImageChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  // Function to upload the image to Cloudinary
  const uploadImageToCloudinary = async (pics) => {
    setPicLoading(true);

    if (pics === undefined) {
      toast.warning("Please Select an Image!");
      setPicLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const formData = new FormData();
      formData.append("file", pics);
      formData.append("upload_preset", "chat-app"); // Your upload preset
      formData.append("cloud_name", "piyushproj"); // Your Cloudinary cloud name

      // Make the upload request
      try {
        const res = await fetch(
          // "https://api.cloudinary.com/v1_1/ddpunpqre/image/upload",
          "https://api.cloudinary.com/v1_1/piyushproj/image/upload",
          {
            method: "post",
            body: formData,
          }
        );
        const data = await res.json();
        const imageUrl = data.secure_url; // Image URL from Cloudinary
        setProfilePicture(imageUrl); // Set the image URL in state
        console.log(imageUrl);
        setPicLoading(false);
      } catch (err) {
        console.error(err);
        toast.error(
          "Error Uploading Image! There was an error uploading your image."
        );
        setPicLoading(false);
      }
    } else {
      toast.error("Invalid File Type. Please select a JPEG or PNG image.");
      setPicLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h3>Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="profile-picture">Upload a Picture</label>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={(e) => uploadImageToCloudinary(e.target.files[0])}
            />
          </div>
          <div className="form-group">
            <button type="submit" disabled={picLoading}>
              {picLoading ? "Uploading..." : "Sign Up"}
            </button>
          </div>
          <div>
             have an account{" "}
                <span
                  onClick={() => navigate("/")}
                  style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                >
                 Login
                </span>
              </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
*/