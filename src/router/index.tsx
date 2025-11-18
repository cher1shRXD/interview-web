import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Interview from '../pages/Interview'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/interview' element={<Interview />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router