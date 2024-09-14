import { BACKEND_URL } from "../env";
import { CharacterUpdate } from "./schemas/CharacterUpdate";
import { CharacterInfo } from "./schemas/CharacterInfo";

export const callCharacterUpdate = async ({ characterId, characterUpdate } : {
    characterId: number,
    characterUpdate: CharacterUpdate,
}) => {
    const response = await fetch(`${BACKEND_URL}/api/characters/${characterId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterUpdate),
        credentials: 'include',
    });
    if (!response.ok) {
        return new Error('Failed to update character');
    }
    const data = await response.json();
    return data as CharacterInfo;
}
