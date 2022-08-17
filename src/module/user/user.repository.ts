import { UpdateUserDto } from './dto/update-user.dto';
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
        const status = ['host', 'speaker'];
        let query = this.createQueryBuilder('user')
            .select('user.nickname AS nickname, user.alarm AS alarm')
            .addSelect([
                'room_agg.total_time::integer', 
                'room_agg.total_call::integer', 
                'room_agg.connection::integer'
            ])
            .leftJoin((qb) => {
                return qb.subQuery()
                    .select('user.id as userId')
                    .addSelect([
                        'SUM(room_join.total_time) AS total_time', 
                        'SUM(room_join.call_time) AS total_call',
                        'COUNT(room_join.id) AS connection'
                    ])
                    .from(User, 'user')
                    .where('room_join.status IN (:...status)')
                    .leftJoin('user.room_join', 'room_join')
                    .groupBy('user.id')
            }, 'room_agg', 'room_agg.userId = user.id')
            .setParameter('status', status);

        if(typeof param === 'string') query = query.where('user.email = :email', {email: param})
        else if(typeof param === 'number') query = query.where('user.id = :userId', {userId: param})

        return await query.andWhere('user.deleted_at IS NULL')
            .getRawOne();
    }

    async getReviewCount(param: string | number): Promise<any[]>{
        let query = this.createQueryBuilder('user')
            .select('user.nickname AS nickname')
            .addSelect('review.reviewMapperId, COUNT(review.reviewMapperId) AS count')
            
            .leftJoin('user.review', 'review')
            .groupBy('user.nickname, review.reviewMapperId')

        if(typeof param === 'string') query = query.where('user.email = :email', {email: param})
        else if(typeof param === 'number') query = query.where('user.id = :userId', {userId: param})
        
        return await query
            .andWhere('user.deleted_at IS NULL')
            .getRawMany();
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
            .select('SUM(room.total_time) AS total_time')
            .where('user.id = :userId', {userId: userId})
            .leftJoin('user.room_join', 'room_join')
            .leftJoin('room_join.room', 'room')
            .groupBy('user.id')
            .getRawOne();
    }

    async getRoomTalkTime(email: string, date?: Date): Promise<any>{
        return await this.createQueryBuilder('user')
            .select('SUM(room.total_time) AS total_time')
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