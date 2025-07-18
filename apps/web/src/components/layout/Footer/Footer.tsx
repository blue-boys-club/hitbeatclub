"use client";

import UI from "@/components/ui";
import Link from "next/link";
import { useDevice } from "@/hooks/use-device";
import { HBCWhite, OutWardArrow } from "@/assets/svgs";
import { useDevicePreferenceStore } from "@/stores/device";
import { toMobilePath, toPcPath } from "@/lib/route-mapper";
import { useRouter, usePathname } from "next/navigation";

export const Footer = () => {
	const { isPC } = useDevice();
	const router = useRouter();
	const pathname = usePathname();
	const { preferredLayout, setPreferredLayout } = useDevicePreferenceStore();

	// 실제로 PC 스타일을 보여줄지 여부 (선호 레이아웃을 우선으로 판단)
	const showPcVariant = preferredLayout === "pc" || (preferredLayout === "auto" && isPC);

	/**
	 * 레이아웃 전환 핸들러 (PC -> Mobile 또는 Mobile -> PC)
	 */
	const handleSwitchLayout = () => {
		if (showPcVariant) {
			setPreferredLayout("mobile");
			router.replace(toMobilePath(pathname));
		} else {
			setPreferredLayout("pc");
			router.replace(toPcPath(pathname));
		}
	};

	return showPcVariant ? (
		<div className="flex flex-col gap-15px my-15px">
			<UI.BodySmall className="whitespace-pre-line text-hbc-gray-400">
				회사명 : 블루보이즈클럽
				<br />
				주소 : 서울특별시 마포구 성산로2길 21-30, 401호(성산동, 예지빌딩)
				<br />
				대표 : 현태웅
				<br />
				사업자등록번호 : 274-21-02190
				<br />
				통신판매업신고번호 : 2024-서울마포-2047
				<br />
				사업자정보확인 버튼
				<br />
				고객센터 : 010-8680-2015 (평일 09:00-18:00, 유료)
				<br />
				이메일 : info@hitbeatclub.com
				<br />
				호스팅서비스사업자 : Amazon Web Services (AWS)
				<br />
				개인정보보호책임자 : 현태웅
				<br />
				블루보이즈클럽 © blueboysclub Corp. <br />
				<br />
				"히트비트클럽은 통신판매중개자이며 통신판매의 당사자가 아닙니다. 따라서 히트비트클럽은 상품·거래 정보 및 가격에
				대하여 책임을 지지 않습니다."
			</UI.BodySmall>
			<div className="flex flex-row gap-2 items-center">
				<Link
					href="/terms-of-service"
					className="text-hbc-gray-400 text-[16px] font-medium font-suit leading-none tracking-016px cursor-pointer"
				>
					서비스이용약관
				</Link>
				<Link
					href="/privacy-policy"
					className="text-hbc-gray-400 text-[16px] font-medium font-suit leading-none tracking-016px cursor-pointer"
				>
					개인정보처리방침
				</Link>
				<Link
					href="/refund-policy"
					className="text-hbc-gray-400 text-[16px] font-medium font-suit leading-none tracking-016px cursor-pointer"
				>
					환불정책
				</Link>
				<Link
					href="/notices"
					className="text-hbc-gray-400 text-[16px] font-medium font-suit leading-none tracking-016px cursor-pointer"
				>
					공지사항
				</Link>
				<Link
					href="/support"
					className="text-hbc-gray-400 text-[16px] font-medium font-suit leading-none tracking-016px cursor-pointer"
				>
					고객센터
				</Link>
				<button
					type="button"
					onClick={handleSwitchLayout}
					className="text-hbc-gray-400 text-[16px] font-medium font-suit leading-none tracking-016px cursor-pointer"
				>
					모바일 버전 보기
				</button>
			</div>
		</div>
	) : (
		<div className="relative bg-black text-white text-10px leading-[140%] py-10px px-16px flex flex-col gap-10px">
			<div>
				A. 서울특별시 마포구 성산로2길 21-30, 401호(성산동, 예지빌딩)
				<br />
				E. info@hitbeatclub.com
				<br />
				P. 010-8680-2015 (평일 09:00-18:00, 유료)
				<br />
				호스팅서비스사업자 : 블루보이즈클럽 © blueboysclub Corp.
			</div>
			<div>
				블루보이즈클럽
				<br />
				대표이사 : 현태웅
				<br />
				사업자등록번호 : 274-21-02190
				<br />
				통신판매업신고번호 : 2024-서울마포-2047
			</div>
			<div className="flex gap-x-4 items-center">
				<div className="flex flex-col">
					<Link
						href="/terms-of-service"
						className="flex items-center gap-3px"
					>
						이용약관
						<OutWardArrow />
					</Link>
					<Link
						href="/privacy-policy"
						className="flex items-center gap-3px"
					>
						개인정보처리방침
						<OutWardArrow />
					</Link>
				</div>
				<div className="flex flex-col">
					<Link
						href="/mobile/notice"
						className="flex items-center gap-3px"
					>
						공지사항
						<OutWardArrow />
					</Link>
					<Link
						href="/support"
						className="flex items-center gap-3px"
					>
						고객센터
						<OutWardArrow />
					</Link>
				</div>
				<button
					type="button"
					onClick={handleSwitchLayout}
					className="flex items-center gap-3px cursor-pointer"
				>
					PC 버전 보기
				</button>
			</div>
			<div className="absolute bottom-10px right-16px">
				<HBCWhite />
			</div>
		</div>
	);
};
