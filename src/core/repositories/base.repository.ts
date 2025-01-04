import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose'

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data)
    return document.save()
  }

  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec()
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec()
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec()
  }

  async update(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec()
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec()
  }

  async softDelete(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date()
          }
        },
        { new: true }
      )
      .exec()
  }

  async reactivate(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isDeleted: false,
            deletedAt: null
          }
        },
        { new: true }
      )
      .exec()
  }
}
