import { Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import ChatPage from "./pages/chat-page";
import LoginPage from "./pages/login-page";
import SettingPage from "./pages/setting-page";
import SignupPage from "./pages/signup-page";
//import "./App.css";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Menu />}>
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/setting' element={<SettingPage />} />
          <Route path='/sign-up' element={<SignupPage />} />
        </Route>
      </Routes>
    </div>
  );
}
