export interface AuthorizedUser {
    id: number,
    email: string,
    type: string,
    authId?: number,
    nickname?: string
}

export interface Tokens {
    access_token: string,
    refresh_token: string
}

export interface ApiResult {
    msg?: string,
    code: number,
    data?: any,
    tokens?: any
}