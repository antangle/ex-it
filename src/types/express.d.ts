import { TokenData } from 'src/response/response.dto';
import { User } from "src/entities/user.entity";

declare global {
	namespace Express {
		interface Request {
            tokens: TokenData,
            endpoint: number
            user: {
                id: number,
                email: string,
                type: string
            }
        }
	}
}