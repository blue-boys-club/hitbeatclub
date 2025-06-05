"use client";

import Image from "next/image";
import { ArtistAvatar } from "@/components/ui";
import NavLink, { NavLinkProps } from "./NavLink";
import ArtistStatRow from "./ArtistStatRow";
import { Dollars } from "@/assets/svgs/Dollars";
import { ArtistInfo } from "@/assets/svgs/ArtistInfo";
import { UserProfile } from "@/assets/svgs/UserProfile";
import { ArtistStudioTitle } from "./ArtistStudioTitle";
import { Popup, PopupContent, PopupHeader, PopupTitle, PopupFooter, PopupDescription } from "@/components/ui/Popup";
import { Button } from "@/components/ui/Button";
import { useMemo, useState } from "react";
import { Upload } from "@/assets/svgs";
import { usePathname, useRouter } from "next/navigation";
import { getArtistMeQueryOption } from "@/apis/artist/query/artist.query-options";
import { useQuery } from "@tanstack/react-query";
import UserProfileImage from "@/assets/images/user-profile.png";
import { cn } from "@/common/utils/tailwind";
import ArtistStudioDashUploadTrackModal from "@/features/artist/components/modal/ArtistStudioDashUploadTrackModal";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types/file";
import { PRODUCT_FILE_TYPE } from "@/apis/product/product.type";

const artistStats = [
	{ label: "Follower", value: "4,567" },
	{ label: "Tracks", value: "52" },
	{ label: "Visitors", value: "976" },
];

export const ArtistSidebar = () => {
	const [isProfileWarningOpen, setIsProfileWarningOpen] = useState(false);
	const [isLockedNavWarningOpen, setIsLockedNavWarningOpen] = useState(false);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [isUploadCompleteModalOpen, setIsUploadCompleteModalOpen] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);
	const [droppedFiles, setDroppedFiles] = useState<FileList | null>(null);

	const { data: artistMe, isSuccess: isArtistMeSuccess } = useQuery(getArtistMeQueryOption());
	const pathname = usePathname();
	const navItems = useMemo(() => {
		if (!isArtistMeSuccess) return [];

		const isStudioLocked = [artistMe.stageName, artistMe.slug, artistMe.description].some((value) => value === null);
		const isPayoutLocked = artistMe.settlement === null;

		const navItems: Array<NavLinkProps & { alternativeActives?: string[] }> = [
			{ href: `/artist-studio/${artistMe.id}`, label: "My Studio", Icon: UserProfile, isLocked: isStudioLocked },
			{
				href: `/artist-studio/${artistMe.id}/setting?tab=profile`,
				label: "Artist Info",
				Icon: ArtistInfo,
				isLocked: false,
			},
			{
				href: `/artist-studio/${artistMe.id}/settlements`,
				alternativeActives: [`/artist-studio/${artistMe.id}/transactions`, `/artist-studio/${artistMe.id}/referrals`],
				label: "Payouts",
				Icon: Dollars,
				isLocked: isPayoutLocked,
			},
		];

		// 디버깅용 - pathname 확인
		console.log("현재 pathname:", pathname);
		console.log(
			"navItems href들:",
			navItems.map((item) => item.href),
		);

		// 가장 잘 매칭되는 하나의 nav item만 active로 설정
		const matchedItems = navItems.filter((item) => {
			// query string 제거하고 비교
			const cleanPathname = pathname?.split("?")[0] || "";
			const cleanHref = item.href?.split("?")[0] || "";

			// 기본 href 매칭
			const isBasicMatch = cleanPathname.includes(cleanHref);

			// alternativeActives 매칭
			const isAlternativeMatch =
				item.alternativeActives?.some((altPath) => {
					const cleanAltPath = altPath?.split("?")[0] || "";
					return cleanPathname.includes(cleanAltPath);
				}) || false;

			const matched = isBasicMatch || isAlternativeMatch;
			console.log(
				`매칭 확인 [${item.label}]: pathname=${cleanPathname}, href=${cleanHref}, basic=${isBasicMatch}, alternative=${isAlternativeMatch}, final=${matched}`,
			);

			return matched;
		});

		console.log(
			"매칭된 items:",
			matchedItems.map((item) => item.label),
		);

		if (matchedItems.length > 0) {
			// 우선순위: alternativeActives 매칭 > 긴 href 매칭
			const bestMatch = matchedItems.reduce((prev, current) => {
				const cleanPathname = pathname?.split("?")[0] || "";

				// current가 alternativeActives로 매칭되는지 확인
				const currentHasAltMatch =
					current.alternativeActives?.some((altPath) => {
						const cleanAltPath = altPath?.split("?")[0] || "";
						return cleanPathname.includes(cleanAltPath);
					}) || false;

				// prev가 alternativeActives로 매칭되는지 확인
				const prevHasAltMatch =
					prev.alternativeActives?.some((altPath) => {
						const cleanAltPath = altPath?.split("?")[0] || "";
						return cleanPathname.includes(cleanAltPath);
					}) || false;

				// alternativeActives 매칭이 우선
				if (currentHasAltMatch && !prevHasAltMatch) return current;
				if (prevHasAltMatch && !currentHasAltMatch) return prev;

				// 둘 다 alternativeActives 매칭이거나 둘 다 기본 매칭인 경우, 더 긴 href 선택
				const prevHrefLength = prev.href?.split("?")[0]?.length || 0;
				const currentHrefLength = current.href?.split("?")[0]?.length || 0;
				return prevHrefLength > currentHrefLength ? prev : current;
			});
			console.log("선택된 bestMatch:", bestMatch.label);
			bestMatch.isActive = true;
		}

		return navItems;
	}, [isArtistMeSuccess, artistMe, pathname]);

	const router = useRouter();

	// 파일 타입 확인 함수 - 올바른 ENUM_FILE_TYPE 반환
	const getFileTypeFromExtension = (file: File): PRODUCT_FILE_TYPE | null => {
		const extension = file.name.toLowerCase().split(".").pop();

		if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
			return ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE;
		}
		if (["mp3", "wav", "flac", "m4a"].includes(extension || "")) {
			return ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE;
		}
		if (["zip", "rar", "7z"].includes(extension || "")) {
			return ENUM_FILE_TYPE.PRODUCT_ZIP_FILE;
		}
		return null;
	};

	// 드래그 앤 드롭 이벤트 핸들러
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		if (!artistMe?.stageName || artistMe?.stageName === "") return;
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);

		if (!artistMe?.stageName || artistMe?.stageName === "") {
			setIsProfileWarningOpen(true);
			return;
		}

		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			// 지원되는 파일이 있는지 확인
			let hasValidFile = false;
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				if (file && getFileTypeFromExtension(file)) {
					hasValidFile = true;
					break;
				}
			}

			if (hasValidFile) {
				// 드롭된 파일들을 저장하고 모달 열기
				setDroppedFiles(files);
				setIsUploadModalOpen(true);
			} else {
				alert(
					"지원하지 않는 파일 형식입니다. (이미지: jpg, jpeg, png, gif, webp / 오디오: mp3, wav, flac, m4a / 압축: zip, rar, 7z)",
				);
			}
		}
	};

	const onUpload = () => {
		if (!artistMe?.stageName || artistMe?.stageName === "") {
			setIsProfileWarningOpen(true);
			return;
		}

		// 클릭으로 모달을 열 때는 파일 없이 열기
		setDroppedFiles(null);
		setIsUploadModalOpen(true);
	};

	const onMoveToProfileSetting = () => {
		setIsProfileWarningOpen(false);
		router.push("/artist-studio/1/setting?tab=profile");
	};

	const onLockedNavClick = () => {
		setIsLockedNavWarningOpen(true);
	};

	const onCloseUploadModal = () => {
		setIsUploadModalOpen(false);
		// 모달이 닫힐 때 드롭된 파일들도 초기화
		setDroppedFiles(null);
	};

	const onOpenUploadCompleteModal = () => {
		setIsUploadCompleteModalOpen(true);
	};

	const profileUrl = useMemo(() => {
		if (!artistMe?.profileImageUrl || artistMe?.profileImageUrl === "") {
			return UserProfileImage;
		}
		return artistMe.profileImageUrl;
	}, [artistMe]);

	return (
		<>
			<div className="flex flex-col flex-1 h-full gap-8px">
				<div className="flex-none px-13px pt-19px">
					<Image
						src="/assets/logo.png"
						alt="로고"
						width={120}
						height={67}
					/>
				</div>

				<aside className="w-[300px] border-r-2 bg-hbc-white border-hbc-red pb-16px">
					<div className="flex items-center justify-start px-4px pr-5px pl-9px ">
						{/* 이거 왜 피그마에 SVG로 있나요... */}
						<ArtistStudioTitle />
					</div>

					<hr className="border-hbc-red border-3 my-10px mr-9px ml-4px" />

					<section className="flex flex-col items-center justify-center gap-20px">
						<ArtistAvatar
							src={profileUrl}
							alt="아티스트 프로필 이미지"
							className={cn("bg-black my-8px", profileUrl === UserProfileImage && "bg-white")}
							size="small"
						/>

						<h2 className="font-bold text-center text-black font-suisse text-38px leading-40px tracking-038px h-40px">
							홍길동
						</h2>

						<ArtistStatRow artistStats={artistStats} />
					</section>

					<section className="flex flex-col mt-48px pl-20px pr-11px gap-15px ">
						<div
							className={cn(
								"flex flex-col items-center justify-center gap-5 px-8px py-40px border border-dotted border-[#FF1900] cursor-pointer transition-all duration-200",
								isDragOver && "bg-[#FF1900] bg-opacity-10 border-2 border-[#FF1900]",
							)}
							role="button"
							tabIndex={0}
							onClick={onUpload}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<Upload className="transition-opacity hover:opacity-80" />
							<span className="text-[#FF1900] text-[13px] font-extrabold">
								{isDragOver ? "파일을 여기에 드롭하세요!" : "Drop Your Fire🔥"}
							</span>
						</div>

						<nav className="flex flex-col w-full gap-10px pt-11px pb-6px border-y-6px border-hbc-red">
							{navItems.map(({ href, label, Icon, isLocked, isActive }) => (
								<NavLink
									key={label}
									href={href}
									label={label}
									Icon={Icon}
									isLocked={isLocked}
									isActive={isActive}
									onClick={isLocked ? onLockedNavClick : undefined}
								/>
							))}
						</nav>
					</section>
				</aside>
			</div>

			{/* 업로드 모달 */}
			<ArtistStudioDashUploadTrackModal
				isModalOpen={isUploadModalOpen}
				onClose={onCloseUploadModal}
				openCompleteModal={onOpenUploadCompleteModal}
				initialFiles={droppedFiles}
			/>

			{/* 업로드 완료 모달 */}
			<Popup
				open={isUploadCompleteModalOpen}
				onOpenChange={setIsUploadCompleteModalOpen}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle className="font-bold">업로드가 완료되었습니다!</PopupTitle>
					</PopupHeader>

					<PopupDescription className="text-center font-bold">트랙이 성공적으로 업로드되었습니다.</PopupDescription>

					<PopupFooter>
						<Button
							rounded="full"
							onClick={() => setIsUploadCompleteModalOpen(false)}
						>
							확인
						</Button>
					</PopupFooter>
				</PopupContent>
			</Popup>

			<Popup
				open={isProfileWarningOpen}
				onOpenChange={setIsProfileWarningOpen}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle className="font-bold">프로필 설정 완료 후 사용 가능합니다!</PopupTitle>
					</PopupHeader>

					<PopupDescription className="text-center font-bold">
						아래 경로를 통해서 프로필 설정을 완료해 주세요! <br />[ Artist Info ] 👉🏼 [ 프로필 설정 ]
					</PopupDescription>

					<PopupFooter>
						<Button
							rounded="full"
							onClick={onMoveToProfileSetting}
						>
							프로필 설정으로 이동
						</Button>
					</PopupFooter>
				</PopupContent>
			</Popup>

			<Popup
				open={isLockedNavWarningOpen}
				onOpenChange={setIsLockedNavWarningOpen}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle className="font-bold">판매자 정보 입력은 필수입니다!</PopupTitle>
					</PopupHeader>

					<PopupDescription className="text-center">
						<span className="font-bold">[프로필 설정]</span>과 <span className="font-bold">[정산정보 설정]</span>을
						완료해 <br />
						판매를 시작해 보세요!
					</PopupDescription>
				</PopupContent>
			</Popup>
		</>
	);
};
