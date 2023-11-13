import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import { parseCookies } from 'nookies';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmedPassword: '' });
  const navigate = useNavigate();
  const { userAuth, signUp } = useContext(AuthContext);

  useEffect(() => {
    const { "@todoList": token } = parseCookies();
    if (token && userAuth) {
      navigate('/home');
    }
  }, [userAuth, navigate]);

  const HandleSignUp = async (e) => {
    e.preventDefault();

    const response = await signUp(formData.email, formData.password, formData.confirmedPassword, formData.name)
    if (response) {
      navigate('/login');
    }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
      <form onSubmit={HandleSignUp}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
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
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmedPassword"
            value={formData.confirmedPassword}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#007bff', color: 'white', border: 'none' }}>Cadastrar</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Link to="/login" style={{ color: '#8758ff', textDecoration: 'underline' }}>Já tem uma conta? Faça login aqui</Link>
      </div>
    </div>
  );
};

export default SignUp;
