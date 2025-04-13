import React from 'react'
import {ConfigProvider} from 'antd'
import logo from './logo.svg'
import './App.css'
import {BrowserRouter} from 'react-router-dom'
import Routers from './routers/Routers'
import 'react-quill/dist/quill.snow.css'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {},
        components: {},
      }}
    >
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
