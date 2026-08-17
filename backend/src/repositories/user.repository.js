import { UserModel } from "../models/user.model.js";
import { User } from "../domain/entities/User.js";

export class UserRepository {
  static toDomain(doc) {
    if (!doc) return null;
    return new User({
      id: doc._id.toString(),
      username: doc.username,
      passwordHash: doc.passwordHash,
      role: doc.role
    });
  }

  static toDatabase(entity) {
    if (!entity) return null;
    return {
      username: entity.username,
      passwordHash: entity.passwordHash,
      role: entity.role
    };
  }

  async findById(id) {
    const doc = await UserModel.findById(id);
    return UserRepository.toDomain(doc);
  }

  async findByUsername(username) {
    const doc = await UserModel.findOne({ username: username.toLowerCase() });
    return UserRepository.toDomain(doc);
  }

  async create(userEntity) {
    const dbObj = UserRepository.toDatabase(userEntity);
    const doc = await UserModel.create(dbObj);
    return UserRepository.toDomain(doc);
  }

  async update(id, userEntity) {
    const dbObj = UserRepository.toDatabase(userEntity);
    const doc = await UserModel.findByIdAndUpdate(id, dbObj, {
      new: true,
      runValidators: true
    });
    return UserRepository.toDomain(doc);
  }

  async delete(id) {
    await UserModel.findByIdAndDelete(id);
    return true;
  }
}
