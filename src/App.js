import "./App.css";
import { Route, Routes } from 'react-router-dom';
import Signup from "./pages/Signup";
import { Provider } from "react-redux"; // Import Provider from react-redux

import ChatPage from "./Otherpages/ChatPage";
import Login from "./pages/Login";
import store from "./Store/store";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <div className="App">
    


      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/chats" element={<ChatPage/>} />
        
      </Routes>
      <ToastContainer/>

    </div>
  );
}

export default App;




// pppatil@gmail.com
// 11111111