import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import RoutesApp from './routes';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/auth';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RoutesApp />
        <ToastContainer autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


