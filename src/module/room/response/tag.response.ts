import { Tag } from '../../../entities/tag.entity';
import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";

abstract class TagsResponseData {
    @ApiProperty({
        isArray: true
    })
    tags: Tag;
}

export abstract class TagResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: TagsResponseData
}