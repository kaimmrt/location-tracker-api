import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

export class BaseRepository<TEntity extends { id: string }> {
  protected readonly repo: Repository<TEntity>;

  constructor(repo: Repository<TEntity>) {
    this.repo = repo;
  }

  public create(data: DeepPartial<TEntity>): TEntity {
    return this.repo.create(data);
  }

  public async save(entity: TEntity): Promise<TEntity> {
    return this.repo.save(entity);
  }

  public async findAll(): Promise<TEntity[]> {
    return this.repo.find();
  }

  public async findById(id: string): Promise<TEntity | null> {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<TEntity> });
  }

  public async exists(where: FindOptionsWhere<TEntity>): Promise<boolean> {
    const count = await this.repo.count({ where });
    return count > 0;
  }
}
