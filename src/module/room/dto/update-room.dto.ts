import { Room } from 'src/entities/room.entity';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(Room) {}
