export interface IHelperHashService {
	randomSalt(length: number): string;
	bcrypt(passwordString: string, salt: string): string;
	bcryptCompare(passwordString: string, passwordHashed: string): boolean;
	sha256(string: string): string;
	sha256Compare(hashOne: string, hashTwo: string): boolean;
	hashPassword(password: string): string;
	comparePassword(password: string, hashedPassword: string): boolean;
}
