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
