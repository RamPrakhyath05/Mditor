'use client'

import React, { useEffect, useState, useRef } from 'react'
import { EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Collaboration from '@tiptap/extension-collaboration'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Strike from '@tiptap/extension-strike'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Link from '@tiptap/extension-link'
import HardBreak from '@tiptap/extension-hard-break'
import Highlight from '@tiptap/extension-highlight'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { GoDownload } from 'react-icons/go'
import { format } from 'date-fns'
import { useDocStore } from '@/store/docStore'
import { api } from '@/lib/api'
import { WebsocketProvider } from 'y-websocket'

const EditorComponent = ({ username }: { username: string | null }) => {
  const { docName, setDocName } = useDocStore()
  const [editor, setEditor] = useState<Editor | null>(null)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!docName) {
      const saved = localStorage.getItem('last-used-doc')
      if (saved) setDocName(saved)
    }
  }, [docName, setDocName])

  useEffect(() => {
    if (!docName) return

    const ydoc = new Y.Doc()
    const provider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:1234",
      docName,
      ydoc
    )
    const newEditor = new Editor({
      extensions: [
        StarterKit.configure({ history: false }),
        Placeholder.configure({
          placeholder: 'Start typing...',
          emptyEditorClass: 'is-editor-empty',
        }),
        Collaboration.configure({ document: ydoc }),
        CollaborationCursor.configure({
          provider,
          user: {
            name: username || "Anonymous",
            color: "#22c55e",
          },
        }),
        Paragraph,
        Text,
        Heading,
        Strike,
        Blockquote,
        Bold,
        Italic,
        Code,
        CodeBlock,
        HorizontalRule,
        BulletList,
        OrderedList,
        ListItem,
        Link,
        HardBreak,
        Highlight,
      ],
      editorProps: {
        attributes: { class: 'outline-none' },
      },
      autofocus: true,
      content: '',
      onUpdate: ({ editor }) => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current)
        saveTimeout.current = setTimeout(async () => {
          const content = editor.getJSON()
          try {
            await api.updateDoc(docName, content)
          } catch (err) {
            console.error('Auto save failed:', err)
          }
        }, 1000)
      },
    })

    api.getDoc(docName).then((doc) => {
      if (doc?.content) {
        newEditor.commands.setContent(doc.content)
      }
    })

    setEditor(newEditor)

    return () => {
      provider.destroy()
      ydoc.destroy()
      newEditor.destroy()
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [docName])

  const saveToPC = () => {
    if (!editor) return
    const json = editor.getJSON()

    const convertToMarkdown = (json: any) => {
      const convertNode = (node: any): string => {
        switch (node.type) {
          case 'paragraph':
            return (node.content?.map(convertNode).join('') || '') + '\n\n'
          case 'text': {
            let text = node.text || ''
            if (node.marks) {
              node.marks.forEach((mark: any) => {
                if (mark.type === 'bold') text = `**${text}**`
                if (mark.type === 'italic') text = `*${text}*`
                if (mark.type === 'strike') text = `~~${text}~~`
                if (mark.type === 'code') text = `\`${text}\``
              })
            }
            return text
          }
          case 'heading':
            return `${'#'.repeat(node.attrs.level)} ${node.content?.map(convertNode).join('')}\n\n`
          case 'bulletList':
            return node.content?.map((item: any) => `- ${item.content?.map(convertNode).join('')}`).join('\n') + '\n\n'
          case 'orderedList':
            return node.content?.map((item: any, i: number) => `${i + 1}. ${item.content?.map(convertNode).join('')}`).join('\n') + '\n\n'
          case 'blockquote':
            return `> ${node.content?.map(convertNode).join('')}\n\n`
          case 'codeBlock':
            return `\`\`\`\n${node.content?.map(convertNode).join('')}\n\`\`\`\n\n`
          case 'horizontalRule':
            return `---\n\n`
          default:
            return node.content?.map(convertNode).join('') || ''
        }
      }
      return json.content?.map(convertNode).join('') || ''
    }

    const markdown = convertToMarkdown(json)
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${format(new Date(), 'dd-MM-yyyy')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!docName) {
    return (
      <div className="p-4 text-gray-400 h-full flex items-center justify-center bg-[#2b2b2b] rounded-lg">
        Create a new file to get started, or select a file from the sidebar.
      </div>
    )
  }

  if (!editor) {
    return <div className="p-4 text-gray-300">Loading your document...</div>
  }

  return (
    <div className="p-4 relative h-full">
      <div className="h-full overflow-y-auto rounded-lg bg-[#2b2b2b] p-6 tiptap">
        <EditorContent editor={editor} />
      </div>
      <button
        type="button"
        className="absolute bottom-6 right-8 cursor-pointer rounded-lg bg-indigo-500 w-12 h-10 text-white hover:bg-indigo-400 transition duration-300 text-center hover:scale-105 flex items-center justify-center gap-2"
        title="Save as Markdown File"
        onClick={saveToPC}
      >
        <GoDownload className="text-lg" />
      </button>
    </div>
  )
}

export default EditorComponent
