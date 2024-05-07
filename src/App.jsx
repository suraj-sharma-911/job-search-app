import { Provider } from 'react-redux'
import './App.css'
import Dashboard from './components/Dashboard'
import store from './redux/store'; // Your Redux store


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <Dashboard />
      </Provider>
    </>
  )
}

export default App
