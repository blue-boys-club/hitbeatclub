import { Controller, Get, Post, Param, Query, Req, Body } from "@nestjs/common";
import { SettlementService } from "./settlement.service";
import { ApiOperation, ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { AuthJwtAccessProtected } from "../auth/decorators/auth.jwt.decorator";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import settlementMessage from "./settlement.message";
import { DocAuth, DocResponse } from "src/common/doc/decorators/doc.decorator";
import { IResponse } from "src/common/response/interfaces/response.interface";
import { SettlementListResponseDto } from "./dto/response/settlement.list.response.dto";
import { SettlementProcessResponseDto } from "./dto/response/settlement.process.response.dto";
import { SettlementCreateDto } from "./dto/request/settlement.create.dto";

@Controller("settlements")
@ApiTags("settlement")
@ApiBearerAuth()
export class SettlementController {
	constructor(private readonly settlementService: SettlementService) {}

	/**
	 * 정산 정보 저장 API
	 */
	@Post()
	@ApiOperation({ summary: "정산 정보 저장" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<SettlementCreateDto>(settlementMessage.save.success, {
		dto: SettlementCreateDto,
	})
	async saveSettlement(
		@Req() req: AuthenticatedRequest,
		@Body() settlementCreateDto: SettlementCreateDto,
	): Promise<IResponse<any>> {
		const result = await this.settlementService.saveSettlement(req.user.id);

		return {
			statusCode: 200,
			message: settlementMessage.save.success,
			data: result,
		};
	}

	/**
	 * 내 정산 내역을 조회합니다
	 *
	 * @description 인증된 사용자의 아티스트 정산 내역을 조회합니다.
	 * JWT 토큰을 통해 사용자를 인증하며, 해당 사용자의 아티스트 프로필이 있어야 합니다.
	 *
	 * @param req - 인증된 사용자 정보가 포함된 요청 객체
	 * @returns 정산 내역 정보
	 */
	@Get("me")
	@ApiOperation({ summary: "내 정산 내역 조회" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<SettlementListResponseDto>(settlementMessage.mySettlements.success, {
		dto: SettlementListResponseDto,
	})
	async findMySettlements(@Req() req: AuthenticatedRequest): Promise<IResponse<any>> {
		const result = await this.settlementService.findMySettlements(req.user.id);

		return {
			statusCode: 200,
			message: settlementMessage.mySettlements.success,
			data: result,
		};
	}

	/**
	 * 특정 아티스트의 정산 내역을 조회합니다
	 *
	 * @description 아티스트 ID를 통해 특정 아티스트의 정산 내역을 기간별로 조회할 수 있습니다.
	 *
	 * @param artistId - 조회할 아티스트 ID
	 * @param startDate - 조회 시작 날짜 (YYYY-MM-DD 형식, 선택사항)
	 * @param endDate - 조회 종료 날짜 (YYYY-MM-DD 형식, 선택사항)
	 * @returns 아티스트의 정산 내역 정보
	 */
	@Get("artist/:artistId")
	@ApiOperation({ summary: "아티스트별 정산 내역 조회" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@ApiQuery({
		name: "startDate",
		type: String,
		required: false,
		description: "조회 시작 날짜 (YYYY-MM-DD)",
		example: "2024-01-01",
	})
	@ApiQuery({
		name: "endDate",
		type: String,
		required: false,
		description: "조회 종료 날짜 (YYYY-MM-DD)",
		example: "2024-12-31",
	})
	@DocResponse<SettlementListResponseDto>(settlementMessage.find.success, {
		dto: SettlementListResponseDto,
	})
	async findByArtist(
		@Param("artistId") artistId: number,
		@Query("startDate") startDate?: string,
		@Query("endDate") endDate?: string,
	): Promise<IResponse<any>> {
		const start = startDate ? new Date(startDate) : undefined;
		const end = endDate ? new Date(endDate) : undefined;

		const result = await this.settlementService.findByArtist(artistId, start, end);

		return {
			statusCode: 200,
			message: settlementMessage.find.success,
			data: result,
		};
	}

	/**
	 * 정산을 처리합니다
	 *
	 * @description 미처리 상태의 정산을 완료 처리합니다.
	 * 관리자 권한이 필요한 기능입니다.
	 *
	 * @param settlementId - 처리할 정산 ID
	 * @returns 처리된 정산 정보
	 */
	@Post(":settlementId/process")
	@ApiOperation({ summary: "정산 처리" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<SettlementProcessResponseDto>(settlementMessage.process.success, {
		dto: SettlementProcessResponseDto,
	})
	async processSettlement(@Param("settlementId") settlementId: number): Promise<IResponse<any>> {
		const result = await this.settlementService.processSettlement(settlementId);

		return {
			statusCode: 200,
			message: settlementMessage.process.success,
			data: result,
		};
	}
}
