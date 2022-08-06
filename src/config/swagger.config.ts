import { DocumentBuilder } from "@nestjs/swagger";

const swaggerConfig = new DocumentBuilder()
    .addBearerAuth({
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        name: 'access_token',
        description: 'Enter JWT access token',
        in: 'header'
    }, 'access_token')
    .setTitle('ex-it')
    .setDescription(
        `This is ex-it API documentation\n
        api중 오른쪽에 자물쇠 문양이 있으면 반드시 로그인 상태에서만 접근이 가능합니다.
        기본적으로 자물쇠 문양이 있다면 Authorization 헤더에 bearer scheme으로 access_token을 넣고,
        Refresh-Token 헤더에 refresh_token을 넣어주시면 됩니다.

        socket은 socket.io를 사용하며, /async-api에서 확인할 수 있습니다.
        `)
    .setVersion('1.0')
    .build();

export = swaggerConfig;