import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ArtistService } from "../artist/artist.service";
import { USER_NOT_FOUND_ERROR, USER_ALREADY_SUBSCRIBED_ERROR } from "./subscribe.error";
import { ArtistCreateDto } from "../artist/dto/request/artist.create.request.dto";

/**
 * 구독(멤버십) 관련 서비스
 * 사용자의 멤버십 생성 및 관리를 담당합니다.
 */
@Injectable()
export class SubscribeService {
	constructor(
		private readonly userService: UserService,
		private readonly artistService: ArtistService,
	) {}

	/**
	 * 멤버십을 구독합니다
	 *
	 * @description 사용자에게 멤버십을 부여하고, 필요한 경우 아티스트 프로필을 자동으로 생성합니다.
	 * 이미 멤버십이 있는 사용자의 경우 BadRequestException을 발생시킵니다.
	 *
	 * @param userId - 멤버십을 구독할 사용자 ID
	 * @returns 생성된 멤버십 정보 (사용자 ID, 구독 날짜, 아티스트 ID)
	 *
	 * @throws {NotFoundException} 사용자를 찾을 수 없는 경우
	 * @throws {BadRequestException} 이미 멤버십이 있는 경우
	 *
	 * @example
	 * ```typescript
	 * const membership = await subscribeService.subscribeMembership(123);
	 * console.log(membership.subscribedAt); // 구독 날짜
	 * ```
	 */
	async subscribeMembership(userId: number) {
		// 사용자 존재 확인
		const user = await this.userService.findById(userId);
		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND_ERROR);
		}

		// 이미 구독 중인지 확인
		if (user.subscribedAt) {
			throw new BadRequestException(USER_ALREADY_SUBSCRIBED_ERROR);
		}

		// 구독 날짜 업데이트
		const subscribedAt = new Date();
		await this.userService.updateSubscribedAt(userId, subscribedAt);

		// 아티스트 생성 (없는 경우에만 새로 생성)
		let artist = await this.artistService.findByUserId(userId);
		if (!artist) {
			const artistData: ArtistCreateDto = { stageName: "" };
			artist = await this.artistService.create(userId, artistData);
		}

		return {
			userId,
			subscribedAt,
			artistId: Number(artist.id),
		};
	}
}
