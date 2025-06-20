import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage';  // ← index.tsx が自動で読み込まれる
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import EventDetailPage from './pages/EventDetailPage';
import TopPage from './pages/TopPage';
import EventCreatePage from './pages/EventCreatePage';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth'


function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/events/token/:token" element={<EventDetailPage />} />

            <Route path="/top" element={
              <RequireAuth>
                <TopPage />
              </RequireAuth>
            } />
            <Route path="/events/new" element={
              <RequireAuth>
                <EventCreatePage />
              </RequireAuth>
            } />
            {/* <Route path="/events/:token" element={<EventDetailPage />} /> */}
            {/* <Route path="/events/:token/edit" element={<EventEditPage />} /> */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
