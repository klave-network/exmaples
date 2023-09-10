import { useEffect, useState } from "react";
import { ChatMessage, Chat, waitForConnection, klaveContract } from "../utils/apiFunctions";
import secretariumHandler from "../utils/secretariumHandler";

export function useChat() {
    const [data, setData] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const getChat = async (): Promise<Chat> => waitForConnection()
            .then(() => secretariumHandler.request(klaveContract, 'getChat', {}, `getChat-${Math.random()}`))
            .then(tx =>
                new Promise((resolve, reject) => {
                    tx.onResult((result: any) => {
                        setData(result.messages);
                        resolve(result);
                    })
                    tx.onError(error => {
                        reject(error);
                    })
                    tx.send().catch(reject)
                })
            )

        getChat();
    }, []);

    return data;
}