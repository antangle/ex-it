import { AsyncApiDocumentBuilder, AsyncServerObject } from "nestjs-asyncapi";


export const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('Socket Api')
    .setDescription('connect to wss://ex-it.app:3001')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .build();