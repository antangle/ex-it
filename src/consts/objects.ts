import consts from 'src/consts/consts';
import { ApiHeaderOptions } from "@nestjs/swagger";

export const apiHeaderOptions: ApiHeaderOptions = {
    name: consts.REFRESH_TOKEN_HEADER,
    description: 'custom header containing jwt refresh token'
}