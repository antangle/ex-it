import { Tokens } from './../../types/user.d';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { FcmService } from './fcm.service';
import { FcmMessageDto } from './dto/fcm-message.dto';
import { Body, Controller, HttpStatus, Inject, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiResponses, makeApiResponse, SetCode, SetJwtAuth } from "src/functions/util.functions";
import { FcmMessageResponse } from "./response/fcm-message.response";
import { AuthToken } from 'src/decorator/decorators';

@ApiTags('fcm')
@Controller('fcm')
export class FcmController {
    constructor(
        private readonly fcmService: FcmService,
    ){}

    @ApiOperation({
        summary: 'firebase 푸시 메세지 보내기',
        description: 'title, message를 받아 fcm_token의 기기에게 푸시 알림을 보낸다.',
    })
    @ApiResponses(FcmMessageResponse)
    @SetJwtAuth()
    @SetCode(201)
    @Post('message')
    async sendMessage(
        @Body() fcmMessageDto: FcmMessageDto,
        @AuthToken() tokens: Tokens,
    ){
        const payload = this.fcmService.makeMessagePayload(fcmMessageDto);
        await this.fcmService.sendFcmMessage(fcmMessageDto.fcm_token, payload);
        return makeApiResponse(HttpStatus.OK, {tokens});
    }
}