
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import Signup from './pages/Signup'

const App = () => {
  return (
    <div>
      <Toaster position='top-center'/>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </div>
  )
}

export default App
