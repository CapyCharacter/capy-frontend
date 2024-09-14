export type MessageInfo = {
    conversation_id: number;
    sent_by_user: boolean;
    content: string;
    id: number;
    voice_call_id: number | null;
    sent_at: number;
};
