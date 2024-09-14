import { BACKEND_URL } from "../env";
import { VoiceCreate } from "./schemas/VoiceCreate";
import { VoiceInfo } from "./schemas/VoiceInfo";

export const callVoiceCreate = async (voice: VoiceCreate): Promise<Error|VoiceInfo> => {
    const response = await fetch(`${BACKEND_URL}/api/voices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(voice),
        credentials: 'include',
    });
    if (!response.ok) {
        return new Error('Failed to create voice');
    }
    const data = await response.json();
    return data as VoiceInfo;
};
