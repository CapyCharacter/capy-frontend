import { CharacterInfo } from "./CharacterInfo";
import { VoiceInfo } from "./VoiceInfo";

export type ConversationInfo = {
    id: number;
    character_id: number | null;
    user_id: number;
    pinned_message_id: number | null;
    voice_id: number | null;
    is_public: boolean;
    
    character: CharacterInfo | null;
    voice: VoiceInfo | null;
};
