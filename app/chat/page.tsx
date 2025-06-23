import React from 'react'
import ChatUi from '@/components/chat-ui'

const page = () => {
  return (
    <div className='min-h-screen'>
        <h1>Chat</h1>

        <p>This is the chat page.</p>
        <p>It is currently under development.</p>


        <p>Feel free to explore the chat interface below.</p>
        <p>It is a simplified version of the AI chat interface.</p>
        <ChatUi />
    </div>
  )
}

export default page