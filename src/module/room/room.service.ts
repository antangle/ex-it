import { Status } from 'src/consts/enum';
import { UpdateRoomDto } from './dto/update-room.dto';
import { NotExistsException } from './../../exception/not-exist.exception';
import { UpdateRoomJoinDto } from './dto/room-join-update.dto';
import { Ban } from './../../entities/ban.entity';
import { RoomEndDto } from './dto/room-end.dto';
import { reviewMapperArray } from './../../functions/util.functions';
import { Review } from './../../entities/review.entity';
import { parseReview } from 'src/functions/util.functions';
import { RoomJoinRepository } from './room-join.repository';
import { RoomJoin } from './../../entities/roomJoin.entity';
import { RoomTag } from './../../entities/roomTag.entity';
import { RoomRepository } from './room.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserRepository } from './../user/user.repository';
import { User } from './../../entities/user.entity';
import { UnhandledException } from './../../exception/unhandled.exception';
import { DatabaseException } from './../../exception/database.exception';
import { Repository, InsertResult, TypeORMError, In } from 'typeorm';
import { Tag } from './../../entities/tag.entity';
import { QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import consts from 'src/consts/consts';
import { Room } from 'src/entities/room.entity';

@Injectable()
export class RoomService {
    constructor(
        private userRepository: UserRepository,
        private roomRepository: RoomRepository,
        private roomJoinRepository: RoomJoinRepository,
        @InjectRepository(Tag) private tagRepository: Repository<Tag>,
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
        @InjectRepository(RoomTag) private roomTagRepository: Repository<RoomTag>,
        @InjectRepository(Ban) private banRepository: Repository<Ban>,
    ){}

    async getMainTags(queryRunner ?: QueryRunner){
        const tagRepository = queryRunner ? queryRunner.manager.getRepository(Tag) : this.tagRepository;
        try{
            const tags: Tag[] = await tagRepository.find({
                select: ['id', 'name'],
                where: { is_popular: true },
                order: {
                    'id': 'ASC'
                }
            });
            if(!tags) throw new NotExistsException(consts.TARGET_NOT_EXIST, consts.GET_MAIN_TAGS_ERROR_CODE);
            return tags;
        } catch(err){
            if(err instanceof NotExistsException) throw err;
            else throw new UnhandledException(this.getMainTags.name, consts.GET_MAIN_TAGS_ERROR_CODE, err);
        }
    }

    async checkCustomTags(customTags: Tag[], queryRunner ?: QueryRunner){
        const tagRepository = queryRunner ? queryRunner.manager.getRepository(Tag) : this.tagRepository;
        try{

            const tags = await tagRepository.createQueryBuilder('tag')
                .insert()
                .values(customTags)
                .orUpdate({
                    conflict_target: ['name'],
                    overwrite: ['name']
                })
                .returning('id')
                .execute();
            return tags.raw;
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.INSERT_FAILED, consts.GET_MAIN_TAGS_ERROR_CODE, err);
            else throw new UnhandledException(this.getMainTags.name, consts.GET_MAIN_TAGS_ERROR_CODE, err);
        }
    }

   /*  async getTopics(tagId: number, queryRunner ?: QueryRunner){
        const tagRepository = queryRunner ? queryRunner.manager.getRepository(Tag) : this.tagRepository;
        try{
            const tags = await tagRepository.createQueryBuilder('tag')
                .select('tag.id, tag.name')
                .where('tag.parentId = :id', {id: tagId})
                .getRawMany();
            
            if(!tags) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_TOPICS_ERROR_CODE);
            return tags;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMainTags.name, consts.GET_TOPICS_ERROR_CODE, err);
        }
    } */

    async createRoom(createRoomDto: Room, queryRunner: QueryRunner): Promise<InsertResult>{
        const roomRepository = queryRunner.manager.getCustomRepository(RoomRepository);
        try{
            const room = await roomRepository.insert(createRoomDto);
            return room;
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.INSERT_FAILED, consts.CREATE_ROOM_ERROR_CODE, err);
            else throw new UnhandledException(this.createRoom.name, consts.CREATE_ROOM_ERROR_CODE, err);
        }
    }
    parseSetToRoomTags(tags: Set<number>, roomId: number): RoomTag[]{
        const data = [];
        tags.forEach(x => data.push({
            room: roomId,
            tag: x
        }))
        return data;        
    }
    parseCustomTags(customTags: Array<string>):Tag[]{
        const data = [];
        customTags.map(x => data.push({
            name: x
        }))
        return data;        
    }
    
    makeRoomJoinDto(room: Room, user: User, status: string): RoomJoin{
        return {
            room: room,
            user: user,
            status: status
        }; 
    }

    async saveRoomTags(roomtags: RoomTag[], queryRunner?: QueryRunner){
        const roomTagRepository = queryRunner ? queryRunner.manager.getRepository(RoomTag) : this.roomTagRepository;
        try{
            return await roomTagRepository.createQueryBuilder('room_tag')
                .insert()
                .into(RoomTag)
                .values(roomtags)
                .execute();
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.INSERT_FAILED, consts.SAVE_ROOM_TAGS_ERROR_CODE, err);
            else throw new UnhandledException(this.saveRoomTags.name, consts.SAVE_ROOM_TAGS_ERROR_CODE, err);
        }
    }

    async createReview(review: Review, queryRunner?: QueryRunner){
        const reviewRepository = queryRunner ? queryRunner.manager.getRepository(Review) : this.reviewRepository;
        try{
            return await reviewRepository.createQueryBuilder('review')
                .insert()
                .into(Review)
                .values(review)
                .execute();

        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.INSERT_FAILED, consts.CREATE_REVIEW_ERROR_CODE, err);
            else throw new UnhandledException(this.createReview.name, consts.CREATE_REVIEW_ERROR_CODE, err);
        }
    }

    async getAllRooms(page?:number, take?: number, queryRunner?: QueryRunner){
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            const rooms = await roomRepository.getAllRoomsPaged(page, take);
            return rooms;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMainTags.name, consts.GET_ALL_ROOMS_ERROR_CODE, err);
        }
    }

    async getSearchedRooms(
        userId: number, 
        tagId: number, 
        searchTitle: string, 
        page: number, 
        take: number, 
        queryRunner?: QueryRunner
    ){
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            const rooms = await roomRepository.searchRoomsPaged(userId, tagId, searchTitle, page, take);
            return rooms;
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.DATABASE_ERROR, consts.GET_ALL_ROOMS_ERROR_CODE, err);
            else throw new UnhandledException(this.getMainTags.name, consts.GET_ALL_ROOMS_ERROR_CODE, err);
        }
    }

    async joinRoom(roomJoinDto: UpdateRoomJoinDto, queryRunner?: QueryRunner){
        const roomJoinRepository = queryRunner ? queryRunner.manager.getRepository(RoomJoin) : this.roomJoinRepository;
        try{
            return await roomJoinRepository.insert(roomJoinDto);            
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.INSERT_FAILED, consts.JOIN_ROOM_ERROR_CODE, err);
            else throw new UnhandledException(this.getMainTags.name, consts.JOIN_ROOM_ERROR_CODE, err);
        }
    }

    async findRoomUser(roomId: number, queryRunner?: QueryRunner): Promise<User>{
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            const room = await roomRepository.findOne({
                where: {id: roomId},
                relations: ['create_user']
            });
            console.log(room);
            if(!room.create_user) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.FIND_ROOM_USER);
            return room.create_user;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.findRoomUser.name, consts.FIND_ROOM_USER, err);
        }
    }

    async updateRoomJoin(userId: number, roomId: number, updateRoomJoinDto: UpdateRoomJoinDto, queryRunner?: QueryRunner){
        const roomJoinRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomJoinRepository) : this.roomJoinRepository;
        try{
            await roomJoinRepository.updateTime(userId, roomId, updateRoomJoinDto);

        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.UPDATE_FAILED, consts.UPDATE_ROOM_JOIN_ERROR_CODE, err);
            else throw new UnhandledException(this.updateRoomJoin.name, consts.UPDATE_ROOM_JOIN_ERROR_CODE, err);
        }
    }

    async getUserIdFromStatus(roomId: number, status: string, queryRunner?: QueryRunner): Promise<number>{
        const roomJoinRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomJoinRepository) : this.roomJoinRepository;
        try{            
            const roomJoin = await roomJoinRepository.findOne({
                where: {
                    roomId: roomId,
                    status: status
                },
                order: {
                    created_at: 'DESC'
                },
            })
            if(!roomJoin) throw new NotExistsException(consts.TARGET_NOT_EXIST, consts.GET_USERID_FROM_STATUS_ERROR_CODE);

            return roomJoin.userId;
        } catch(err){
            if(err instanceof NotExistsException) throw err;
            else if(err instanceof TypeORMError) throw new DatabaseException(consts.UPDATE_FAILED, consts.GET_USERID_FROM_STATUS_ERROR_CODE, err);
            else throw new UnhandledException(this.getUserIdFromStatus.name, consts.GET_USERID_FROM_STATUS_ERROR_CODE, err);
        }
    }

    async updateRoomOnline(roomId: number, updateRoomDto: UpdateRoomDto, queryRunner?: QueryRunner){
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            return await roomRepository.update(roomId, updateRoomDto);
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.UPDATE_FAILED, consts.UPDATE_ROOM_ONLINE_ERROR_CODE, err);
            else throw new UnhandledException(this.updateRoomOnline.name, consts.UPDATE_ROOM_ONLINE_ERROR_CODE, err);
        }
    }

    async banUser(mainUser: User, banUser: User, queryRunner?: QueryRunner): Promise<any>{
        const banRepository = queryRunner ? queryRunner.manager.getRepository(Ban) : this.banRepository;
        try{
            const ban: Ban = {
                user: mainUser,
                banned_user: banUser
            }
            const result = await banRepository.insert(ban);
            if(!result) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.FIND_ROOM_USER);
            return result;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.findRoomUser.name, consts.FIND_ROOM_USER, err);
        }
    }


    //todo
    async getUserInfo(userId: number, queryRunner?: QueryRunner){
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        const roomJoinRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomJoinRepository) : this.roomJoinRepository;
        try{

            const userInfo = await userRepository.getProfileQuery(userId);
            const tags = await roomJoinRepository.getMostUsedTags(userId);
            const reviews = await userRepository.getReviewCount(userId);
            const parsedReviews = parseReview(reviews);
            return {
                userInfo: userInfo[0],
                usedTags: this.parseTags(tags),
                reviews: parsedReviews
            }
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getUserInfo.name, consts.GET_USER_INFO_ERROR_CODE, err);
        }
    }

    async findRoom(roomId: number, queryRunner?: QueryRunner){
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            const room = await roomRepository.findOne(roomId);
            if(!room) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.FIND_ROOM_ERROR_CODE);
            
            let countObservers = await roomRepository.observerCount(roomId);
            let observers;
            if(!countObservers) observers = 0;
            else observers = countObservers.count

            return {room, observer_count: observers};
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.findRoom.name, consts.FIND_ROOM_ERROR_CODE, err);
        }
    }

    async checkOccupied(roomId: number, queryRunner?: QueryRunner){
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            const room = await roomRepository.findOne(roomId);
            return room.is_occupied;
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.DATABASE_ERROR, consts.CHECK_OCCUPIED_ERROR_CODE, err);
            else throw new UnhandledException(this.checkOccupied.name, consts.CHECK_OCCUPIED_ERROR_CODE, err);
        }
    }

    findReview(){
        return reviewMapperArray.slice(1);
    }

    parseTags(tags: any[]){
        const parsed = [];
        tags.map(x => {
            parsed.push(x.tag)
        });
        return parsed;
    }

    makeReview(roomEndDto: RoomEndDto, fellow_id: number): Review {
        return {
            mode: roomEndDto.review_mode+ 1,
            title: reviewMapperArray[roomEndDto.review_mode + 1],
            user: {id: fellow_id},
            room: {id: roomEndDto.room_id}
        }
    }

}