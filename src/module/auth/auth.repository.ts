import { Auth } from 'src/entities/auth.entity';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from "typeorm";
import { UpdateAuthDto } from './dto/update-auth.dto';

@EntityRepository(Auth)
export class AuthRepository extends Repository<Auth> {
    async updateByEmailAndType(email: string, type: string, updateDto: UpdateAuthDto){
        return await this.createQueryBuilder('auth')
            .update(Auth, updateDto)
            .where('email = :email', {
                email: email
            })
            .andWhere('type = :type', {
                type: type
            })
            .returning('*')
            .execute();
    }
}