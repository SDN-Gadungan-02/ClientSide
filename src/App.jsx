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
import HeadSpeechPage from './pages/user/HeadSpeechPage'
import LoginPage from './pages/admin/LoginPage'
import ManageFeedPage from './pages/admin/ManageFeedPage'
import ManagePanoramaPage from './pages/admin/ManagePanoramaPage'
import LayoutAdmin from './components/admin/LayoutAdmin'
import DashboardPage from './pages/admin/DashboardPage'
import ManageProfilePage from './pages/admin/ManageProfilePage'
import ManageUserPage from './pages/admin/ManageUserPage'
import RequireAuth from './components/auth/RequireAuth'
import Layout from './components/user/Layout'

import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="postingan" element={<FeedPage />} />
        <Route path="postingan/:id" element={<DetailFeedPage />} />
        <Route path="sejarah-sekolah" element={<HistoryPage />} />
        <Route path="virtual-tour" element={<VirtualTourPage />} />
        <Route path="visi-misi" element={<VisiMisiPage />} />
        <Route path="sambutan-kepala-sekolah" element={<HeadSpeechPage />} />
      </Route>
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route
          path="posts"
          element={
            <RequireAuth allowedRoles={['admin', 'superadmin']}>
              <ManageFeedPage path="posts" />
            </RequireAuth>
          }
        />

        {/* Hanya superadmin yang bisa akses route berikut */}
        <Route
          path="dashboard"
          element={
            <RequireAuth allowedRoles={['superadmin']} >
              <DashboardPage path="dashboard" />
            </RequireAuth>
          }
        />
        <Route
          path="users"
          element={
            <RequireAuth allowedRoles={['superadmin']} >
              <ManageUserPage path="users" />
            </RequireAuth>
          }
        />
        <Route
          path="profile"
          element={
            <RequireAuth allowedRoles={['superadmin']} >
              <ManageProfilePage path="profile" />
            </RequireAuth>
          }
        />
        <Route
          path="panorama"
          element={
            <RequireAuth allowedRoles={['superadmin']} >
              <ManagePanoramaPage path="panorama" />
            </RequireAuth>
          }
        />
      </Route >

      {/* Fallback Route */}
      <Route path="*" element={< Navigate to="/" replace />} />
    </Routes >
  )
}

export default App