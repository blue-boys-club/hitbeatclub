import { Popup } from "@/components/ui";

interface ArtistStudioPayoutWithdrawInformationModalProps {
	children: React.ReactNode;
}

export const ArtistStudioPayoutWithdrawInformationModal = ({
	children,
}: ArtistStudioPayoutWithdrawInformationModalProps) => {
	return (
		<Popup.Popup>
			<Popup.PopupTrigger asChild>{children}</Popup.PopupTrigger>
			<Popup.PopupContent className="max-w-[708px] w-full">
				<Popup.PopupHeader>
					<Popup.PopupTitle>🔔 정산 관련 안내사항</Popup.PopupTitle>
					<Popup.PopupDescription className="sr-only">정산 관련 안내사항을 확인할 수 있습니다.</Popup.PopupDescription>
				</Popup.PopupHeader>

				<div className="flex flex-col items-center">
					<section className="text-16px leading-160% text-hbc-black font-suit -tracking-032px font-bold w-[534px]">
						<p>💸 정산 안내</p>
						<p>
							안녕하세요, 히트비트클럽입니다.
							<br />
							정산은 아래 기준에 따라 매월 말일 기준으로 정기 진행되며,
							<br />
							안정적인 수익 정산을 위해 꼭 확인해주세요!
						</p>
						<br />
						<p>📆 정산 일정 및 기준</p>
						<ul className="list-disc ml-24px">
							<li>정산 기준 기간: 매월 16일 ~ 익월 15일까지의 거래 내역</li>
							<li>정산 지급일: 익월 말일 정산 (예: 4/16~5/15 → 5/31 정산)</li>
							<li>
								<span className="text-hbc-red">※ 말일이 주말/공휴일인 경우, 익영업일에 지급됩니다</span>
							</li>
						</ul>
						<br />
						<p>🧾 정산 금액 기준</p>
						<ul className="list-disc ml-24px">
							<li>
								정산 예정 금액은 세금 및 수수료 공제 전 금액(
								<span className="text-hbc-red">세전 금액</span>
								)입니다.
							</li>
							<li>카드 결제 수수료 및 원천세(3.3%)가 차감된 후 최종 지급됩니다.</li>
							<li>정산 시 실제 입금액은 시스템 표기 금액과 다소 차이가 날 수 있습니다.</li>
						</ul>
						<br />
						<p>🏦 정산 계좌 및 지급 정보</p>
						<ul className="list-disc ml-24px">
							<li>정산을 위해 [판매자 정보] &gt; 계좌 정보 입력이 필수입니다</li>
							<li>
								계좌번호 오기입, 예금주 불일치 등으로 인한 오지급은 회사가 책임지지 않으며,
								<br />
								재지급은 확인 후 재요청 시 처리됩니다
							</li>
							<li>
								해외 판매자는 정확한 페이팔 이메일 입력 필요
								<br />
								<span className="text-hbc-red">※ 페이팔 송금 수수료는 판매자 부담입니다</span>
							</li>
						</ul>
						<br />
						<p>🧠 정산 유의사항</p>
						<ul className="list-disc ml-24px">
							<li>판매 수익 + 레퍼럴 수익 정산 대상</li>
							<li>단, 레퍼럴 수익은 구독 유지 중인 유저에 한해 정산</li>
							<li>무료 체험 중인 유저, 구독 취소/환불 유저 제외</li>
							<li>최소 정산금 50,000원 미만 시 익월 이월</li>
						</ul>
						<br />
						<p>🛑 정산 보류 조건</p>
						<p>회사는 아래와 같은 사유로 정산 지급을 보류/연기할 수 있습니다.</p>
						<ul className="list-disc ml-24px">
							<li>계좌 정보 불일치 또는 미입력</li>
							<li>세금 관련 서류 미제출</li>
							<li>이용약관 및 정책 위반</li>
							<li>기타 회사가 지급 보류가 필요하다고 판단한 경우</li>
						</ul>
						<br />
						<p>💡 추가 안내</p>
						<ul className="list-disc ml-24px">
							<li>정산 예정 금액은 [정산 탭]에서 실시간 확인 가능</li>
							<li>정산 수령으로 인한 세금 신고 및 납부는 이용자 책임입니다</li>
							<li>회사는 필요 시 정산 방식 및 정책을 조정할 수 있습니다</li>
							<li>
								문의사항은 고객센터 또는 <a href="mailto:info@hitbeatclub.com">info@hitbeatclub.com</a> 으로
								문의해주세요
							</li>
						</ul>

						<br />
						<span className="text-24px font-bold leading-160% text-hbc-black font-suit -tracking-048px">
							✅ 정산 정보는 내 수익과 직결됩니다!
							<br /> 꼭 확인하고 누락 없이 정산 정보를 입력해주세요 🙌
						</span>
					</section>
				</div>

				<Popup.PopupFooter>
					<Popup.PopupButton className="text-hbc-white bg-hbc-red">안내 사항을 확인 했습니다</Popup.PopupButton>
				</Popup.PopupFooter>
			</Popup.PopupContent>
		</Popup.Popup>
	);
};
