import { UserInfo } from "./UserInfo";

export type VoiceInfo = {
    id: number;
    is_public: boolean;
    name: string;
    description: string;
    creator_user_id: number;
    creator_user: UserInfo;
};
