function envIsInvalidOrMissing(env: string): never {
    throw new Error(`Environment variable ${env} is invalid or missing`);
}

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || envIsInvalidOrMissing("NEXT_PUBLIC_BACKEND_URL");
