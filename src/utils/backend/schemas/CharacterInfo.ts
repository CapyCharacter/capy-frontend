import { UserInfo } from "./UserInfo";
import { VoiceInfo } from "./VoiceInfo";

export type CharacterInfo = {
    id: number;
    avatar_url: string;
    name: string;
    description: string;
    tagline: string;
    definition: string;
    greeting: string;
    num_chats: number;
    num_likes: number;
    is_public: boolean;
    voice_id: number | null;
    voice: VoiceInfo | null;
    creator_user_id: number;
    creator_user: UserInfo;
};
