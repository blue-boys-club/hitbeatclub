import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		return this.prisma.user.findMany();
	}

	async create(createUserDto: CreateUserDto) {
		// return this.prisma.user.create({
		//     data: {
		//         ...createUserDto,
		//     },
		// });
	}

	async findOne(id: string) {
		return this.prisma.user.findUnique({
			where: { id: BigInt(id) },
		});
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		return this.prisma.user.update({
			where: { id: BigInt(id) },
			data: updateUserDto,
		});
	}

	async remove(id: string) {
		return this.prisma.user.delete({
			where: { id: BigInt(id) },
		});
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

	async updateToken(id: number, accessToken: string, refreshToken: string) {
		return this.prisma.user
			.update({
				where: { id: BigInt(id) },
				data: {
					accessToken: accessToken,
					refreshToken: refreshToken,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async updateLastLoginAt(id: number) {
		return this.prisma.user
			.update({
				where: { id: BigInt(id) },
				data: { lastLoginAt: new Date() },
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}
}
