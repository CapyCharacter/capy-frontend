import { CharacterInfo } from "./schemas/CharacterInfo";
import { BACKEND_URL } from "@/utils/env";

export const callFeaturedCharactersGet = async (): Promise<Error | CharacterInfo[]> => {
    const response = await fetch(`${BACKEND_URL}/api/characters/featured`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        return new Error('Failed to fetch featured characters');
    }
    const data = await response.json();
    return data as CharacterInfo[];
}

export const callRecommendedCharactersGet = async (): Promise<Error | CharacterInfo[]> => {
    const response = await fetch(`${BACKEND_URL}/api/characters/recommended`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        return new Error('Failed to fetch recommended characters');
    }
    const data = await response.json();
    return data as CharacterInfo[];
}

export const callRecentCharactersGet = async (): Promise<Error | CharacterInfo[]> => {
    const response = await fetch(`${BACKEND_URL}/api/characters/recent`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        return new Error('Failed to fetch recent characters');
    }
    const data = await response.json();
    return data as CharacterInfo[];
}

export const callThisWeekCharactersGet = async (): Promise<Error | CharacterInfo[]> => {
    const response = await fetch(`${BACKEND_URL}/api/characters/this-week`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        return new Error('Failed to fetch this week characters');
    }
    const data = await response.json();
    return data as CharacterInfo[];
}
