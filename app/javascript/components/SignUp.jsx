import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Link, Snackbar, Alert } from '@mui/material';

export const SignUp = ({ handleLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isSignIn) {
      try {
        const response = await fetch('http://localhost:3000/users/sign_in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "user": { email, password }}),
        });
        if (!response.ok) {
          throw new Error('Sign in failed');
        }
        const data = await response.json();
        handleLoginSuccess(data);
      } catch (error) {
        setError('Sign in failed');
        console.error(error);
      }
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "user": { email, password, password_confirmation: confirmPassword }}),
        });
        if (!response.ok) {
          throw new Error('Sign up failed');
        }
        handleSignupSuccess();
        const data = await response.json();
        handleLoginSuccess(data);
      } catch (error) {
        setError('Sign up failed');
        console.error(error);
      }
    }
  };

  const handleSignupSuccess = () => {
    setSignupSuccess(true);
    setTimeout(() => {
      setSignupSuccess(false);
      setIsSignIn(true); // After signup success, switch to login form
    }, 3000);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleFormSwitch = () => {
    setError('');
    setIsSignIn(!isSignIn);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        {isSignIn ? 'Sign In' : 'Sign Up'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
          required
        />
        {!isSignIn && (
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            fullWidth
            margin="normal"
            required
            error={password !== confirmPassword}
            helperText={password !== confirmPassword && 'Passwords do not match'}
          />
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
      {error && (
        <Typography variant="body1" color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}
      <Typography variant="body1" align="center">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}
        <Link component="button" onClick={handleFormSwitch} color="primary">
          {isSignIn ? 'Sign Up' : 'Sign In'}
        </Link>
      </Typography>
      <Snackbar open={signupSuccess} autoHideDuration={3000} onClose={() => setSignupSuccess(false)}>
        <Alert onClose={() => setSignupSuccess(false)} severity="success">
          Sign up successful. You can now sign in.
        </Alert>
      </Snackbar>
    </Container>
  );
};
