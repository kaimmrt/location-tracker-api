import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { UserAreaState } from '../entities/user-area-state.entity';

@Injectable()
export class UserAreaStateRepository extends BaseRepository<UserAreaState> {
  constructor(
    @InjectRepository(UserAreaState)
    repo: Repository<UserAreaState>,
  ) {
    super(repo);
  }

  public async findByUserId(userId: string): Promise<UserAreaState[]> {
    return this.repo
      .createQueryBuilder('userAreaState')
      .where('userAreaState.userId = :userId', { userId })
      .getMany();
  }

  public async upsertState(
    userId: string,
    areaId: string,
    isInside: boolean,
  ): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .into(UserAreaState)
      .values({ userId, areaId, isInside })
      .orUpdate(['isInside', 'updatedAt'], ['userId', 'areaId'])
      .execute();
  }
}
