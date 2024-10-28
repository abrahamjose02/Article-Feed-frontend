
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import Signup from './pages/Signup'
import Verification from './pages/Verification'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import CreateArticle from './pages/CreateArticle'
import ArticleList from './pages/ArticleList'
import EditArticle from './pages/EditArticle'
import PrivateRoute from './components/PrivateRoute'
import { useEffect } from 'react'
import { refreshAccessToken } from './utils/authUtils'


const App = () => {
  
  return (
    <div>
      <Toaster position='top-center'/>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/verification' element={<Verification/>}/>
          <Route path='/login' element= {<Login/>}/>
        <Route element={<PrivateRoute/>}>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/create-article' element={<CreateArticle/>}/>
        <Route path='/my-articles' element={<ArticleList/>}/>
        <Route path='/edit-article/:articleId' element={<EditArticle/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
