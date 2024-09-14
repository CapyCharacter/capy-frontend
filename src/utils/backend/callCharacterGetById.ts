import { BACKEND_URL } from "../env";
import { CharacterInfo } from "./schemas/CharacterInfo";

export const callCharacterGetById = async ({ characterId } : {
    characterId: number,
}): Promise<CharacterInfo | Error> => {
    const response = await fetch(`${BACKEND_URL}/api/characters/${characterId}`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        return new Error('Failed to fetch character');
    }
    const data = await response.json();
    return data as CharacterInfo;
}
