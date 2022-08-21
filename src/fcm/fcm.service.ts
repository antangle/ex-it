import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import firebase, { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FcmService {
    constructor(
        private configService: ConfigService
    ){}

    initFcmApp(){
        const params = this.createFcmConfig();
        firebase.initializeApp({
            credential: firebase.credential.cert(params as ServiceAccount)
        })
    }

    async sendFcmMessage(token:string, message: any){
        const firebaseResponse = await firebase.messaging().sendToDevice(token, message);
        return firebaseResponse;
    }

    createFcmConfig(){
        const params = {
            type: this.configService.get('fcm_type'),
            project_id: this.configService.get('fcm_project_id'),
            private_key_id: this.configService.get('fcm_private_key_id'),
            private_key: this.configService.get('fcm_private_key'),
            client_email: this.configService.get('fcm_client_email'),
            client_id: this.configService.get('fcm_client_id'),
            auth_uri: this.configService.get('fcm_auth_uri'),
            token_uri: this.configService.get('fcm_token_uri'),
            auth_provider_x509_cert_url: this.configService.get('fcm_auth_provider_x509_cert_url'),
            client_x509_cert_url: this.configService.get('fcm_client_x509_cert_url')
        }
        return params
    }
    
}