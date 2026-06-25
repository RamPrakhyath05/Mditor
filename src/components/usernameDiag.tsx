'use client'

import React, { useState } from 'react'
import { api } from '@/lib/api'

interface AuthDialogProps {
  onAuth: (username: string) => void
}

const AuthDialog: React.FC<AuthDialogProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Both fields are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = isLogin
        ? await api.login(username, password)
        : await api.register(username, password)

      if (res.error) {
        setError(res.error)
        return
      }

      if (isLogin) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('username', res.username)
        onAuth(res.username)
      } else {
        // After register, auto login
        const loginRes = await api.login(username, password)
        if (loginRes.error) {
          setError(loginRes.error)
          return
        }
        localStorage.setItem('token', loginRes.token)
        localStorage.setItem('username', loginRes.username)
        onAuth(loginRes.username)
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-lg w-80 shadow-lg text-white">
        <h2 className="text-lg font-semibold mb-4">
          {isLogin ? 'Login to Mditor' : 'Create an Account'}
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 mb-3 text-white outline-none"
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 mb-4 text-white outline-none"
          placeholder="Password"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 p-2 rounded transition disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
        </button>

        <p
          className="text-center text-sm text-gray-400 mt-3 cursor-pointer hover:text-white transition"
          onClick={() => { setIsLogin(!isLogin); setError('') }}
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  )
}

export default AuthDialog
