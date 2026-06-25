'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import TopBar from '../components/Topbar'
import Editor from '../components/Tiptap'
import AuthDialog from '../components/usernameDiag'
import { useDocStore } from '@/store/docStore'
import { api } from '@/lib/api'

export default function Home() {
  const { docName, setDocName, setDocList } = useDocStore()
  const [username, setUsername] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUsername = localStorage.getItem('username')
    if (token && savedUsername) {
      setUsername(savedUsername)
      api.getDocs().then((docs) => {
        if (Array.isArray(docs)) {
          const names = docs.map((d: any) => d.name)
          setDocList(names)
        }
      })
    } else {
      setShowDialog(true)
    }
  }, [])

  const handleAuth = (name: string) => {
    setUsername(name)
    setShowDialog(false)
  }

  // Load doc from URL query param
  useEffect(() => {
    const docFromURL = searchParams.get('doc')
    if (docFromURL) {
      setDocName(docFromURL)
      localStorage.setItem('last-used-doc', docFromURL)
    }
  }, [searchParams, setDocName, setDocList])

  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-[#121212]">
      {showDialog && <AuthDialog onAuth={handleAuth} />}
      <TopBar username={username} />
      <div className="flex-1 overflow-hidden relative">
        <Editor username={username} />
      </div>
    </div>
  )
}
