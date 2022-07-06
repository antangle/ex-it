import { RoomJoin } from './../../entities/roomJoin.entity';
import { RoomTag } from './../../entities/roomTag.entity';
import { Tag } from './../../entities/tag.entity';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm';
import { Room } from '../../entities/room.entity'

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
    async getAllRoomsPaged(page: number = 0, take: number = 10){
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

    async searchRoomsPaged(tagId?: number, searchTitle?: string, page: number = 0, take: number = 10){
        const status = ['host', 'guest'];
        let query = await this.createQueryBuilder('room')
            .distinct(true) 
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
            .andWhere('room.title LIKE :title', {title: `%${searchTitle}%`})
            .innerJoin('room.room_tag', 'room_tag')
            .leftJoin((qb) => {
                return qb.select('room_tag.roomId AS roomId, ARRAY_AGG(tag.name ORDER BY tag.id) AS tags, ARRAY_AGG(tag.id ORDER BY tag.id) AS tagIds')
                .from(RoomTag, 'room_tag')
                .innerJoin('room_tag.tag', 'tag')
                .groupBy('room_tag.roomId')
            }, 'tag_array', 'tag_array.roomId = room.id')
            .leftJoin((qb) => {
                return qb.select('room_join.roomId AS roomId, COALESCE(COUNT(*)::INTEGER, 0) AS count')
                    .from(RoomJoin, 'room_join')
                    .where('room_join.status IN (:...status)')
                    .setParameter('status', status)
                    .groupBy('room_join.roomId')
            }, 'room_cnt', 'room_cnt.roomId = room.id')


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

    async getRooms(){
        return await this.createQueryBuilder()
            .select('ARRAY_AGG(tag.name)')
            .from(Tag, 'tag')
        }
}