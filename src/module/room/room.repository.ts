import { Ban } from './../../entities/ban.entity';
import { User } from 'src/entities/user.entity';
import { RoomJoin } from './../../entities/roomJoin.entity';
import { RoomTag } from './../../entities/roomTag.entity';
import { Tag } from './../../entities/tag.entity';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm';
import { Room } from '../../entities/room.entity'
import consts from 'src/consts/consts';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
    async getAllRoomsPaged(page: number = 0, take: number = consts.PAGINATION_TAKE){
        const status = ['host', 'guest'];
        return await this.createQueryBuilder('room')
            .select([
                'room.id', 
                'room.hardcore', 
                'room.created_at', 
                'room.title',
                'room.observer',
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
        tagId: number, 
        searchTitle: string, 
        page: number, 
        take: number
    ){
        const status = 'observer';
        let query = await this.createQueryBuilder('room')
            .distinct(true) 
            .select([
                'room.id', 
                'room.hardcore AS hardcore', 
                'room.created_at AS created_at', 
                'room.title AS title',
                'room.observer AS observer',    
                'room.nickname AS nickname',
                'room.is_occupied AS is_occupied',
                'room.roomname AS roomname'
            ])
            .addSelect('tag_array.tags, tag_array.tagIds')
            .addSelect('observer.observers')
            .where('room.is_online = true')
            .andWhere('room.title LIKE :title', {title: `%${searchTitle}%`})
            //ban list
            .andWhere((qb) => {
                const subQuery = qb.subQuery()
                    .select('ban.bannedUserId')
                    .from(Ban, 'ban')
                    .where('ban.userId = :userId')
                    .getQuery();
                return "room.createUserId NOT IN " + subQuery;
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
                return qb.select('room_join.roomId AS roomId, COUNT(*) AS observers')
                    .from(RoomJoin, 'room_join')
                    .where('room_join.status = :status')
                    .groupBy('room_join.roomId')
                }, 'observer', 'observer.roomId = room.id')
            .setParameter('status', status)
                

        if(tagId != 0){
            query = query
                .andWhere('room_tag.tagId = :tagId')
                .setParameter('tagId', tagId);
        }
        return query
            .take(take)
            .skip(take*page)
            .getRawMany();

    }

    async observerCount(roomId: number){
        return this.createQueryBuilder('room')
            .select('COUNT(room_join.*) AS count')
            .where('room.id = :roomId', {roomId: roomId})
            .andWhere('room_join.status = :observer', {observer : "observer"})
            .leftJoin('room.room_join', 'room_join')
            .groupBy('room_join.roomId')
            .getRawOne()
    }
}