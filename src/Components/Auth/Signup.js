import React, { useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async e => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Check your inbox for the magic link!')
  }

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
