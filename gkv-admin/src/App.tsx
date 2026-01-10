import React from "react";
import { ConfigProvider } from "antd";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Routers from "./routers/Routers";
import "react-quill/dist/quill.snow.css";

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
