import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";
import Hero from "./components/hero";
import ProtectedRoute from "./components/protectedRoutes";
import { AuthProvider } from "./utils/authContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Hero/>} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App