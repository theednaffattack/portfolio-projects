import bcrypt from "bcryptjs";

export class CryptoService {
  public static readonly SALT_ROUNDS: number = 12;

  public async hash(data: string): Promise<string> {
    return bcrypt.hash(data, CryptoService.SALT_ROUNDS);
  }

  public compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
