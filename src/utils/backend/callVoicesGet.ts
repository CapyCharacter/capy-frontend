import { BACKEND_URL } from "../env";
import { VoiceInfo } from "./schemas/VoiceInfo";

export const callVoicesGet = async (): Promise<Error|VoiceInfo[]> => {
    const response = await fetch(`${BACKEND_URL}/api/voices`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        return new Error('Failed to get voices');
    }
    const data = await response.json();
    return data as VoiceInfo[];
};
