import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/user/HomePage'
import FeedPage from './pages/user/FeedPage'
import DetailFeedPage from './pages/user/DetailFeedPage'
import HistoryPage from './pages/user/HistoryPage'
import VirtualTourPage from './pages/user/VirtualTourPage'
import VisiMisiPage from './pages/user/VisiMisiPage'
import ProfilePage from './pages/user/ProfilePage'
import HeadSpeechPage from './pages/user/HeadSpeechPage'
import LoginPage from './pages/admin/LoginPage'
import ManageFeedPage from './pages/admin/ManageFeedPage'
import ManagePanoramaPage from './pages/admin/ManagePanoramaPage'
import LayoutAdmin from './components/admin/LayoutAdmin'
import DashboardPage from './pages/admin/DashboardPage'
import ManageTeachersPage from './pages/admin/ManageTeachersPage'
import ManageUserPage from './pages/admin/ManageUserPage'
import RequireAuth from './components/auth/RequireAuth'
import Layout from './components/Layout'

import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="login-admin" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="postingan" element={<FeedPage />} />
        <Route path="postingan/:id" element={<DetailFeedPage />} />
        <Route path="sejarah-sekolah" element={<HistoryPage />} />
        <Route path="virtual-tour" element={<VirtualTourPage />} />
        <Route path="visi-misi" element={<VisiMisiPage />} />
        <Route path="sambutan-kepala-sekolah" element={<HeadSpeechPage />} />
        <Route path="profil-sekolah" element={<ProfilePage />} />
      </Route>
      {/* <Route element={<RequireAuth allowedRoles={['admin', 'superadmin']} />}> */}
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="posts" element={<ManageFeedPage />} />

        {/* Superadmin Only */}
        <Route element={<RequireAuth allowedRoles={['superadmin']} />}>
          <Route path="users" element={<ManageUserPage />} />
          <Route path="panorama" element={<ManagePanoramaPage />} />
          <Route path="teacher" element={<ManageTeachersPage />} />
        </Route>
      </Route>
      {/* </Route> */}

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes >
  )
}

export default App
