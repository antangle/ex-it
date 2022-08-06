import { AsyncApiDocumentBuilder, AsyncServerObject } from "nestjs-asyncapi";


export const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('Socket Api')
    .setDescription(`
        socket.io를 사용하며, wss://ex-it.app:3001에 접속
        SUB은 서버 입장에서 listening하는 event, PUB은 서버에서 emit하는 이벤트입니다.
    `)
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .build();