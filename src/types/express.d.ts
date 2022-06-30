import { User } from "src/entities/user.entity";

export interface ITokens {
    refresh_token?: string,
    access_token: string
}

declare global {
	namespace Express {
		interface Request {
            email: string,
            tokens: ITokens,
            endpoint: number
        }
	}
}