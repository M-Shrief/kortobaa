import { AppDataSource } from "../../db";
// Entites
import { User } from "./user.entity";
// Utils
import { comparePassword, hashPassword } from "../../utils/auth";
// Schema
import { createSchema, updateSchema } from "./user.schema";
export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  public async getInfo(id: string): Promise<User | false> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
      },
      cache: 1000 * 60,
    });
    if (!user) return false;
    return user;
  }

  public async signup(userData: User): Promise<User | false> {
    const isValid = await createSchema.isValid(userData);
    if (!isValid) return false;

    const password = await hashPassword(userData.password);
    const user = new User();

    user.name = userData.name;
    user.phone = userData.phone;
    user.password = password;

    const newUser = await this.userRepository.save(user);
    if (!newUser) return false;
    return newUser;
  }

  public async login(
    phone: string,
    password: string,
  ): Promise<User | false> {
    const existingUser = await AppDataSource.getRepository(
      User,
    ).findOneBy({ phone });
    if (!existingUser) return false;
    const isValid = await comparePassword(password, existingUser.password);
    if (!isValid) return false;
    return existingUser;
  }

  public async update(
    id: string,
    userData: User,
  ): Promise<number | false> {
    const isValid = await updateSchema.isValid(userData);
    if (!isValid) return false;

    const newUser = await this.userRepository.update(id, userData);
    if (!newUser.affected) return false;
    return newUser.affected;
  }

  public async remove(id: string): Promise<number | false> {
    const user = await this.userRepository.delete(id);
    if (!user.affected) return false;
    return user.affected;
  }
}
