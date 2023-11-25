import { ConfigProvider } from 'antd'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { theme } from './config'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
)
