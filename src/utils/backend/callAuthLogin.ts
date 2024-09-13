import { BACKEND_URL } from "../env";
import { UserLogin } from "./schemas/UserLogin";
import { UserLoginInfo } from "./schemas/UserLoginInfo";

export async function callAuthLogin({ email, password }: UserLogin): Promise<Error|UserLoginInfo> {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.json();
        return new Error(error.message);
    }

    const data = await response.json();

    return data as UserLoginInfo;
}
