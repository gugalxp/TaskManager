import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import { parseCookies } from 'nookies';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { signIn, userAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const { "@todoList": token } = parseCookies();
    if (token && userAuth) {
      navigate('/home');
    }
  }, [userAuth, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await signIn(formData.email, formData.password);

    if (response) {
      navigate('/home');
    }

  };


  return (
    <div style={{
      maxWidth: '400px',
      margin: 'auto',
      marginTop: '50px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <h2 style={{ textAlign: 'center' }}>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#007bff', color: 'white', border: 'none' }}>Entrar</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Link to="/" style={{ color: '#8758ff', textDecoration: 'underline' }}>Ainda não tem uma conta? Cadastre-se aqui</Link>
      </div>
    </div>
  );
};

export default SignIn;
