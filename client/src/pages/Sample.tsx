import { useState } from 'react'
// import reactLogo from ''
// import viteLogo from ''
import '../App.css'
import ImagesSlide from '../components/HorizontalImageSlider'
import NavBar from '../components/NavBar'
function Sample() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <NavBar />
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome to the Sample Page</h1>
      </div>
    </div>
  )
}

export default Sample
