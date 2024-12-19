'use client'

import { useState } from 'react';

export default function Chat() {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [input, setInput] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const creatingReply = (messages: { role: string, content: string }[]) => {
        const url = process.env.NODE_ENV === 'production' 
            ? 'https://chat-with-ais-64f0efed640e.herokuapp.com' 
            : 'http://localhost:8000';
        fetch(url + '/reply_basic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: messages }),
        })
        .then(response => response.json())
        .then(data => {
            const inclulding_ai_basic_messages = [...messages, data];
            setMessages(inclulding_ai_basic_messages);
            fetch(url + '/reply_adjusting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: inclulding_ai_basic_messages }),
            })
            .then(response => response.json())
            .then(data => {
                const inclulding_ai_adjusting_messages = [...inclulding_ai_basic_messages, data];
                setMessages(inclulding_ai_adjusting_messages);
                setIsSubmitting(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const inclulding_user_messages = [...messages, { role: 'user', content: input }];
        setMessages(inclulding_user_messages);
        creatingReply(inclulding_user_messages);
        setInput("");
    }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
    <h1 className="fixed top-2 left-0 w-full text-center font-serif">Chat system by art-innovation, 2024.</h1>
    <div className="fixed top-10 rounded-lg shadow w-4/5 max-w-screen-sm h-[calc(70vh)] p-4 overflow-y-auto mt-8">
        <div className="flex flex-col w-full">
        {messages.map((message, index) => (
            (message.content
                ?
            <div key={index} className={`flex max-w-[calc(100%-48px)] ${message.role !== 'user' ? 'justify-start ml-0 mr-auto' : 'justify-end ml-auto mr-0'} mt-5 shadow py-1 px-4 rounded-xl`}>
            {message.role}: {message.content}
            </div>
            :
            null
            )
        ))}
        </div>
    </div>
    <div className="fixed bottom-6 w-full max-w-screen-sm px-8 flex justify-between mt-8">
      <form
      className="flex justify-end w-full h-12"
      onSubmit={(e) => {
        if (input.trim() !== "") {
          handleSubmit(e);
        } else {
          e.preventDefault();
        }
      }}>
        <input
        className="flex-grow shadow w-full rounded-lg py-1 px-2"
        placeholder="Enter your message here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        ></input>
        <button
        type="submit"
        className="shadow ml-3 h-7 w-10 mt-5 rounded-xl leading-6"
        disabled={isSubmitting}
        >
            {isSubmitting
            ?
            (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )
            : '>'}
        </button>
        </form>
    </div>
    </div>
  )
}
