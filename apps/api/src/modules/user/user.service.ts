import { UserCreatePayload, UserFindMeResponse, UserUpdatePayload } from "@hitbeatclub/shared-types/user";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { User, Prisma } from "@prisma/client";
import { UserFindMeResponseDto } from "./dto/response/user.find-me.response.dto";
import { HelperHashService } from "~/common/helper/services/helper.hash.service";

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperHashService: HelperHashService,
	) {}

	async findAll(): Promise<User[]> {
		return this.prisma.user.findMany();
	}

	async socialJoin(createUserDto: UserCreatePayload): Promise<User> {
		return this.prisma.user
			.create({
				data: {
					...createUserDto,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async create(
		createUserDto: UserUpdatePayload & {
			agreedTermsAt: Date | null;
			agreedPrivacyPolicyAt: Date | null;
			agreedEmailAt: Date | null;
		},
	) {
		// 비밀번호가 있는 경우에만 암호화
		let hashedPassword: string | undefined;
		if (createUserDto.password) {
			hashedPassword = this.helperHashService.hashPassword(createUserDto.password);
		}

		return this.prisma.user
			.create({
				data: {
					...createUserDto,
					password: hashedPassword, // 해시된 비밀번호로 저장
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async findMe(id: number): Promise<UserFindMeResponseDto> {
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
					subscribedAt: true,
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

	async findById(id: number): Promise<User | null> {
		return this.prisma.user
			.findFirst({
				where: {
					id: BigInt(id),
					deletedAt: null,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data) as User | null);
	}

	async updatePassword(id: number, hashedPassword: string): Promise<User> {
		return this.prisma.user
			.update({
				where: { id: BigInt(id) },
				data: { password: hashedPassword },
			})
			.then((data) => this.prisma.serializeBigInt(data) as User);
	}

	async findByEmail(email: string) {
		return this.prisma.user
			.findFirst({
				where: {
					email,
					deletedAt: null,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
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

	async findByNameAndPhoneNumber(name: string, phoneNumber: string) {
		return this.prisma.user
			.findFirst({
				where: { name, phoneNumber, deletedAt: null },
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	// TODO: FIXME: Temporary function
	async updateSubscribedAt(id: number, subscribedAt: Date | null): Promise<User> {
		return this.prisma.user.update({
			where: { id: BigInt(id) },
			data: { subscribedAt },
		});
	}
}
