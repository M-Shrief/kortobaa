import { AppDataSource } from "../../db";
// Entites
import { Partner } from "./partner.entity";
// Utils
import { comparePassword, hashPassword } from "../../utils/auth";
// Schema
import { createSchema, updateSchema } from "./partner.schema";
export class PartnerService {
  private partnerRepository = AppDataSource.getRepository(Partner);
  public async getInfo(id: string): Promise<Partner | false> {
    const partner = await this.partnerRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
      },
      cache: 1000 * 60,
    });
    if (!partner) return false;
    return partner;
  }

  public async signup(partnerData: Partner): Promise<Partner | false> {
    const isValid = await createSchema.isValid(partnerData);
    if (!isValid) return false;

    const password = await hashPassword(partnerData.password);
    const partner = new Partner();

    partner.name = partnerData.name;
    partner.phone = partnerData.phone;
    partner.password = password;

    const newPartner = await this.partnerRepository.save(partner);
    if (!newPartner) return false;
    return newPartner;
  }

  public async login(
    phone: string,
    password: string,
  ): Promise<Partner | false> {
    const existingPartner = await AppDataSource.getRepository(
      Partner,
    ).findOneBy({ phone });
    if (!existingPartner) return false;
    const isValid = await comparePassword(password, existingPartner.password);
    if (!isValid) return false;
    return existingPartner;
  }

  public async update(
    id: string,
    partnerData: Partner,
  ): Promise<number | false> {
    const isValid = await updateSchema.isValid(partnerData);
    if (!isValid) return false;

    const newPartner = await this.partnerRepository.update(id, partnerData);
    if (!newPartner.affected) return false;
    return newPartner.affected;
  }

  public async remove(id: string): Promise<number | false> {
    const partner = await this.partnerRepository.delete(id);
    if (!partner.affected) return false;
    return partner.affected;
  }
}
