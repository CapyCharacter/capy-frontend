import { io, Socket } from 'socket.io-client';
import { BACKEND_URL } from '../env';

type AIServiceInputFromFrontend = {
    type: "LLM";
    conversation_id: number;
    latest_message_content: string;
    token: string;
} | {
    type: "VoiceCall";
    conversation_id: number;
    input_audio_wav: ArrayBuffer;
    token: string;
};

type AIServiceOutput = {
    is_finished: boolean;
    error: false;
    new_data: string;
} | {
    is_finished: boolean;
    error: false;
    output_audio_wav: ArrayBuffer;
} | {
    is_finished: true;
    error: string;
};

export const callAIService = (
    input: AIServiceInputFromFrontend,
    callback: (output: AIServiceOutput) => void
): void => {
    const socket: Socket = io(BACKEND_URL || '', {
        auth: {
            token: input.token,
        },
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        callback({ is_finished: true, error: 'Connection error: ' + error });
        socket.disconnect();
    });

    socket.on('connect', () => {
        socket.emit('message', input);
    });

    socket.on('message', (output: AIServiceOutput) => {
        callback(output);

        if (output.is_finished) {
            socket.disconnect();
        }
    });

    socket.on('error', (error: Error) => {
        console.error('Socket error:', error);
    });
};
