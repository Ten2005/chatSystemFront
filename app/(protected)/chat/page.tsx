'use client'

import { useState, useEffect } from 'react';

export default function Chat() {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [input, setInput] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [model, setModel] = useState<string>("absurd");

    // const creatingReply = (messages: { role: string, content: string }[]) => {
    //     const url = process.env.NODE_ENV === 'production' 
    //         ? 'https://chat-with-ais-64f0efed640e.herokuapp.com' 
    //         : 'http://localhost:8000';
    //     fetch(url + '/reply_basic', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ messages: messages }),
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         const inclulding_ai_basic_messages = [...messages, data];
    //         setMessages(inclulding_ai_basic_messages);
    //         fetch(url + '/reply_adjusting', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ messages: inclulding_ai_basic_messages }),
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             const inclulding_ai_adjusting_messages = [...inclulding_ai_basic_messages, data];
    //             setMessages(inclulding_ai_adjusting_messages);
    //             setIsSubmitting(false);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
    // }

    const reactToUser = (messages: { role: string, content: string }[], model: string) => {
        const url = process.env.NODE_ENV === 'production' 
            ? 'https://chat-with-ais-64f0efed640e.herokuapp.com' 
            : 'http://localhost:8000';
        fetch(url + '/react_to_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: messages, model: model }),
        })
        .then(response => response.json())
        .then(data => {
            const inclulding_ai_messages = [...messages, data];
            setMessages(inclulding_ai_messages);
            setIsSubmitting(false);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isSubmitting && messages.length > 0) {
                setIsSubmitting(true);
                setInput("");
                let selectedModel;
                if (model === 'absurd') {
                    selectedModel = 'zen';
                    setModel('zen');
                } else if (model === 'zen') {
                    selectedModel = 'consultation';
                    setModel('consultation');
                } else if (model === 'consultation') {
                    selectedModel = 'absurd';
                    setModel('absurd');
                } else {
                    selectedModel = 'absurd';
                    setModel('absurd');
                }
                reactToUser(messages, selectedModel);
            }
        }, 10000);

        return () => clearTimeout(timer);
    }, [messages]);



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const inclulding_user_messages = [...messages, { role: 'user', content: input }];
        setMessages(inclulding_user_messages);
        // creatingReply(inclulding_user_messages);
        reactToUser(inclulding_user_messages, model);
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
                <div key={index} className={`flex w-full mt-6 ${message.role !== 'user' ? 'justify-start ml-0 mr-auto' : 'justify-end ml-auto mr-0'}`}>
                    <div key={index} className={`flex max-w-[calc(100%-48px)] justify-center shadow py-1 px-4 rounded-xl`}>
                        {message.content}
                    </div>
                    {message.role === 'user'
                    ?
                    null
                    :
                    <div className={`mt-2 ml-2 text-gray-500`}>{message.role}</div> 
                    }
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
        <select
        name="model"
        id="model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="shadow ml-4 h-8 w-24 mt-4 rounded-xl leading-6 text-center"
        >
            <option value="absurd">不条理</option>
            <option value="zen">禅</option>
            <option value="consultation">相談</option>
        </select>
        <button
        type="submit"
        className="shadow ml-3 h-7 w-10 mt-5 rounded-lg leading-6"
        disabled={isSubmitting}
        >
            {isSubmitting
            ?
            (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-4 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )
            : '>'}
        </button>
        </form>
    </div>
    </div>
  )
}
