import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './routes/Home'; // ✅ Changed from Hero to Home
import Register from './routes/Register';
import Profile from './routes/Profile';
import CreatorStudio from './routes/CreatorStudio';
import CreatorPage from './routes/creatorpage';
import JessSession from './routes/JessSession';
import BookCreator from './routes/BookCreator';
import CreatorEarnings from './routes/CreatorEarnings';
import UserDashboard from './routes/UserDashboard';
import CreatorDashboard from './routes/CreatorDashboard';
import AdminDashboard from './routes/AdminDashboard';
import GuestDemo from './routes/GuestDemo';
import RoomsPage from './routes/RoomsPage'; // ✅ Added RoomsPage

function App() {
  return (
    <BrowserRouter 
      future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/jess-session" element={<JessSession />} />
        <Route path="/chat" element={<JessSession />} />
        <Route path="/try" element={<GuestDemo />} />
        <Route path="/creators" element={<BookCreator />} />
        <Route path="/rooms" element={<RoomsPage />} /> {/* ✅ Added Rooms Route */}
        
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['creator']} />}>
          <Route path="/creator" element={<CreatorPage />} />
          <Route path="/creator-studio" element={<CreatorStudio />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/earnings" element={<CreatorEarnings />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
