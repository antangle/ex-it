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
    .setDescription('This is ex-it API documentation')
    .setVersion('1.0')
    .build();

export = swaggerConfig;