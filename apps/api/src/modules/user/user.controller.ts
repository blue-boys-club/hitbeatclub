import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocAuth } from "src/common/doc/decorators/doc.decorator";
import { AuthJwtAccessProtected } from "../auth/decorators/auth.jwt.decorator";
import { createApiResponseFromZodSchema, createSwaggerSchemaFromZod } from "src/common/swagger/swagger.util";
import { IResponse } from "src/common/response/interfaces/response.interface";
import { UserUpdatePayloadSchema, UserUpdateResponseSchema } from "@hitbeatclub/shared-types/user";
import { UserUpdatePayload, UserUpdateResponse } from "@hitbeatclub/shared-types/user";
import user from "./user.message";

@Controller("user")
@ApiTags("user")
@ApiBearerAuth()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async findAll() {
		return this.userService.findAll();
	}

	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Get(":id")
	async findOne(@Param("id") id: string) {
		return this.userService.findOne(id);
	}

	@Patch(":id")
	@ApiOperation({ summary: "사용자 정보 수정" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@ApiBody({
		description: "사용자 정보 수정 요청",
		schema: createSwaggerSchemaFromZod(UserUpdatePayloadSchema),
	})
	@ApiResponse({
		status: 200,
		description: user.update.success,
		schema: createApiResponseFromZodSchema(UserUpdateResponseSchema, user.update.success, 200),
	})
	async update(@Param("id") id: string, @Body() payload: UserUpdatePayload): Promise<IResponse<UserUpdateResponse>> {
		// const result = await this.userService.update(id, payload);

		return {
			statusCode: 200,
			message: user.update.success,
			data: { id: parseInt(id), message: user.update.success },
		};
	}

	@Delete(":id")
	async remove(@Param("id") id: string) {
		return this.userService.remove(id);
	}
}
