import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Chat() {

  const { friend } = useParams()
  const user_email = localStorage.getItem('user')
  const [info , setInfo] = useState({})
  const [message , setMessage] = useState('')

  const fetchChat = async () => {
    try{
      const response = await fetch('http://localhost:5000/Chat' , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user_email , friend}),
      })
      const data = await response.json()
      if(!response.ok){
        return alert(data.message)
      }
      setInfo(data)
    }
    catch(error){
      console.log(error)
      alert('Could not fetch the chat')
    }
  }
  
  useEffect(() => {

    fetchChat()

  } , [])


  const handleSubmit = async (e) => {

    if(e.keyCode == 13){
      e.preventDefault()

      try{

        const friend_user = info.friend_user
        const id = info.id

        const response = await fetch('http://localhost:5000/addMessage' , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({friend_user , user_email , message , id}),
        })

        const data = await response.json()
        if(!response.ok){
          return alert(data.message)
        }
        console.log(data)
        window.location.reload()

      }
      catch(error){
        console.log(error)
      }

    }

  }

  


  return (
    <div className='mt-5 bg-dark-subtle container py-4 border border-warning'>
      <div className='container text-center'>
        <h1 className='text-warning-emphasis'>Chat with {info.friend_user ? info.friend_user.name : ''}</h1>
      </div> 
      <div className='mt-5 scrollable-div overflow-auto ' style = {{"height" : "335px"}}>
        {info.chat_array && info.chat_array.map((msg , index) => (
          <div className="card w-25 mt-2 mx-auto text-center" key={index}>
          <div className="card-body">
            <h5 className="card-title text-danger-emphasis">{msg.body}</h5>
            <a className='text-secondary small' href={'http://localhost:3000/profile/' + msg.sender.email}>{msg.sender.name}</a>
          </div>
        </div>
        ))
        }
      </div>
        <div className='mt-5 bg-warning-subtle col-6 mx-auto'>
          <input className='form-control' placeholder='Type your message and press enter...' onChange={(e) => setMessage(e.target.value)} onKeyDown={handleSubmit}></input>
        </div>
    </div>
  )
}
