'use client'

import { useEffect, useState, useRef } from 'react'
import { Send, Loader2, MessageCircle } from 'lucide-react'
import type { Database } from '@/supabase/types/database.types'

type Message = {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  is_read: boolean
  created_at: string
}
type Profile = Database['public']['Tables']['profiles']['Row']

interface ChatBoxProps {
  currentUserId: string
  otherUserId: string
  otherUserName: string
  currentUserName: string
}

export default function ChatBox({
  currentUserId,
  otherUserId,
  otherUserName,
  currentUserName
}: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    
    // Set up real-time subscription
    const setupRealtimeSubscription = async () => {
      const { supabase } = await import('@/lib/supabase')

      // Подписка на входящие сообщения от собеседника
      const channel = supabase
        .channel(`messages-${currentUserId}-${otherUserId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${otherUserId}`
          },
          (payload) => {
            console.log('[Chat] Realtime event received:', payload)
            const newMessage = payload.new as Message
            
            // Проверяем, что сообщение действительно нам
            if (newMessage.receiver_id === currentUserId) {
              console.log('[Chat] ✅ New message for us:', newMessage)
              setMessages((prev) => [...prev, newMessage])
              markMessagesAsRead()
            } else {
              console.log('[Chat] ⚠️ Message not for us, ignoring')
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${currentUserId}`
          },
          (payload) => {
            // Обновление статуса прочитанности наших сообщений
            const updated = payload.new as Message
            if (updated.receiver_id === otherUserId) {
              console.log('[Chat] Message read status updated:', updated)
              setMessages((prev) =>
                prev.map((msg) => (msg.id === updated.id ? updated : msg))
              )
            }
          }
        )
        .subscribe((status) => {
          console.log('[Realtime] Subscription status:', status)
          if (status === 'SUBSCRIBED') {
            console.log('[Realtime] ✅ Successfully subscribed to messages')
          } else if (status === 'CHANNEL_ERROR') {
            console.error('[Realtime] ❌ Channel error')
          } else if (status === 'TIMED_OUT') {
            console.error('[Realtime] ❌ Connection timed out')
          }
        })

      return () => {
        console.log('[Realtime] Unsubscribing from messages channel')
        supabase.removeChannel(channel)
      }
    }

    const cleanup = setupRealtimeSubscription()
    
    return () => {
      cleanup.then((cleanupFn) => cleanupFn())
    }
  }, [currentUserId, otherUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    setLoading(true)
    try {
      const { supabase } = await import('@/lib/supabase')

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true })

      if (error) throw error

      setMessages(data || [])

      // Mark messages as read
      await markMessagesAsRead()
    } catch (error) {
      console.error('[Chat] Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markMessagesAsRead = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')

      const { error } = await supabase
        .from('messages')
        // @ts-ignore - Update messages table
        .update({ is_read: true })
        .eq('receiver_id', currentUserId)
        .eq('sender_id', otherUserId)
        .eq('is_read', false)

      if (error) throw error
    } catch (error) {
      console.error('[Chat] Error marking messages as read:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const { supabase } = await import('@/lib/supabase')

      const { data, error } = await supabase
        .from('messages')
        // @ts-ignore - Insert message
        .insert({
          sender_id: currentUserId,
          receiver_id: otherUserId,
          message: newMessage.trim()
        })
        .select()
        .single()

      if (error) throw error

      setMessages((prev) => [...prev, data])
      setNewMessage('')
    } catch (error) {
      console.error('[Chat] Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-800/50 rounded-2xl border border-gray-700/50">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
            <MessageCircle className="text-primary-500" size={20} />
          </div>
          <div>
            <h3 className="text-white font-medium">{otherUserName}</h3>
            <p className="text-gray-400 text-xs">Чат</p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Нет сообщений</p>
            <p className="text-gray-500 text-xs mt-1">Начните общение</p>
          </div>
        ) : (
          messages.map((message) => {
            const isSentByMe = message.sender_id === currentUserId
            return (
              <div
                key={message.id}
                className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    isSentByMe
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-700/50 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isSentByMe ? 'text-primary-100' : 'text-gray-400'
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700/50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
