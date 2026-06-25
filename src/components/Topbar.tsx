'use client'

import React, { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { useDocStore } from '@/store/docStore'
import { HiOutlinePlusCircle } from 'react-icons/hi'
import { FiX, FiTrash, FiFolder } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

const TopBar = ({ username }: { username: string | null }) => {
  const router = useRouter()
  const { docList, docName, setDocName, addToDocList, setDocList } = useDocStore()
  const isCreating = useRef(false)
  const hasFetched = useRef(false)
  const [allDocs, setAllDocs] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!username) return
    if (hasFetched.current) return
    hasFetched.current = true

    api.getDocs().then((docs) => {
      if (Array.isArray(docs)) {
        const names = docs.map((d: any) => d.name)
        setDocList(names)
        setAllDocs(names)
      }
    })
  }, [username])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCreateNewFile = async () => {
    if (isCreating.current) return
    isCreating.current = true

    const newDocName = `doc-${nanoid(7)}`
    try {
      await api.createDoc(newDocName, newDocName)
      setDocName(newDocName)
      addToDocList(newDocName)
      setAllDocs((prev) => [...new Set([...prev, newDocName])])
      localStorage.setItem('last-used-doc', newDocName)
      router.replace(`/?doc=${newDocName}`)
    } catch (err) {
      console.error('Error creating doc:', err)
    } finally {
      isCreating.current = false
    }
  }

  const handleClose = (file: string) => {
    const updatedList = docList.filter((item) => item !== file)
    setDocList(updatedList)
    if (docName === file) {
      setDocName(updatedList.length ? updatedList[0] : null)
      localStorage.setItem('last-used-doc', updatedList[0] || '')
    }
  }

  const handleDelete = async (file: string) => {
    try {
      await api.deleteDoc(file)
      const updatedList = docList.filter((item) => item !== file)
      setDocList(updatedList)
      setAllDocs((prev) => prev.filter((d) => d !== file))
      if (docName === file) {
        setDocName(updatedList.length ? updatedList[0] : null)
        localStorage.setItem('last-used-doc', updatedList[0] || '')
      }
    } catch (err) {
      console.error('Error deleting doc:', err)
    }
  }

  const handleOpen = (file: string) => {
    if (!docList.includes(file)) {
      addToDocList(file)
    }
    setDocName(file)
    localStorage.setItem('last-used-doc', file)
    router.replace(`/?doc=${file}`)
    setShowDropdown(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('last-used-doc')
    setDocList([])
    setDocName(null)
    router.push('/')
    window.location.reload()
  }

  return (
    <div className="w-full bg-[#1e1e1e] flex items-center px-3 h-[5%] border-b border-[#333]">

      {/* Logo + Folder */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          className="flex items-center -translate-y-9 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <img
            src="/logo.svg"
            alt="Mditor Logo"
            width={120}
            height={20}
            className="object-contain"
          />
        </button>

        {/* Folder icon + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="text-gray-400 hover:text-green-400 transition"
            title="All files"
          >
            <FiFolder size={18} />
          </button>

          {showDropdown && (
            <div className="absolute left-0 top-7 w-56 bg-[#2a2a2a] border border-[#444] rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
              {allDocs.length === 0 ? (
                <p className="text-gray-400 text-sm p-3">No files yet</p>
              ) : (
                allDocs.map((file, index) => (
                  <div
                    key={index}
                    onClick={() => handleOpen(file)}
                    className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition
                      ${docList.includes(file)
                        ? 'text-gray-500 hover:bg-[#333]'
                        : 'text-gray-200 hover:bg-[#3a3a3a]'
                      }`}
                  >
                    <span className="truncate">{file}</span>
                    {docList.includes(file) && (
                      <span className="text-xs text-gray-600 ml-2 flex-shrink-0">open</span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="ml-6 flex items-center gap-2 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
        {docList.map((file, index) => (
          <div
            key={index}
            className={`flex items-center gap-1 px-3 rounded-xl cursor-pointer text-m transition-all py-2
              ${docName === file
                ? 'bg-[#2d2d2d] text-white border-2 border-[#008800]'
                : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
              }`}
            onClick={() => {
              setDocName(file)
              localStorage.setItem('last-used-doc', file)
              router.replace(`/?doc=${file}`)
            }}
          >
            <span className="truncate max-w-[100px]">{file}</span>

            {/* Close — removes from UI only */}
            <button
              className="text-gray-400 hover:text-yellow-400 transition ml-1"
              title="Close tab"
              onClick={(e) => {
                e.stopPropagation()
                handleClose(file)
              }}
            >
              <FiX size={12} />
            </button>

            {/* Delete — removes from backend too */}
            <button
              className="text-gray-400 hover:text-red-500 transition ml-1"
              title="Delete permanently"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(file)
              }}
            >
              <FiTrash size={12} />
            </button>
          </div>
        ))}

        {/* Add New Tab */}
        <button
          onClick={handleCreateNewFile}
          className="ml-1 flex items-center gap-1 text-gray-300 hover:text-green-400 transition"
          title="New File"
        >
          <HiOutlinePlusCircle size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <span className="text-white">{username || 'Anonymous'}</span>
        <button
          onClick={() => {
            if (docName) {
              const shareURL = `${window.location.origin}/?doc=${docName}`
              navigator.clipboard.writeText(shareURL)
              alert('URL copied! Share it with your friend 🎉')
            }
          }}
          className="text-gray-300 hover:text-green-400 transition px-2 py-1 border border-gray-600 rounded"
          title="Share this document"
        >
          Share
        </button>
        <button
          onClick={handleLogout}
          className="text-gray-300 hover:text-red-400 transition px-2 py-1 border border-gray-600 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default TopBar
