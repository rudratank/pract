import { Navigate,BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Show from './pages/show'

function App() {


  return (
    <BrowserRouter>
        <Routes>
            <Route path='/Auth' element={<Auth/>}></Route>
            <Route path='/show' element={<Show/>}></Route>
            <Route path='/Auth' element={<Auth/>}></Route>
            <Route path="*" element={<Navigate to="/Auth" />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
