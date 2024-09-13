import { BACKEND_URL } from "../env";

export async function callAuthLogout(): Promise<Error|boolean> {
    const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.json();
        return new Error(error.message);
    }

    return true;
}
