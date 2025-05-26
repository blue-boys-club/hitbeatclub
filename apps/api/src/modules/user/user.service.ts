import { UserCreatePayload, UserFindMeResponse, UserUpdatePayload } from "@hitbeatclub/shared-types/user";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { User, Prisma } from "@prisma/client";

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(): Promise<User[]> {
		return this.prisma.user.findMany();
	}

	async create(createUserDto: UserCreatePayload): Promise<User> {
		return this.prisma.user
			.create({
				data: createUserDto as Prisma.UserCreateInput,
			})
			.then((data) => this.prisma.serializeBigInt(data) as User);
	}

	async findMe(id: number): Promise<UserFindMeResponse> {
		return await this.prisma.user
			.findUnique({
				where: { id, deletedAt: null },
				select: {
					id: true,
					email: true,
					name: true,
					phoneNumber: true,
					gender: true,
					birthDate: true,
					profileUrl: true,
					country: true,
					region: true,
					agreedTermsAt: true,
					agreedPrivacyPolicyAt: true,
					agreedEmailAt: true,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async update(
		id: number,
		updateUserDto: UserUpdatePayload & {
			agreedTermsAt: Date | null;
			agreedPrivacyPolicyAt: Date | null;
			agreedEmailAt: Date | null;
		},
	): Promise<User> {
		try {
			return this.prisma.user
				.update({
					where: { id },
					data: {
						...updateUserDto,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data) as User);
		} catch (error) {
			// console.error(error);
			throw new BadRequestException(error);
		}
	}

	async softDelete(id: number): Promise<User> {
		return this.prisma.user
			.update({
				where: { id: id },
				data: {
					deletedAt: new Date(),
				},
			})
			.then((data) => this.prisma.serializeBigInt(data) as User);
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.prisma.user
			.findFirst({
				where: {
					email,
					deletedAt: null,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data) as User | null);
	}

	async updateToken(id: number, accessToken: string, refreshToken: string): Promise<User> {
		return this.prisma.user
			.update({
				where: { id: BigInt(id) },
				data: {
					accessToken: accessToken,
					refreshToken: refreshToken,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data) as User);
	}

	async updateLastLoginAt(id: number): Promise<User> {
		return this.prisma.user
			.update({
				where: { id: BigInt(id) },
				data: { lastLoginAt: new Date() },
			})
			.then((data) => this.prisma.serializeBigInt(data) as User);
	}
}
