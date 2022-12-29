import { BadRequestCustomException } from './../../exception/bad-request.exception';
import { VersionMismatchError } from './../../exception/version.exception';
import { RedisService } from './../redis/redis.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SearchRoomDto } from './dto/search-room.dto';
import { UtilService } from './../util/util.service';
import { UpdateRoomDto } from './dto/update-room.dto';
import { NotExistsException } from './../../exception/not-exist.exception';
import { UpdateRoomJoinDto } from './dto/room-join-update.dto';
import { Ban } from './../../entities/ban.entity';
import { RoomEndDto } from './dto/room-end.dto';
import { Review } from './../../entities/review.entity';
import { RoomJoinRepository } from './room-join.repository';
import { RoomJoin } from './../../entities/roomJoin.entity';
import { RoomTag } from './../../entities/roomTag.entity';
import { RoomRepository } from './room.repository';
import { UserRepository } from './../user/user.repository';
import { User } from './../../entities/user.entity';
import { UnhandledException } from './../../exception/unhandled.exception';
import { DatabaseException } from './../../exception/database.exception';
import { Repository, InsertResult, TypeORMError, OptimisticLockVersionMismatchError } from 'typeorm';
import { Tag } from './../../entities/tag.entity';
import { QueryRunner } from 'typeorm';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { consts } from 'src/consts/consts';
import { Room } from 'src/entities/room.entity';
import { CustomError } from 'src/exception/custom.exception';
import { error } from 'console';

@Injectable()
export class RoomService {
    constructor(
        private utilService: UtilService,
        private redisService: RedisService,
        private userRepository: UserRepository,
        private roomRepository: RoomRepository,
        private roomJoinRepository: RoomJoinRepository,
        @InjectRepository(Tag) private tagRepository: Repository<Tag>,
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
        @InjectRepository(RoomTag) private roomTagRepository: Repository<RoomTag>,
        @InjectRepository(Ban) private banRepository: Repository<Ban>,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,

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

    async createRoom(createRoomDto: Room, queryRunner: QueryRunner): Promise<Room>{
        const roomRepository = queryRunner.manager.getCustomRepository(RoomRepository);
        try{
            const room = await roomRepository.insert(createRoomDto);
            return room.raw[0];
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
            status: status,
            out: false
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

    async getTagNames(tags: Set<number>, queryRunner?: QueryRunner){
        const tagRepository = queryRunner ? queryRunner.manager.getRepository(Tag) : this.tagRepository;
        try{
            const tagNames = await tagRepository.createQueryBuilder('tag')
                .select('tag.name')
                .where('tag.id IN (:...tags)', {tags: Array.from(tags)})
                .getRawMany();

            const data = [];
            if(tagNames){
                tagNames.forEach(x => data.push(x.tag_name));
            }
            return data;
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
        searchRoomDto: SearchRoomDto, 
        queryRunner?: QueryRunner
    ){
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            const rooms = await roomRepository.searchRoomsPaged(userId, searchRoomDto);
            return rooms;
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.DATABASE_ERROR, consts.GET_ALL_ROOMS_ERROR_CODE, err);
            else if(err instanceof CustomError) throw err;
            else throw new UnhandledException(this.getSearchedRooms.name, consts.GET_ALL_ROOMS_ERROR_CODE, err);
        }
    }

    async joinRoom(roomJoinDto: UpdateRoomJoinDto, queryRunner?: QueryRunner){
        const roomJoinRepository = queryRunner ? queryRunner.manager.getRepository(RoomJoin) : this.roomJoinRepository;
        try{
            return await roomJoinRepository.createQueryBuilder()
                .insert()
                .values(roomJoinDto)
                .orUpdate({
                    conflict_target: ['status', 'userId', 'roomId'],
                    overwrite: ['created_at']
                })
                .execute();
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.INSERT_FAILED, consts.JOIN_ROOM_ERROR_CODE, err);
            else throw new UnhandledException(this.joinRoom.name, consts.JOIN_ROOM_ERROR_CODE, err);
        }
    }

    async findRoomUser(roomId: number, queryRunner?: QueryRunner): Promise<User>{
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            const room = await roomRepository.findOne({
                where: {id: roomId},
                relations: ['create_user']
            });
            if(!room.create_user) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.FIND_ROOM_USER);
            return room.create_user;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.findRoomUser.name, consts.FIND_ROOM_USER, err);
        }
    }

    async updateRoomJoin(userId: number, roomId: number, status: string, updateRoomJoinDto: UpdateRoomJoinDto, queryRunner?: QueryRunner){
        const roomJoinRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomJoinRepository) : this.roomJoinRepository;
        try{
            const updateResult = await roomJoinRepository.updateTime(userId, roomId, status, updateRoomJoinDto);
//            if(updateResult.affected == 0) throw new NotExistsException(consts.TARGET_NOT_EXIST, consts.UPDATE_ROOM_JOIN_ERROR_CODE);
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.UPDATE_FAILED, consts.UPDATE_ROOM_JOIN_ERROR_CODE, err);
            else if(err instanceof CustomError) throw err;
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
            });

            return roomJoin ? roomJoin.userId : null;
        } catch(err){
            if(err instanceof NotExistsException) throw err;
            else if(err instanceof TypeORMError) throw new DatabaseException(consts.UPDATE_FAILED, consts.GET_USERID_FROM_STATUS_ERROR_CODE, err);
            else throw new UnhandledException(this.getUserIdFromStatus.name, consts.GET_USERID_FROM_STATUS_ERROR_CODE, err);
        }
    }

    async getHostAndSpeaker(roomId: number, queryRunner?: QueryRunner): Promise<any[]>{
        const roomJoinRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomJoinRepository) : this.roomJoinRepository;
        try{
            const roomjoins = await roomJoinRepository.getHostAndSpeaker(roomId);
            if(!roomjoins || roomjoins.length == 0) throw new NotExistsException(consts.TARGET_NOT_EXIST, consts.GET_HOST_AND_SPEAKER_ERROR_CODE);

            return roomjoins;
        } catch(err){
            if(err instanceof NotExistsException) throw err;
            else if(err instanceof TypeORMError) throw new DatabaseException(consts.DATABASE_ERROR, consts.GET_HOST_AND_SPEAKER_ERROR_CODE, err);
            else throw new UnhandledException(this.getHostAndSpeaker.name, consts.GET_HOST_AND_SPEAKER_ERROR_CODE, err);
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
    
    async updateRoomOccupiedLock(roomId: number, version: number, updateRoomDto: UpdateRoomDto, queryRunner?: QueryRunner){
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            const temp = await roomRepository.createQueryBuilder()
                .setLock("pessimistic_write")
                .update(Room)
                .where('id = :roomId', {roomId: roomId})
                .set(updateRoomDto)
                .returning("*")
                .execute()
            if(+temp.affected < 1) throw new NotExistsException(consts.TARGET_NOT_EXIST, consts.UPDATE_ROOM_OCCUPIED_ERROR_CODE)
            if(temp.raw[0].version != version+1) throw new VersionMismatchError(consts.VERSION_MISMATCH, consts.UPDATE_ROOM_OCCUPIED_LOCK_ERROR_CODE)
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.UPDATE_FAILED, consts.UPDATE_ROOM_OCCUPIED_LOCK_ERROR_CODE, err);
            else throw err;
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
            if(!userId) throw new BadRequestCustomException('userId not exist', consts.GET_USER_INFO_ERROR_CODE)

            const userInfo = await userRepository.getProfileQuery(userId);
            if(!userInfo) return null;

            const tags = await roomJoinRepository.getMostUsedTags(userId);
            const reviews = await userRepository.getReviewCount(userId);
            const parsedReviews = await this.utilService.parseReview(reviews);
            return {
                userInfo: userInfo,
                usedTags: this.parseTags(tags),
                reviews: parsedReviews,
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
            const talk_time = Math.floor((Date.now() - room.is_occupied.getTime()) / 1000);
            let countGuests = await roomRepository.guestCount(roomId);
            let guests;
            if(!countGuests) guests = 0;
            else guests = countGuests.count

            return {talk_time: talk_time, guest_count: guests};
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.findRoom.name, consts.FIND_ROOM_ERROR_CODE, err);
        }
    }

    async checkOccupied(roomId: number, queryRunner?: QueryRunner){
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            /* const speakerCache = await this.redisService.getRoomSpeakerCache(roomId);
            let isOccupied: boolean;
            if(speakerCache){
                isOccupied = true;
            } else{ */
            const room = await roomRepository.findOne(roomId);
            if(!room) throw new NotExistsException(consts.TARGET_NOT_EXIST, consts.CHECK_OCCUPIED_ERROR_CODE);
            const isOccupied = (room.is_occupied )? true : false || !room.is_online;
        
            return isOccupied;
            
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.DATABASE_ERROR, consts.CHECK_OCCUPIED_ERROR_CODE, err);
            else throw new UnhandledException(this.checkOccupied.name, consts.CHECK_OCCUPIED_ERROR_CODE, err);
        }
    }

    async findRoomById(roomId: number, queryRunner?: QueryRunner){
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            const room = await roomRepository.findOne({
                where: { id: roomId }
            });
            return room;
        } catch(err){
            if(err instanceof TypeORMError) throw new DatabaseException(consts.DATABASE_ERROR, consts.FIND_ROOM_BY_ID_ERROR_CODE, err);
            else throw new UnhandledException(this.findRoomById.name, consts.FIND_ROOM_BY_ID_ERROR_CODE, err);
        }
    }

    parseTags(tags: any[]){
        const parsed = [];
        tags.map(x => {
            parsed.push(x.tag)
        });
        return parsed;
    }

    findReview(){
        return this.utilService.findReviews();
    }

    makeReview(roomEndDto: RoomEndDto, fellow_id: number): Review {
        return {
            reviewMapper: {id: roomEndDto.review_id},
            user: {id: fellow_id},
            room: {id: roomEndDto.room_id}
        }
    }

}