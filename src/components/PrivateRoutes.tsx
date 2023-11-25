import { useAuth } from '@/context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'
import Layout from './Layout'

const PrivateRoutes = () => {
  const { user } = useAuth()
  const auth = { token: !!user }
  return auth.token ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to='/login' />
  )
}

export default PrivateRoutes
