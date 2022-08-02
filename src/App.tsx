import './App.css'
import reactLogo from './assets/react.svg'
import Pages from './pages/index'
import 'antd/dist/antd.css'
function App() {
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>在线计算</h1>
      <Pages />
    </div>
  )
}

export default App
