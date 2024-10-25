
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import Signup from './pages/Signup'
import Verification from './pages/Verification'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'

const App = () => {
  return (
    <div>
      <Toaster position='top-center'/>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/verification' element={<Verification/>}/>
        <Route path='/login' element= {<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/settings' element={<Settings/>}/>
      </Routes>
    </div>
  )
}

export default App
