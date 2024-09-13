import { BACKEND_URL } from "../env";
import { UserLoginInfo } from "./schemas/UserLoginInfo";

export async function callAuthInfo(): Promise<null|UserLoginInfo> {
    const response = await fetch(`${BACKEND_URL}/api/auth/info`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    return data as UserLoginInfo;
}
