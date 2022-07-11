import { RoomJoin } from 'src/entities/roomJoin.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository, SelectQueryBuilder } from "typeorm";
import { tags } from 'src/config/swagger.config';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    /*
        get max review.
        .leftJoin((qb) => {
        return qb.select('user.id AS userId, review.title')
            .addSelect('COUNT(review.title) AS count')
            .from(User, 'user')
            .where('user.email = :email', {email: email})
            .leftJoin('user.review', 'review')
            .groupBy('user.id, review.title')
            .orderBy('count', 'DESC')
            .orderBy('review.title', 'ASC')
            .limit(1)
        },'review', 'review.userId = user.id')  */

    //get max review count
    async getProfileQuery(param: string | number): Promise<any>{

        let query = this.createQueryBuilder('user')
            .select('user.nickname AS nickname, user.alarm AS alarm')
            .addSelect([
                'room_agg.total_time', 
                'room_agg.total_call', 
                'room_agg.connection'
            ])
            .leftJoin((qb) => {
                return qb.select('user.id as userId')
                    .addSelect([
                        'SUM(room.talk_time) AS total_time', 
                        'SUM(room.call_time) AS total_call',
                        'COUNT(room.id) AS connection'
                    ])
                    .from(User, 'user')
                    .andWhere('room.is_occupied IS NOT NULL')
                    .leftJoin('user.room_join', 'room_join')
                    .leftJoin('room_join.room', 'room')
                    .groupBy('user.id')
            }, 'room_agg', 'room_agg.userId = user.id')

        if(typeof param === 'string') query = query.where('user.email = :email', {email: param})
        else if(typeof param === 'number') query = query.where('user.id = :userId', {userId: param})

        return await query.getRawMany();
    }

    async getReviewCount(param: string | number): Promise<any[]>{
        let query = this.createQueryBuilder('user')
            .select('user.nickname AS nickname')
            .addSelect('review.mode, COUNT(review.mode) AS count')
            .leftJoin('user.review', 'review')
            .groupBy('user.nickname, review.mode')

        if(typeof param === 'string') query = query.where('user.email = :email', {email: param})
        else if(typeof param === 'number') query = query.where('user.id = :userId', {userId: param})
        return await query.getRawMany();
    }
    

/* 
    async getMaxReviewName(userId: number){
        return await this.createQueryBuilder('user')
            .select('review.title')
            .addSelect('COUNT(review.title) AS count')
            .where('user.id = :id', {id: userId})
            .leftJoin('user.review', 'review')
            .groupBy('review.title')
            .orderBy('count', 'DESC')
            .orderBy('review.title', 'ASC')
            .limit(1)
            .getRawOne()
    }

    async getRoomTotalTalkTime(userId: number): Promise<any>{
        return await this.createQueryBuilder('user')
            .select('SUM(room.talk_time) AS total_time')
            .where('user.id = :userId', {userId: userId})
            .leftJoin('user.room_join', 'room_join')
            .leftJoin('room_join.room', 'room')
            .groupBy('user.id')
            .getRawOne();
    }

    async getRoomTalkTime(email: string, date?: Date): Promise<any>{
        return await this.createQueryBuilder('user')
            .select('SUM(room.talk_time) AS total_time')
            .addSelect('SUM(room.call_time) AS total_call')
            .where('user.email = :email', {email: email})
            .andWhere('room.created_at >= :date', {date: date})
            .leftJoin('user.room_join', 'roomjoin')
            .leftJoin('roomjoin.room', 'room')
            .groupBy('user.id')
            .getRawOne();
    }
 */
}