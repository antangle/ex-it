import { RoomJoin } from 'src/entities/roomJoin.entity';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomJoinDto extends PartialType(RoomJoin) {}
