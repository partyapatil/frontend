import "./App.css";
import { Route, Routes } from 'react-router-dom';
import Signup from "./pages/Signup";

import ChatPage from "./Otherpages/ChatPage";
import Login from "./pages/Login";
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