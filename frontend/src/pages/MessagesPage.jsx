import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { Send, MessageSquare, Search, ShieldCheck } from 'lucide-react'
import api from '../api/axios'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`

  return new Date(dateStr).toLocaleDateString()
}

export default function MessagesPage() {
  const { user } = useAuth()

  const [convos, setConvos] = useState([])
  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')

  const bottomRef = useRef(null)
  const pollRef = useRef(null)

  // Load conversations
  const fetchConvos = async () => {
    try {
      const { data } = await api.get('/messaging/')
      setConvos(Array.isArray(data) ? data : data.results || [])
    } catch {
      // keep page usable even if request fails
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchConvos()
  }, [])

  // Load messages when active conversation changes
  const fetchMessages = async (convoId) => {
    try {
      const { data } = await api.get(`/messaging/${convoId}/messages/`)

      setMessages(Array.isArray(data) ? data : data.results || [])

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 50)

      fetchConvos()
    } catch {
      // silently fail during polling
    }
  }

  useEffect(() => {
    if (!active) return

    fetchMessages(active.id)

    pollRef.current = setInterval(() => fetchMessages(active.id), 5000)

    return () => clearInterval(pollRef.current)
  }, [active?.id])

  const selectConvo = (convo) => {
    clearInterval(pollRef.current)
    setActive(convo)
    setMessages([])
  }

  const sendMessage = async (e) => {
    e.preventDefault()

    if (!draft.trim() || !active) return

    setSending(true)

    try {
      const { data } = await api.post(`/messaging/${active.id}/messages/`, {
        body: draft.trim(),
      })

      setMessages((prev) => [...prev, data])
      setDraft('')
      fetchConvos()

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    } catch {
      // keep draft if sending fails
    }

    setSending(false)
  }

  const filtered = convos.filter((c) => {
    if (!search) return true

    const other = c.participants?.find((p) => p.id !== user?.id)

    return (
      other?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.project_title?.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-bgray">

      {/* Header */}
      <div className="bg-navy py-10">
        <div className="section-wrap">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/mushawedu-logo.png"
              alt="MushaWedu Logo"
              className="w-11 h-11 object-contain"
            />

            <div>
              <p className="text-orange font-semibold text-sm uppercase tracking-widest">
                Messages
              </p>

              <p className="text-white/50 text-xs">
                MushaWedu Communication Centre
              </p>
            </div>
          </div>

          <h1 className="text-white text-2xl md:text-3xl font-extrabold">
            Messages
          </h1>

          <p className="text-white/60 text-sm mt-1">
            Your conversations with artisans, suppliers, and customers on MushaWedu.
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
            <ShieldCheck size={15} className="text-orange" />
            <span>Keep all project communication in one trusted place.</span>
          </div>
        </div>
      </div>

      <div className="section-wrap py-6">
        <div
          className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-orange"
          style={{
            height: 'calc(100vh - 220px)',
            minHeight: 480,
            display: 'flex',
          }}
        >

          {/* Sidebar — conversation list */}
          <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">

            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations…"
                  className="form-input pl-8 text-sm py-2"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <img
                    src="/images/mushawedu-logo.png"
                    alt="MushaWedu Logo"
                    className="w-10 h-10 object-contain animate-pulse"
                  />

                  <div className="w-6 h-6 border-2 border-bgray border-t-orange rounded-full animate-spin" />

                  <p className="text-xs text-gray-400">
                    Loading conversations…
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <img
                    src="/images/mushawedu-logo.png"
                    alt="MushaWedu Logo"
                    className="w-12 h-12 object-contain mx-auto mb-3 opacity-80"
                  />

                  <MessageSquare size={28} className="text-gray-200 mx-auto mb-2" />

                  <p className="text-xs text-gray-400">
                    No conversations yet.
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Message an artisan from their MushaWedu profile.
                  </p>
                </div>
              ) : (
                filtered.map((convo) => {
                  const other = convo.participants?.find((p) => p.id !== user?.id)
                  const isActive = active?.id === convo.id

                  return (
                    <button
                      key={convo.id}
                      onClick={() => selectConvo(convo)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors hover:bg-bgray ${
                        isActive ? 'bg-navy/5 border-l-2 border-l-orange' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-maroon/15 flex items-center justify-center text-maroon font-bold text-sm shrink-0">
                          {(other?.full_name?.[0] || '?').toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-semibold text-navy text-xs truncate">
                              {other?.full_name || 'User'}
                            </p>

                            {convo.unread_count > 0 && (
                              <span className="shrink-0 w-5 h-5 bg-orange rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                {convo.unread_count}
                              </span>
                            )}
                          </div>

                          {convo.project_title && (
                            <p className="text-[10px] text-orange font-medium truncate">
                              {convo.project_title}
                            </p>
                          )}

                          {convo.last_message && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {convo.last_message.body}
                            </p>
                          )}

                          {convo.updated_at && (
                            <p className="text-[10px] text-gray-300 mt-0.5">
                              {timeAgo(convo.updated_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Main chat area */}
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <img
                  src="/images/mushawedu-logo.png"
                  alt="MushaWedu Logo"
                  className="w-16 h-16 object-contain mx-auto mb-4 opacity-90"
                />

                <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />

                <p className="font-semibold text-gray-400">
                  Select a conversation
                </p>

                <p className="text-sm text-gray-300 mt-1">
                  Or start one by messaging an artisan from their MushaWedu profile.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-w-0">

              {/* Chat header */}
              {(() => {
                const other = active.participants?.find((p) => p.id !== user?.id)

                return (
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-maroon/15 flex items-center justify-center text-maroon font-bold text-sm">
                      {(other?.full_name?.[0] || '?').toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-navy text-sm">
                        {other?.full_name || 'User'}
                      </p>

                      {active.project_title && (
                        <p className="text-xs text-orange">
                          {active.project_title}
                        </p>
                      )}

                      <p className="text-[10px] text-gray-400">
                        MushaWedu conversation
                      </p>
                    </div>
                  </div>
                )
              })()}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="text-center py-10 text-gray-300 text-sm">
                    No messages yet. Say hello!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender?.id === user?.id

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm ${
                            isMine
                              ? 'bg-navy text-white rounded-br-sm'
                              : 'bg-bgray text-body rounded-bl-sm'
                          }`}
                        >
                          <p className="leading-relaxed">
                            {msg.body}
                          </p>

                          <p className={`text-[10px] mt-1 ${isMine ? 'text-white/50' : 'text-gray-400'}`}>
                            {timeAgo(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={sendMessage}
                className="px-4 py-3 border-t border-gray-100 flex items-center gap-3"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="form-input flex-1 py-2 text-sm"
                  disabled={sending}
                />

                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="btn-primary py-2 px-4 disabled:opacity-50"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}