import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // Corrected this line
import { ChakraProvider } from "@chakra-ui/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ChatProvider from "./context/ChatProvider";
import { Provider } from "react-redux";
import store from "./Store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 
    <BrowserRouter>
      <Provider store={store}>
        <ChatProvider>
          <App/>
        </ChatProvider></Provider>
    </BrowserRouter>

);
