"use client";

import { memo, useState } from "react";
import {
	FilledInstagram,
	LargeAuthBadge,
	More,
	RedPlayCircle,
	ShuffleOff,
	ShuffleOn,
	SoundCloud,
	Youtube,
} from "@/assets/svgs";
import { ArtistAvatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { ArtistDropdown } from "./ArtistDropdown";
import { ArtistReportModal } from "./ArtistReportModal";
import { useToast } from "@/hooks/use-toast";

interface ArtistInfoProps {
	onPlay?: () => void;
}

interface DropdownOption {
	label: string;
	value: string;
	onClick: () => void;
}

/**
 * 아티스트 페이지의 헤더 컴포넌트
 * - 아티스트 프로필 이미지, 이름, 인증 배지 표시
 * - 재생, 셔플, 더보기 기능
 * - 팔로우/팔로워 정보
 * - SNS 링크
 * - 트랙 수, 방문자 수 표시
 * - 아티스트 소개
 */
export const ArtistInfo = memo(({ onPlay }: ArtistInfoProps) => {
	const [isShuffleOn, setIsShuffleOn] = useState(false);
	const [isOpenDropdown, setIsOpenDropdown] = useState(false);
	const [isOpenReportModal, setIsOpenReportModal] = useState(false);
	const { toast } = useToast();

	const onShuffle = () => {
		setIsShuffleOn((prev) => !prev);
	};

	const onOpenDropdown = () => {
		setIsOpenDropdown((prev) => !prev);
	};

	const onOpenReportModal = () => {
		setIsOpenDropdown(false);
		setIsOpenReportModal((prev) => !prev);
	};

	const onCloseReportModal = () => {
		setIsOpenReportModal(false);
		toast({
			description: "신고 접수가 완료되었습니다.",
		});
	};

	const options: DropdownOption[] = [
		{
			label: "팔로잉 취소",
			value: "unfollow",
			onClick: () => {
				setIsOpenDropdown(false);
				toast({
					description: "팔로잉이 취소되었습니다.",
				});
			},
		},
		{
			label: "차단하기",
			value: "block",
			onClick: () => {
				setIsOpenDropdown(false);
				toast({
					description: "아티스트가 차단되었습니다.",
				});
			},
		},
		{
			label: "신고하기",
			value: "report",
			onClick: onOpenReportModal,
		},
	];

	return (
		<div className="flex items-center gap-9 font-suisse px-8.5 py-10 border-b-2">
			<ArtistAvatar
				src="https://placehold.co/192x192.png"
				alt="artist avatar"
				className="w-[192px] h-[192px] outline-4 bg-white"
			/>

			<div className="w-[343px] flex flex-col gap-2">
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<div className="text-[40px] font-bold leading-[40px] tracking-0.4px">Beenzino</div>
						<LargeAuthBadge />
					</div>

					<div className="flex items-center gap-3">
						<div
							className="cursor-pointer"
							onClick={onPlay}
						>
							<RedPlayCircle />
						</div>
						<div
							className="cursor-pointer"
							onClick={onShuffle}
						>
							{isShuffleOn ? <ShuffleOn /> : <ShuffleOff />}
						</div>
						<div
							className="cursor-pointer"
							onClick={onOpenDropdown}
						>
							<More />
						</div>

						{isOpenDropdown && <ArtistDropdown options={options} />}

						<ArtistReportModal
							isOpen={isOpenReportModal}
							onCloseModal={onCloseReportModal}
						/>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						rounded="full"
					>
						Follow
					</Button>

					<div className="text-[12px] font-semibold leading-[18px] tracking-0.12px">398 Followers</div>
				</div>

				<div className="flex items-center gap-2">
					<div className="cursor-pointer">
						<FilledInstagram />
					</div>
					<div className="cursor-pointer">
						<Youtube />
					</div>
					<div className="cursor-pointer">
						<SoundCloud />
					</div>
				</div>

				<div className="text-[12px] text-[#777] font-medium leading-[16.8px]">
					<div>28 Tracks</div>
					<div>171 Visits</div>
				</div>

				<div className="text-[12px] text-[#1F1F21] font-semibold leading-[18px] tracking-0.12px">
					어디에서 많은 고이 하늘에는 쪽으로 너, 척 비는 척 너도 행복했던 박명의 속의 꽃밭에 사뿐히 따라 있다 가네 내가
					언제나 리가 날에, 프랑시스 오신다면 새겨지는 이름자 지나고 모두가 박명의 진달래꽃 흘리우리다. 슬프게 불러 나의
					그 때 듯합니다.
				</div>
			</div>
		</div>
	);
});

ArtistInfo.displayName = "ArtistInfo";
