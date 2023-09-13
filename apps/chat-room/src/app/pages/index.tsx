import { SendHorizontal } from 'lucide-react';
import { writeMessage, clearChat } from "../utils/apiFunctions";
import { useState } from "react";
import { useChat } from "../hooks/useChat";
import { Message } from "../components/Message";
import { format } from 'date-fns';
import retext from 'retext';
import emoji from 'retext-emoji';

(window as any).clearChat = clearChat;

export const Index = () => {

    const [text, setText] = useState('');
    const messages = useChat();

    const handleWriteMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            writeMessage({
                sender: 'Damian',
                message: text,
                timestamp: format(new Date(), 'hh:mm:ss a')
            })
        } catch (e) {
            console.error(e);
        }
        setText('');
    }

    const emojied = String(retext()
        .use(emoji, { convert: 'encode' })
        .processSync(text))

    return (
        <div className="flex justify-center h-screen w-full bg-gradient-to-b from-black to-slate-900 text-white py-12">
            <div className="w-[80%] md:w-[50rem] flex flex-col justify-between items-center">
                <div className="w-full h-5/6 flex-col">
                    <h1 className="text-3xl pb-6"><span contentEditable className='min-w-5' />'s chat room</h1>
                    <div className="bg-slate-800 text-white rounded-md p-3 flex flex-col overflow-auto h-auto max-h-full">
                        {messages.length === 0 && <span className="text-center italic opacity-10">No message yet</span>}
                        {messages.map((m, i) => <Message key={i} {...m} />)}
                    </div>
                </div>
                <form
                    className="w-full bg-slate-800 relative flex rounded-md items-center justify-center"
                    onSubmit={handleWriteMessage}>
                    <input
                        className="w-full bg-slate-800 rounded-md text-white p-3 focus:outline-none"
                        placeholder="Send a message"
                        value={emojied}
                        onChange={(e) => setText(e.currentTarget.value)}
                    />
                    <button type="submit" className="absolute right-14 hover:text-blue-500">Send</button>
                    <SendHorizontal color="#94a3b8" size={24} className="absolute inset-y-0 right-4 my-auto" />
                </form>
            </div>
        </div>
    )
};

export default Index;