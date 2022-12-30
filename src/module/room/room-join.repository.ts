import { UpdateRoomJoinDto } from './dto/room-join-update.dto';
import { RoomJoin } from '../../entities/roomJoin.entity';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm';
import { consts } from 'src/consts/consts';

@EntityRepository(RoomJoin)
export class RoomJoinRepository extends Repository<RoomJoin> {
    async getMostUsedTags(userId: number){
        const status = [consts.HOST, consts.SPEAKER];
        return await this.createQueryBuilder('room_join')
            .select('tag.name AS tag, COUNT(tag.id) AS count')
            .where('room_join.userId = :userId', {userId: userId})
            .andWhere('room_join.status IN (:...status)', {status: status})
            .innerJoin('room_tag', 'room_tag', 'room_tag.roomId = room_join.roomId')
            .innerJoin('room_tag.tag', 'tag')
            .groupBy('tag.id')
            .orderBy('count', 'DESC')
            .addOrderBy('tag.name', 'ASC')
            .limit(consts.LIMIT_MOST_USED_TAGS)
            .getRawMany();
    }

    async updateTime(userId: number, roomId: number, status: string, updateRoomJoinDto: UpdateRoomJoinDto){
        return await this.createQueryBuilder('room_join')
            .update()
            .set({
                total_time: () => 'total_time + :total_time',
                call_time: () => 'call_time + :call_time',
                out: () => `${updateRoomJoinDto.out}`
            })
            .where('status = :status', {status: status})
            .andWhere('userId = :userId', {userId: userId})
            .andWhere('roomId = :roomId', {roomId: roomId})
            .setParameters(updateRoomJoinDto)
            .returning(['id'])
            .execute();
    }

    async getHostAndSpeaker(roomId: number): Promise<any>{
        const status = consts.HOST;
        return await this.createQueryBuilder('room_join')
            .select('room_join.userId AS id')
            .addSelect('room.speakerId', 'speakerId')
            .where('room_join.roomId = :roomId', {roomId: roomId})
            .andWhere('room_join.status = :status')
            .setParameter('status', status)
            .innerJoin('room_join.room', 'room')
            .getRawOne();
    }
}