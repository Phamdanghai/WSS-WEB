import { db } from '@/firebase'
import { Avatar, Button, Dropdown, Flex } from 'antd'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'

export default function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const scroll = useRef<HTMLSpanElement>()
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const { uid, displayName, photoURL } = currentUser

  const onSend = async () => {
    if (message.trim() !== '') {
      await addDoc(collection(db, 'messages'), {
        text: message,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid
      })
      setMessage('')
      scroll.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    }
  }

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = []
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id })
      })
      const sortedMessages = fetchedMessages.sort((a, b) => a.createdAt - b.createdAt)
      setMessages(sortedMessages)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroll.current])

  return (
    <Dropdown
      trigger={['click']}
      dropdownRender={() => {
        return (
          <div
            className='w-[300px] h-[400px] rounded-3xl bg-white shadow-lg flex flex-col justify-between'
            style={{ border: '1px solid #E5E5E5' }}
          >
            <div>
              <div className='p-2 flex gap-2 items-center' style={{ borderBottom: '1px solid #E5E5E5' }}>
                <img src='/public/logo.svg' className='w-[40px] h-[40px]' />
                <p className='font-bold'>Blissful Bell</p>
              </div>
              <div className={`p-2 flex flex-col gap-2 h-[288px] overflow-y-scroll`}>
                {/* {Array(4).fill(
                  <>
                    <div>
                      <p className='text-slate-400 pl-2'>Admin</p>
                      <div className='bg-zinc-400 p-2 inline-block rounded-full mb-2 text-white'>Say something</div>
                    </div>
                    <div className='text-right'>
                      <p className='text-slate-400 pr-2'>Me</p>
                      <div className='bg-primary p-2 inline-block rounded-full mb-2 text-white'>Say something</div>
                    </div>
                  </>
                )} */}
                {messages.map((message, index) =>
                  displayName === message.name ? (
                    <div className='text-right' key={index}>
                      <p className='text-slate-400 pr-2'>Tôi</p>
                      <Flex gap={2} justify='right'>
                        <p className='bg-primary p-2 inline-block rounded-full mb-2 text-white'>{message.text}</p>
                        <Avatar src={message.avatar} />
                      </Flex>
                    </div>
                  ) : (
                    <div>
                      <p className='text-slate-400 pl-2'>{message.name}</p>
                      <p className='bg-zinc-400 p-2 inline-block rounded-full mb-2 text-white'>{message.text}</p>
                    </div>
                  )
                )}
                <span ref={scroll}></span>
              </div>
            </div>
            <div
              className='flex justify-between items-center p-4'
              style={{
                borderTop: '1px solid #E5E5E5'
              }}
            >
              <input
                className='border-none outline-none'
                placeholder='Nhập nội dung...'
                onChange={(e) => {
                  const { value } = e.target
                  setMessage(value)
                }}
                value={message}
              />
              <Button
                onClick={onSend}
                icon={<img src='/public/send.svg' className='w-[20px] h-[20px]' />}
                type='text'
              />
            </div>
          </div>
        )
      }}
      placement='topRight'
    >
      <img src='/public/chat.svg' className='h-10 w-10 fixed bottom-5 right-5 ' />
    </Dropdown>
  )
}
