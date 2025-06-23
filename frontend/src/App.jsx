import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import VideoCallPage from "./pages/VideoCallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import themeStore from "./lib/themeStore.js";
import ThemesPage from "./pages/ThemesPage.jsx";

const App = () => {
  const {authUser, isLoading, error} = useAuthUser();
  const {theme} = themeStore();

  const isAuthenticated = Boolean(authUser);
  const hasCompletedProfile = authUser?.hasCompletedProfile;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>

        <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} />

        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />

        <Route path="/profile" element={isAuthenticated ? (
          !hasCompletedProfile ? <ProfilePage /> :
            <Layout showSidebar={true}> 
              <ProfilePage /> 
            </Layout>
        ): <Navigate to="/login" />} />

        <Route path="/" element={isAuthenticated && hasCompletedProfile ? (
          <Layout showSidebar={true}> 
            <HomePage /> 
          </Layout>
        ): <Navigate to={
          isAuthenticated ? "/profile" : "/login"
        } />} />

        <Route path="/chat/:id" element={isAuthenticated && hasCompletedProfile ? (
            <Layout>
              <ChatPage /> 
            </Layout>
          ): (
            <Navigate to={
              isAuthenticated ? "/profile":'/login'
            } />
          )} />

        <Route path="/videocall/:id" element={isAuthenticated && hasCompletedProfile ? (
          <VideoCallPage /> ) : ( 
            <Navigate to={ 
              isAuthenticated ? "/profile" : "/login"
            } />
          )} />

        <Route path="/notifications" element={isAuthenticated && hasCompletedProfile ? (   
            <Layout showSidebar={true}>
              <NotificationsPage /> 
            </Layout>
          ) : (
            <Navigate to={ 
              isAuthenticated ? "/profile" : "/login"
            } />
          )} />        
        <Route path='/themes' element={isAuthenticated && hasCompletedProfile ? (
          <Layout showSidebar={true}> 
            <ThemesPage /> 
          </Layout>
        ) : (
          <Navigate to={
          isAuthenticated ? "/profile" : "/login"
        } />
        )} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App;