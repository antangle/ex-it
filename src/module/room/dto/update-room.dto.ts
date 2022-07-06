import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';

export class UpdateUserDto extends PartialType(CreateRoomDto) {
    talk_time: number;
    call_time: number;
}
