import { Navigate, BrowserRouter, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth';
import Profile from './pages/Profile';
import Show from './pages/show';
import { userAppStore } from './Store';
import Chat from './pages/chat/chat';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_INFO } from './utils/constants';

const PrivateRoute = ({ children }) => {
  const { userinfo } = userAppStore();
  const isAuthenticated = !!userinfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userinfo } = userAppStore();
  const isAuthenticated = !!userinfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userinfo, setUserInfo } = userAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(USER_INFO, { withCredentials: true });
        if (response.data) {
          setUserInfo(response.data);
        }
        if(response.status===200 && response.data.id){
          setUserInfo(response.data);
        }
        else{
          setUserInfo(undefined)
        }
      } catch (error) {
        setUserInfo(undefined)
        console.log({ error });
      } finally {
        setLoading(false);
      }
    };

    if (!userinfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userinfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="/show" element={<Show />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
