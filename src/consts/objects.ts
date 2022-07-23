import consts from 'src/consts/consts';
import { ApiHeaderOptions } from "@nestjs/swagger";

export const apiHeaderOptions: ApiHeaderOptions = {
    name: consts.REFRESH_TOKEN_HEADER,
    description: `user에게 발급된 jwt refresh_token. \n
        access_token은 authorization header에 bearer scheme으로 담아 보냅니다.
        access_token과 함께 authentication이 필요한 api마다 헤더에 Refresh-Token: refresh_token에 담아 보냅니다.
        
        `
}