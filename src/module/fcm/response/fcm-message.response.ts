import { BaseOKResponseWithTokens } from "src/response/response.dto";



export abstract class FcmMessageResponse extends BaseOKResponseWithTokens {
    constructor() {
        super();
    }
}