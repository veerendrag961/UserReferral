import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ReferredUsersList from './ReferredUsersList';
import { SignUp } from './SignUp';

const useStyles = makeStyles((theme) => ({
  rootRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'left',
    height: '20vh',
    paddingRight: '50px'
  },
  rootLeft: {
    paddingBottom: '150px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'left',
    height: '20vh',
    maxWidth: '400px'
  },
  pColor: {
    color: 'red'
  }
}));

const Home = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [referralUser, setReferralUser] = useState('');
  const [referredUsers, setReferredUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const classes = useStyles();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const fetchData = async () => {
      if (storedToken) {
        setToken(storedToken);
        try {
          const userDataResponse = await fetchUserData(storedToken);
          const referredUsersResponse = await fetchReferredUsers(storedToken);
          setUser(userDataResponse.user);
          setReferredUsers(referredUsersResponse.referrals);
        } catch (error) {
          console.error(error);
          setUser(null);
          localStorage.removeItem('token');
        }
      }
    };
    fetchData();
  }, []);

  const fetchUserData = async (storedToken) => {
    const response = await fetch('http://localhost:3000/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${storedToken}`
      }
    });
    if (!response.ok) {
      throw new Error('User fetch failed');
    }
    return await response.json();
  };

  const fetchReferredUsers = async (storedToken) => {
    const response = await fetch('http://localhost:3000/referrals/referral_users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${storedToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch referred users');
    }
    return await response.json();
  };

  const handleReferralUserChange = (e) => {
    setReferralUser(e.target.value);
  };

  const handleLoginSuccess = async (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
    setToken(userData.token);
  
    try {
      const referredUsersResponse = await fetchReferredUsers(userData.token);
      setReferredUsers(referredUsersResponse.referrals);
    } catch (error) {
      console.error('Error fetching referred users:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setToken(null);
    setReferredUsers([]);
  };

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error('Token is not available');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(referralUser)) {
      setErrorMessage("Invalid email format");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/referrals/send_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: referralUser })
      });
      if (!response.ok) {
        setErrorMessage("Failed to send referral");
        throw new Error('Failed to send referral');
      }
      setErrorMessage("");
      const referredUsersResponse = await fetchReferredUsers(token);
      setReferredUsers(referredUsersResponse.referrals);
      setReferralUser('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {user && (
        <>
        <Box className={classes.rootRight}>
          <Typography variant="h4">
            <Typography gutterBottom align="right">
              Welcome, {user.email}
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Typography>
        </Box>
  
        <Box className={classes.rootLeft}>
          <form onSubmit={handleReferralSubmit}>
            <TextField
              label="Enter Email for Referral"
              type="email"
              value={referralUser}
              onChange={handleReferralUserChange}
              fullWidth
              margin="normal"
              required
            />
            {errorMessage && <p className={classes.pColor}>{errorMessage}</p>}
            <Button type="submit" variant="contained" color="primary">
              Send Referral
            </Button>
          </form>
        </Box>

        <ReferredUsersList key={referredUsers.length} referredUsers={referredUsers} />
        </>
        )}

      {!user && <SignUp handleLoginSuccess={handleLoginSuccess} />}
    </>
  );
};

export default Home;
