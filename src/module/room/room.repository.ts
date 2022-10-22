import { Status } from 'src/consts/enum';
import { Review } from './../../entities/review.entity';
import { SearchRoomDto } from './dto/search-room.dto';
import { Ban } from './../../entities/ban.entity';
import { RoomJoin } from './../../entities/roomJoin.entity';
import { RoomTag } from './../../entities/roomTag.entity';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm';
import { Room } from '../../entities/room.entity'
import { consts } from 'src/consts/consts';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
    async getAllRoomsPaged(page: number = 0, take: number = consts.PAGINATION_TAKE){
        const status = [Status.HOST, Status.SPEAKER];
        return await this.createQueryBuilder('room')
            .select([
                'room.id', 
                'room.hardcore', 
                'room.created_at', 
                'room.title',
                'room.guest',
                'room.nickname',
            ])
            .addSelect('tag_array.tags, tag_array.tagIds')
            .addSelect('room_cnt.count')
            .where('room.is_online = true')
            .leftJoin((qb) => {
                return qb.select('room_tag.roomId AS roomId, ARRAY_AGG(tag.name) AS tags, ARRAY_AGG(tag.id) AS tagIds')
                .from(RoomTag, 'room_tag')
                .innerJoin('room_tag.tag', 'tag')
                .groupBy('room_tag.roomId')
                .orderBy('room_tag.roomId')
            }, 'tag_array', 'tag_array.roomId = room.id')
            .leftJoin((qb) => {
                return qb.select('room_join.roomId AS roomId, COALESCE(COUNT(*)::INTEGER, 0) AS count')
                    .from(RoomJoin, 'room_join')
                    .where('room_join.status IN (:...status)')
                    .setParameter('status', status)
                    .groupBy('room_join.roomId')
            }, 'room_cnt', 'room_cnt.roomId = room.id')
            .take(take)
            .skip(page * take)
            .getRawMany();
    }

    async searchRoomsPaged(
        userId: number, 
        searchRoomDto: SearchRoomDto
    ){
        const {tag, title, take, page} = searchRoomDto;
        const status = Status.GUEST;
        let query = await this.createQueryBuilder('room')
            .distinct(true)
            .select([
                'room.id', 
                'room.hardcore AS hardcore', 
                'room.created_at', 
                'room.title AS title',
                'room.guest AS guest',    
                'room.nickname AS nickname',
                'room.roomname AS roomname',
            ])
            .addSelect('CASE WHEN room.is_occupied IS NOT NULL THEN True ELSE False END', 'is_occupied')
            .addSelect('tag_array.tags, tag_array.tagIds')
            .addSelect('COALESCE(guests.guest_count::INTEGER, 0) AS guest_count')
            .where('room.is_online = true')
            .andWhere('room.title LIKE :title', {title: `%${title}%`})
            //ban list
            .andWhere((qb) => {
                const subQuery = qb.subQuery()
                    .select('ban.bannedUserId')
                    .from(Ban, 'ban')
                    .where('ban.userId = :userId')
                    .getQuery();
                return "room.createUserId NOT IN " + subQuery;
            })
            //don't show if reviewed
            .andWhere((qb) => {
                const subQuery = qb.subQuery()
                    .select()
                    .from(Review, 'review')
                    .where('review.roomId = room.id')
                    .getQuery();
                return "NOT EXISTS " + subQuery;
            })
            .setParameter('userId', userId)
            .innerJoin('room.room_tag', 'room_tag')
            .leftJoin((qb) => {
                return qb.subQuery()
                    .select('room_tag.roomId AS roomId, ARRAY_AGG(tag.name ORDER BY tag.id) AS tags, ARRAY_AGG(tag.id ORDER BY tag.id) AS tagIds')
                    .from(RoomTag, 'room_tag')
                    .innerJoin('room_tag.tag', 'tag')
                    .groupBy('room_tag.roomId')
            }, 'tag_array', 'tag_array.roomId = room.id')
            .leftJoin((qb) => {
                return qb.select('room_join.roomId AS roomId, COUNT(room_join.roomId) AS guest_count')
                    .from(RoomJoin, 'room_join')
                    .where('room_join.status = :status')
                    .andWhere('room_join.out = :out', {out: false})
                    .groupBy('room_join.roomId')
                }, 'guests', 'guests.roomId = room.id')
            .setParameter('status', status)
            .innerJoin('room_tag.tag', 'tag')
            .orderBy('room.created_at', 'DESC')
        if(tag != ''){
            query = query
                .andWhere('tag.name = :tag')
                .setParameter('tag', tag);
        }

        query = query
            .offset(take*page)
            .limit(take)

        return await query.getRawMany();
    }

    async guestCount(roomId: number){
        return this.createQueryBuilder('room')
            .select('COUNT(room_join.*) AS count')
            .where('room.id = :roomId', {roomId: roomId})
            .andWhere('room_join.status = :status', {status : "guest"})
            .leftJoin('room.room_join', 'room_join')
            .groupBy('room_join.roomId')
            .getRawOne()
    }
}