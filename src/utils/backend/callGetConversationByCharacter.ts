import { BACKEND_URL } from "@/utils/env";
import { ConversationInfo } from "./schemas/ConversationInfo";

export const callGetConversationByCharacter = async ({ characterId }: {
    characterId: number
}): Promise<Error | ConversationInfo> => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/conversations?character_id=${characterId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            return new Error('Failed to fetch conversation');
        }
        const data = await response.json();
        if (data.error) {
            return new Error(data.error);
        }
        return (data as ConversationInfo[])[0];
    } catch (error) {
        return new Error('Failed to fetch conversation');
    }
}
