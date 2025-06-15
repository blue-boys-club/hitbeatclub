"use client";

import { Return } from "@/assets/svgs";
import { MobileNoticePageTitle } from "@/features/mobile/notice/components";
import React from "react";
import LogoBlack from "@/assets/images/logo-black.png";
import Image from "next/image";

interface MobileNoticeDetailPageProps {
	noticeId: string;
}

const MobileNoticeDetailPage = ({ noticeId }: MobileNoticeDetailPageProps) => {
	// TODO: noticeId를 사용하여 공지사항 상세 정보 조회

	return (
		<div className="flex flex-col px-4 pb-4">
			<MobileNoticePageTitle title="히트비트클럽 웹사이트 리뉴얼" />
			<div className="mt-13px flex justify-end">
				<button className="flex items-center rounded-30px h-24px px-3 border-2px border-black">
					<div className="flex gap-5px items-center">
						<span className="text-14px leading-100% font-semibold">BACK</span>
						<Return />
					</div>
				</button>
			</div>
			<Image
				className="my-17px"
				src={LogoBlack}
				alt="logo"
				width={361}
			/>
			<div className="text-14px leading-160% font-semibold">
				안녕하세요, 히트비트클럽 회원 여러분!
				<br />
				<br />
				오랜 기간 준비해온 히트비트클럽 웹사이트 리뉴얼 작업이 드디어 완료되어 여러분께 새로운 모습으로 찾아뵙게
				되었습니다. 이번 리뉴얼을 통해 더욱 편리하고 직관적인 사용자 경험을 제공하고자 노력했습니다.
				<br />
				<br />
				주요 변경사항
				<br />
				<br />
				1. 전면적인 UI/UX 개선
				<br />
				- 모바일 최적화된 반응형 디자인 적용
				<br />
				- 직관적인 네비게이션 구조로 개편
				<br />
				- 세련되고 현대적인 디자인 언어 도입
				<br />
				- 접근성 향상을 위한 다양한 기능 추가
				<br />
				<br />
				2. 음악 재생 기능 강화
				<br />
				- 고품질 오디오 스트리밍 지원
				<br />
				- 개선된 플레이어 인터페이스
				<br />
				- 플레이리스트 관리 기능 향상
				<br />
				- 크로스 플랫폼 동기화 기능 추가
				<br />
				<br />
				3. 커뮤니티 기능 확장
				<br />
				- 아티스트와 팬 간의 소통 채널 강화
				<br />
				- 실시간 댓글 및 반응 기능
				<br />
				- 개인화된 추천 시스템 도입
				<br />
				- 소셜 미디어 연동 기능 추가
				<br />
				<br />
				4. 성능 최적화
				<br />
				- 페이지 로딩 속도 대폭 개선
				<br />
				- 서버 인프라 업그레이드
				<br />
				- 캐싱 시스템 도입으로 안정성 향상
				<br />
				- 모바일 데이터 사용량 최적화
				<br />
				<br />
				새로운 기능 소개
				<br />
				<br />
				이번 리뉴얼과 함께 여러분이 오랫동안 요청해주신 다양한 기능들이 새롭게 추가되었습니다. 개인화된 음악 추천
				알고리즘을 통해 취향에 맞는 새로운 음악을 발견할 수 있으며, 향상된 검색 기능으로 원하는 콘텐츠를 더욱 쉽게 찾을
				수 있습니다.
				<br />
				<br />
				또한 아티스트 팔로우 시스템이 새롭게 도입되어 좋아하는 아티스트의 최신 소식과 음악을 실시간으로 받아볼 수
				있습니다. 커뮤니티 기능도 대폭 강화되어 다른 음악 애호가들과 취향을 공유하고 소통할 수 있는 공간이
				마련되었습니다.
				<br />
				<br />
				이용 안내
				<br />
				<br />
				리뉴얼된 웹사이트는 기존 계정 정보를 그대로 유지하므로 별도의 재가입 절차 없이 바로 이용하실 수 있습니다. 다만
				일부 브라우저에서는 캐시 삭제 후 이용하시기를 권장드립니다.
				<br />
				<br />
				모바일 앱도 곧 업데이트될 예정이니 조금만 기다려주시기 바랍니다. 앱 스토어를 통해 자동 업데이트 설정을 해두시면
				새 버전이 출시되는 즉시 알림을 받으실 수 있습니다.
				<br />
				<br />
				문의 및 피드백
				<br />
				<br />
				새로운 웹사이트 이용 중 불편사항이나 개선 제안이 있으시면 언제든지 고객센터로 연락해주세요. 여러분의 소중한
				의견은 히트비트클럽이 더 나은 서비스로 발전하는 데 큰 도움이 됩니다.
				<br />
				<br />
				앞으로도 음악을 사랑하는 모든 분들에게 최고의 경험을 제공할 수 있도록 지속적으로 노력하겠습니다. 새로워진
				히트비트클럽과 함께 더욱 풍성한 음악 여행을 즐겨보세요!
				<br />
				<br />
				2024년 1월 15일
				<br />
				히트비트클럽 운영팀 드림
			</div>
		</div>
	);
};

export default MobileNoticeDetailPage;
