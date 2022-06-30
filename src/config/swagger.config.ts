import { DocumentBuilder } from "@nestjs/swagger";

const swaggerConfig = new DocumentBuilder()
    .addBearerAuth({
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        name: 'access_token',
        description: 'Enter JWT token',
        in: 'header'
    }, 'access_token')
    .setTitle('ex-it')
    .setDescription('The ex-it API description')
    .setVersion('1.0')
    .build();

export = swaggerConfig;