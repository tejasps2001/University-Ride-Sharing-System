import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.profilePicture) {
      setError('Profile picture is required.');
      return;
    }
    setLoading(true);
    try {
      // Simulate file upload (in real app, use FormData and backend support)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const profilePicture = reader.result;
        const res = await axios.post('http://localhost:5000/api/register', {
          name: form.name,
          studentId: form.studentId,
          email: form.email,
          password: form.password,
          profilePicture,
        });
        setSuccess(res.data.message);
      };
      reader.readAsDataURL(form.profilePicture);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
        <input name="studentId" placeholder="Student ID" value={form.studentId} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
        <input name="email" type="email" placeholder="University Email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
        <input name="profilePicture" type="file" accept="image/*" onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
      </form>
    </div>
  );
};

export default Register;
