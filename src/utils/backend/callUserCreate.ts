import { BACKEND_URL } from "../env";
import { UserCreate } from "./schemas/UserCreate";
import { UserInfo } from "./schemas/UserInfo";

export async function callUserCreate(userCreate: UserCreate): Promise<Error|UserInfo> {
    const response = await fetch(`${BACKEND_URL}/api/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userCreate),
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.json();
        return new Error(error.message);
    }

    const data = await response.json();
    return data as UserInfo;
};
