import { BACKEND_URL } from "../env";
import { VoiceUpdate } from "./schemas/VoiceUpdate";
import { VoiceInfo } from "./schemas/VoiceInfo";

export const callVoiceUpdate = async (voiceId: number, voiceUpdate: VoiceUpdate): Promise<Error | VoiceInfo> => {
    const response = await fetch(`${BACKEND_URL}/api/voices/${voiceId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(voiceUpdate),
        credentials: 'include',
    });
    if (!response.ok) {
        return new Error('Failed to update voice');
    }
    const data = await response.json();
    return data as VoiceInfo;
};

