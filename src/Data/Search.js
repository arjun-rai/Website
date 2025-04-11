import React, { useState, useEffect } from 'react';
import CustomNavbar from './components/Navbar';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Search() {
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem('profile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          setProfile(res.data);
          localStorage.setItem('profile', JSON.stringify(res.data))
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div className="main">
      <CustomNavbar login={login} profile={profile} setProfile={setProfile} />
      {/* Rest of the Search page content */}
    </div>
  );
} 