import { BACKEND_URL } from "../env";
import { CharacterCreate } from "./schemas/CharacterCreate";
import { CharacterInfo } from "./schemas/CharacterInfo";

export const callCharacterCreate = async ({ characterCreate }: { characterCreate: CharacterCreate }): Promise<Error | CharacterInfo> => {
    const response = await fetch(`${BACKEND_URL}/api/characters`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterCreate),
        credentials: 'include',
    });
    if (!response.ok) {
        return new Error('Failed to create character');
    }
    const data = await response.json();
    return data as CharacterInfo;
}
