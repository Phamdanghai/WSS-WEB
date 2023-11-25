import { PrivateRoutes } from '@/components'
import { AccountInfo, Cart, Contact, Home, Introduce, Login, OrderHistory, Package, Service } from '@/pages'

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import { AuthProvider } from '@/context/AuthContext'
import Checkout from './pages/Checkout'
import OrderDetail from './pages/OrderDetail'
import DetailPackage from './pages/Package/Detail'
import DetailService from './pages/Service/Detail'
import PublicRoutes from './components/PublicRoutes'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route element={<Home />} path='/' />
            <Route element={<Introduce />} path='/introduce' />
            <Route element={<Service />} path='/service' />
            <Route element={<DetailService />} path='/service/:id' />
            <Route element={<Package />} path='/package' />
            <Route element={<DetailPackage />} path='/package/:id' />
            <Route element={<Contact />} path='/contact' />
            <Route element={<Cart />} path='/cart' />
          </Route>
          <Route element={<PrivateRoutes />}>
            <Route element={<Checkout />} path='/checkout/:id' />
            <Route element={<AccountInfo />} path='/account-info' />
            <Route element={<OrderHistory />} path='/order-history' />
            <Route element={<OrderDetail />} path='/order-history/:id' />
          </Route>
          <Route element={<Login />} path='/login' />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
