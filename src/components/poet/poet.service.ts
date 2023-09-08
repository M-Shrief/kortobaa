// Database
import { AppDataSource } from "../../db";
// Redis
import redisClient from "../../redis";
// Entities
import { Poet } from "./poet.entity";
// Schema
import { createSchema, updateSchema } from "./poet.schema";
// Utills
import { filterAsync } from "../../utils/asyncFilterAndMap";
import { logger } from "../../utils/logger";

export class PoetService {
  private poetRepository = AppDataSource.getRepository(Poet);

  public async getAll(): Promise<Poet[] | false> {
    const poets = await this.poetRepository.find({
      select: {
        id: true,
        name: true,
        time_period: true,
      },
      relations: { poems: false },
      cache: true,
    });
    if (poets.length === 0) return false;
    return poets;
  }

  public async getOneWithLiterature(id: string): Promise<Poet | false> {
    let poet: Poet | null;

    const cached = await redisClient.get(`poet:${id}`);
    if (cached) {
      poet = JSON.parse(cached);
    } else {
      poet = await this.poetRepository.findOne({
        where: { id },
        select: {
          id: true,
          name: true,
          time_period: true,
          bio: true,
          poems: {
            id: true,
            intro: true,
          },
        },
        relations: ["poems"],
        cache: 1000 * 5,
      });

      await redisClient
        .set(`poet:${id}`, JSON.stringify(poet), { EX: 60 * 15 })
        .catch((err) => logger.error(err));
    }

    if (!poet) return false;
    return poet;
  }

  public async post(poetData: Poet): Promise<Poet | false> {
    const isValid = await createSchema.isValid(poetData);
    if (!isValid) return false;

    const newPoet = await this.poetRepository.save(poetData);
    if (!newPoet) return false;
    return newPoet;
  }

  public async postMany(
    PoetsData: Poet[],
  ): Promise<{ newPoets: Poet[]; nonValidPoets: Poet[] } | false> {
    const isValid = async (PoetData: Poet) =>
      await createSchema.isValid(PoetData);
    const isNotValid = async (PoetData: Poet) =>
      (await createSchema.isValid(PoetData)) === false;

    const validPoets: Poet[] = await filterAsync(PoetsData, isValid);
    const nonValidPoets: Poet[] = await filterAsync(PoetsData, isNotValid);

    const newPoets = await this.poetRepository.save(validPoets);
    if (!newPoets) return false;

    const result = { newPoets, nonValidPoets };
    return result;
  }

  public async update(id: string, poetData: Poet): Promise<number | false> {
    const isValid = await updateSchema.isValid(poetData);
    if (!isValid) return false;

    const newPoet = await this.poetRepository.update(id, poetData);
    if (!newPoet.affected) return false;
    return newPoet.affected;
  }

  public async remove(id: string): Promise<number | false> {
    const poet = await this.poetRepository.delete(id);
    if (!poet.affected) return false;
    return poet.affected;
  }
}
