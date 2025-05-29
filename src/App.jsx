
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import LoginForm from './pages/LoginForm';



function AppContent() {
  const { user } = useAuth();

  return user ? <Home /> : <LoginForm />;
}
function App() {
  return (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
  )
}

export default App
