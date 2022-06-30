import { Auth } from 'src/entities/auth.entity';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Auth)
export class AuthRepository extends Repository<Auth> {
    
}