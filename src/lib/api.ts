const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const getToken = () => localStorage.getItem('token')

export const api = {
  register: async (username: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return res.json()
  },

  login: async (username: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return res.json()
  },
  
  getDoc: async (id: string) => {
    const res = await fetch(`${BASE_URL}/docs/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    return res.json()
  },

  getDocs: async () => {
    const res = await fetch(`${BASE_URL}/docs`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    return res.json()
  },

  createDoc: async (id: string, name: string) => {
    const res = await fetch(`${BASE_URL}/docs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ id, name }),
    })
    return res.json()
  },

  updateDoc: async (id: string, content: any) => {
    const res = await fetch(`${BASE_URL}/docs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ content }),
    })
    return res.json()
  },

  deleteDoc: async (id: string) => {
    const res = await fetch(`${BASE_URL}/docs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    return res.json()
  },
}
