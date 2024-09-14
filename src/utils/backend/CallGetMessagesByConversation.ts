import { BACKEND_URL } from "../env";
import { MessageInfo } from "./schemas/MessageInfo";

export const callGetMessagesByConversation = async ({ conversationId } : { conversationId: number }): Promise<Error|MessageInfo[]> => {
  const response = await fetch(`${BACKEND_URL}/api/messages?conversation_id=${conversationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    return new Error('Failed to fetch messages');
  }

  const data = await response.json();
  return data as MessageInfo[];
};
