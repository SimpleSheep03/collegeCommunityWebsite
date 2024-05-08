import React, { useEffect, useState } from 'react'

export default function NewChat() {

  const user_email = localStorage.getItem('user')
  const [search , setSearch] = useState('')
  const [users , setUsers] = useState([])
  const [newUsers , setNewUsers] = useState([])

  useEffect(() => {

    const defaultSearch = async () => {

      const search = ''

      try{
        const response = await fetch('http://localhost:5000/findExistingUsers',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({user_email , search}),
        })
        const data  = await response.json()
        if(!response.ok){
          return alert(data.message)
        }
        console.log(data)
        setUsers(data.users)
      }
      catch(error){
        console.log(error)
        alert(`Could not retrieve users to talk to...`)
      }
    }

    defaultSearch()

  } ,[])

  const handleSearch = async (e) =>{

    if(e.keyCode == 13){

      e.preventDefault()

        try{
          const response = await fetch('http://localhost:5000/findNewUsers',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_email , search}),
          })
          const data  = await response.json()
          if(!response.ok){
            return alert(data.message)
          }
          console.log(data)
          setNewUsers(data.users)
        }
        catch(error){
          console.log(error)
          alert(`Could not retrieve users to talk to...`)
        }
      }
  }

  console.log(users)


  return (
    <div className='mt-5 bg-dark-subtle container py-4 border border-warning'>
      <div className='container text-center'>
        <h1 className='text-warning-emphasis'>Search user to chat with</h1>
      </div>
      <div className='mt-5 col-5 mx-auto'>
      <input className="form-control  text-center" type="search" id='searchInput' placeholder="Enter user..." aria-label="Search"  onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch}/>
      </div>
      <div className='mt-5 d-flex text-center'>
      {newUsers.map((user) => (
                    <div className="card mx-auto border-warning" style={{ width: '18rem', margin: '10px' }} key={user._id}>
                        <img src={user.photoURL} className="card-img-top" alt="profilePhoto"/>
                        <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.about}</p>
                        <a href={`/Chat/${user.email}`} className="btn btn-outline-dark">Chat</a>
                        </div>
                    </div>
                ))}
      </div>
      {users.length > 0 && <h3 className='text-danger-emphasis text-center mt-5'>Recent chats with...</h3>}
      <div className='mt-4 d-flex text-center'>
      {users.map((user) => (
                    <div className="card mx-auto border-warning" style={{ width: '18rem', margin: '10px' }} key={user._id}>
                        <img src={user.photoURL} className="card-img-top" alt="profilePhoto"/>
                        <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.about}</p>
                        <a href={`/Chat/${user.email}`} className="btn btn-outline-dark">Chat</a>
                        </div>
                    </div>
                ))}
      </div>
    </div>
  )
}
