import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository, SelectQueryBuilder } from "typeorm";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    getSettingInfo(email: string): Promise<any>{
        return this.createQueryBuilder('user')
            .select('user.nickname AS nickname, review.title')
            .addSelect('room.total_time, room.total_call')
            .where('user.email = :email', {email: email})
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
                },'review', 'review.userId = user.id')
            .leftJoin((qb) => {
                return qb.select('user.id as userId')
                    .addSelect('SUM(room.talk_time) AS total_time')
                    .addSelect('SUM(room.call_time) AS total_call')
                    .from(User, 'user')
                    .where('user.email = :email', {email: email})
                    .leftJoin('user.room_join', 'roomjoin')
                    .leftJoin('roomjoin.room', 'room')
                    .groupBy('user.id')
            }, 'room', 'room.userId = user.id')
            .getRawOne()
    }

    getReviewCount(email: string): Promise<any[]>{
        return this.createQueryBuilder('user')
            .select('review.mode, COUNT(review.mode) AS count')
            .where('user.email = :email', {email: email})
            .leftJoin('user.review', 'review')
            .groupBy('user.id, review.mode')
            .getRawMany()
    }
        
    getRoomTalkTime(email: string, date: Date): Promise<any[]>{
        return this.createQueryBuilder('user')
            .select('SUM(room.talk_time) AS total_time')
            .addSelect('SUM(room.call_time) AS total_call')
            .where('user.email = :email', {email: email})
            .andWhere('room.created_at >= :date', {date: date})
            .leftJoin('user.room_join', 'roomjoin')
            .leftJoin('roomjoin.room', 'room')
            .groupBy('user.id')
            .getRawOne();
    }

}