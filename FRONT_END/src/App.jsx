import axios from 'axios'
import { useState, useEffect } from 'react'



function App() {

  const [body, setBody] = useState('')

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/')
    .then((res) => {
      console.log(res)
      setBody(res.data.Hello)
    }).catch((e) => console.log(e))
  },[])

  return (
    <>
      <div>
        {body}
      </div>
    </>
  )
}

export default App
