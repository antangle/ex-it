
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

const httpsConfig = {
    key: fs.readFileSync(path.join(__dirname, '/../../static/cert/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/../../static/cert/cert.pem'))
}

export function getServer(devmode, server){
    if(devmode == 'dev'){
        return https.createServer(httpsConfig, server);
    } else{
        //in production, ALB takes care of ssl then forwards to http.
        return http.createServer(server);
    }
}

export default httpsConfig;