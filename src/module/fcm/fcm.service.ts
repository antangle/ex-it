import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { FcmMessageDto } from './dto/fcm-message.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import firebase, { ServiceAccount } from 'firebase-admin';
import { consts } from 'src/consts/consts';
import { FirebaseException } from 'src/exception/firebase.exception';

@Injectable()
export class FcmService {
    constructor(
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: Logger
    ){
        //init app
        const params = this.createFcmConfig();
        firebase.initializeApp({
            credential: firebase.credential.cert(params as ServiceAccount)
        });
    }

    createFcmConfig(){
        const {private_key} = JSON.parse(this.configService.get('fcm_private_key'))
        const params = {
            type: this.configService.get('fcm_type'),
            project_id: this.configService.get('fcm_project_id'),
            private_key_id: this.configService.get('fcm_private_key_id'),
            private_key: private_key,
            client_email: this.configService.get('fcm_client_email'),
            client_id: this.configService.get('fcm_client_id'),
            auth_uri: this.configService.get('fcm_auth_uri'),
            token_uri: this.configService.get('fcm_token_uri'),
            auth_provider_x509_cert_url: this.configService.get('fcm_auth_provider_x509_cert_url'),
            client_x509_cert_url: this.configService.get('fcm_client_x509_cert_url')
        };
        return params;
    }
    makeMessagePayload(fcmMessageDto: FcmMessageDto){
        const {title, message} = fcmMessageDto;
        const icon_url = `https://ex-it.app/public/exit_fcm_icon.png`
        const payload = {
            notification: {
              title: title,
              body: message,
              icon: icon_url
            },
            data: {
                icon: icon_url
            }
        }
        return payload;
    }

    async sendFcmMessage(token:string, payload: any){
        const firebaseResponse = await firebase.messaging().sendToDevice(token, payload);
        this.logger.verbose(firebaseResponse);

        if(firebaseResponse.failureCount > 0){
            throw new FirebaseException(consts.SEND_FCM_MESSAGE_ERR_MSG, consts.SEND_FCM_MESSAGE_ERR_CODE, firebaseResponse)
        }
        return firebaseResponse;
    }
}