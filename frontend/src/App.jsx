import { Routes, Route } from 'react-router-dom'

function Home() {
  return <h1>Home</h1>
}

function Productos() {
  return <h1>Productos</h1>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Productos />} />
    </Routes>
  )
}

export default App