import { useEffect, useState } from "react";

const useWebSocket = (url: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.info("WebSocket connected");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        ws.onclose = () => {
            console.info("WebSocket disconnected");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [url]);

    const sendMessage = (message: any) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not open");
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;
