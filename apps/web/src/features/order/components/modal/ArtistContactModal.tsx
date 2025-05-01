import { cn } from "@/common/utils";
import * as Popup from "@/components/ui/Popup";

// Import required SVG icons
import { Phone } from "@/assets/svgs/Phone";
import { Contact } from "@/assets/svgs/Contact";
import { KaKaoTalk } from "@/assets/svgs/KaKaoTalk";
import { Discord } from "@/assets/svgs/Discord";
import { LineInstagram } from "@/assets/svgs/LineInstagram";
import { Youtube } from "@/assets/svgs/Youtube";
import { SoundCloud } from "@/assets/svgs/SoundCloud";
import { OpenInNew } from "@/assets/svgs/OpenInNew";
import { Line } from "@/assets/svgs/Line";
import { ContactLink, ContactLinkType } from "../../types";
import { toast } from "@/hooks/use-toast";

interface ArtistContactModalProps {
	isOpen: boolean;
	onClose: () => void;

	links: ContactLink[]; // Single array for all links
}

const DIRECT_CONTACT_TYPES: ContactLinkType[] = ["phone", "email", "kakaotalk", "discord", "line"];

/**
 * 아티스트 연락처 정보를 표시하는 모달 컴포넌트입니다.
 */
export const ArtistContactModal = ({
	isOpen,
	onClose,
	links = [], // Default to empty array
}: ArtistContactModalProps) => {
	const getIconForType = (type: ContactLinkType) => {
		// Apply styling to a wrapper span instead of the SVG directly
		const wrapperClassName = "flex items-center justify-center size-5 text-hbc-black";
		switch (type) {
			case "phone":
				return (
					<span className={wrapperClassName}>
						<Phone />
					</span>
				);
			case "email":
				return (
					<span className={wrapperClassName}>
						<Contact />
					</span>
				);
			case "kakaotalk":
				return (
					<span className={wrapperClassName}>
						<KaKaoTalk />
					</span>
				);
			case "discord":
				return (
					<span className={wrapperClassName}>
						<Discord />
					</span>
				);
			case "line":
				return (
					<span className={wrapperClassName}>
						<Line />
					</span>
				);
			case "instagram":
				return (
					<span className={wrapperClassName}>
						<LineInstagram />
					</span>
				);
			case "youtube":
				return (
					<span className={wrapperClassName}>
						<Youtube />
					</span>
				);
			case "soundcloud":
				return (
					<span className={wrapperClassName}>
						<SoundCloud />
					</span>
				);
			case "facebook":
			case "website":
			case "other":
			default:
				return (
					<span className={wrapperClassName}>
						<OpenInNew />
					</span>
				);
		}
	};

	// Separate links for rendering sections
	const directContacts = links.filter((link) => DIRECT_CONTACT_TYPES.includes(link.type));
	const otherLinks = links.filter((link) => !DIRECT_CONTACT_TYPES.includes(link.type));

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			toast({
				description: "연락처가 복사 되었습니다.",
			});
		});
	};

	return (
		<Popup.Popup
			open={isOpen}
			onOpenChange={(open) => !open && onClose()}
		>
			<Popup.PopupContent className={cn("w-full max-w-[585px]")}>
				<Popup.PopupHeader>
					<Popup.PopupTitle className="font-suisse">Contact</Popup.PopupTitle>
				</Popup.PopupHeader>

				{/* Main content area with border */}
				<div className="flex flex-col items-center self-stretch justify-center p-3 overflow-hidden gap-25px">
					{/* Description Section */}
					<div className="self-stretch text-hbc-gray-400 font-suit">
						<p className="text-15px leading-150% tracking-015px">🗣️ 판매자에게 직접 문의하기</p>
						<p className="text-12px leading-150% tracking-012px">
							해당 콘텐츠에 대한 궁금한 점이나 문제는, 아래 연락처를 통해 판매자에게 직접 문의해주세요.
							<br />
							비트/아카펠라 수정 요청, 사용 범위, 음원 파일의 문제 등은 판매자와 협의하시면 됩니다.
						</p>
					</div>

					{/* 연락처 섹션 */}

					{directContacts.length > 0 && (
						<div className="flex flex-col items-start gap-2.5">
							<p className="text-base font-bold leading-150% tracking-tight text-hbc-gray-300 font-suit">
								📞 판매자 연락처
							</p>
							{directContacts.map(({ type, value }) => (
								<div
									key={type}
									className="flex items-center gap-3 w-325px"
								>
									<div className="flex items-center justify-center flex-shrink-0 size-6">{getIconForType(type)}</div>
									<div
										className="flex-1 min-w-0 pb-1 border-b cursor-pointer border-hbc-black"
										onClick={() => {
											copyToClipboard(value);
										}}
									>
										<p className="text-base font-medium leading-tight tracking-tight truncate text-zinc-500 font-suisse">
											{value} {/* Display value (phone, email, ID) */}
										</p>
									</div>
								</div>
							))}
						</div>
					)}

					{/* SNS/다른 링크 섹션 */}
					{otherLinks.length > 0 && (
						<div className="flex flex-col items-start gap-2.5">
							<p className="text-base font-bold leading-150% tracking-tight text-hbc-gray-300 font-suit">
								🔗 SNS & Links
							</p>
							{otherLinks.map((link, index) => (
								<div
									key={`${link.type}-${index}`}
									className="flex items-center gap-3 w-325px"
								>
									<div className="flex items-center justify-center flex-shrink-0 size-6">
										{getIconForType(link.type)}
									</div>
									<div
										className="flex-1 min-w-0 pb-1 border-b cursor-pointer border-hbc-black"
										onClick={() => {
											copyToClipboard(link.value);
										}}
									>
										<span className="block text-base font-medium leading-tight tracking-tight truncate text-zinc-500 font-suisse hover:underline">
											{link.value} {/* Display the value/URL */}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Footer with Button */}
				<Popup.PopupFooter>
					<Popup.PopupButton>확인</Popup.PopupButton>
				</Popup.PopupFooter>
			</Popup.PopupContent>
		</Popup.Popup>
	);
};
