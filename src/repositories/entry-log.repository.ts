import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { EntryLog } from '../entities/entry-log.entity';
import { EntryEventEnum } from '../shared/entry-event.enum';

@Injectable()
export class EntryLogRepository extends BaseRepository<EntryLog> {
  constructor(
    @InjectRepository(EntryLog)
    repo: Repository<EntryLog>,
  ) {
    super(repo);
  }

  public async insertManyEnterExit(
    entries: Array<{
      userId: string;
      areaId: string;
      event: EntryEventEnum;
    }>,
  ): Promise<void> {
    if (entries.length === 0) return;

    for (const entry of entries) {
      const log = this.create({
        userId: entry.userId,
        areaId: entry.areaId,
        event: entry.event,
      });
      await this.save(log);
    }
  }

  public async findWithFilters(
    userId?: string,
    areaId?: string,
    event?: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<EntryLog[]> {
    const queryBuilder = this.repo
      .createQueryBuilder('entryLog')
      .orderBy('entryLog.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    if (userId) {
      queryBuilder.andWhere('entryLog.userId = :userId', { userId });
    }

    if (areaId) {
      queryBuilder.andWhere('entryLog.areaId = :areaId', { areaId });
    }

    if (event && (event === 'ENTER' || event === 'EXIT')) {
      queryBuilder.andWhere('entryLog.event = :event', { event });
    }

    return queryBuilder.getMany();
  }

  public async findWithFiltersAndCount(
    userId?: string,
    areaId?: string,
    event?: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<[EntryLog[], number]> {
    const queryBuilder = this.repo
      .createQueryBuilder('entryLog')
      .orderBy('entryLog.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    if (userId) {
      queryBuilder.andWhere('entryLog.userId = :userId', { userId });
    }

    if (areaId) {
      queryBuilder.andWhere('entryLog.areaId = :areaId', { areaId });
    }

    if (event && (event === 'ENTER' || event === 'EXIT')) {
      queryBuilder.andWhere('entryLog.event = :event', { event });
    }

    return queryBuilder.getManyAndCount();
  }
}
