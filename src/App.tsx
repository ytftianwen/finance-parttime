import 'antd/dist/antd.css'
import './App.css'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import Pages from './pages/index'
function App() {
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
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
