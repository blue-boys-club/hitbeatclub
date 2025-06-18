"use client";

import { memo, useRef, useState } from "react";
import { Popup, PopupButton, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { PopupButton as BasicPopupButton } from "@/components/ui/PopupButton";
import { cn } from "@/common/utils/tailwind";
import { useSubscription } from "../../hooks/useSubscription";
import { useFormContext } from "react-hook-form";
import { SubscribeFormValue } from "../../schema";
import { Input } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";

/**
 * 프로모션 코드 입력 모달 컴포넌트
 */
export const PromotionCodeModal = memo(() => {
	const { modals, closeModal, validatePromotionCode } = useSubscription();
	const { setValue } = useFormContext<SubscribeFormValue>();
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isValidating, setIsValidating] = useState(false);
	const { toast } = useToast();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleOnOpenChange = (open: boolean) => {
		if (!open) {
			closeModal("promotion");
		}

		if (open && inputRef.current) {
			inputRef.current.focus();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCode(e.target.value);
		setError(null);
	};

	const handleApplyCode = async () => {
		if (!code.trim()) {
			setError("프로모션 코드를 입력해주세요.");
			return;
		}

		setIsValidating(true);
		try {
			const isValid = await validatePromotionCode(code);

			if (isValid) {
				// FormContext를 통해 부모 폼에 코드 적용
				setValue("promotionCode", code, { shouldValidate: true });
				toast({
					description: (
						<span className="text-16 font-suit font-normal leading-150% tracking-016px">
							히트 코드가 적용 되었습니다.
						</span>
					),
				});
				closeModal("promotion");
			} else {
				setError("유효하지 않은 프로모션 코드입니다.");
			}
		} catch (error) {
			setError("프로모션 코드 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
			console.error("Failed to validate promotion code:", error);
		} finally {
			setIsValidating(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleApplyCode();
		}
	};

	return (
		<Popup
			open={modals.promotion}
			onOpenChange={handleOnOpenChange}
		>
			<PopupContent className="max-w-[589px] flex flex-col items-center justify-center">
				<PopupHeader>
					<PopupTitle className="text-[26px] font-bold">🎁 히트 코드를 입력해 혜택을 받아보세요!</PopupTitle>
				</PopupHeader>

				<div className="flex flex-col items-start justify-start gap-25px">
					<p className="text-16px leading-32px tracking-016px">히트 코드를 입력하면, 혜택이 자동으로 적용돼요.</p>

					<p className="whitespace-pre-line text-16px leading-32px tracking-016px">
						{"❗ 유효하지 않은 코드일 경우 적용되지 않아요.\n❗ 이미 사용한 코드는 다시 사용할 수 없어요."}
					</p>

					<div className="w-full">
						<Input
							ref={inputRef}
							type="text"
							placeholder="예: HITBEAT2025"
							className={cn("w-full p-2", error && "border-hbc-red")}
							value={code}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
						/>
						{error && <p className="mt-1 text-sm text-hbc-red">{error}</p>}

						<p className="mt-3 text-sm text-gray-500">* 프로모션 코드는 대소문자를 구분합니다.</p>
					</div>
				</div>

				<PopupFooter className={cn("flex", isValidating && "opacity-50 pointer-events-none")}>
					<PopupButton
						intent="cancel"
						onClick={() => closeModal("promotion")}
						disabled={isValidating}
					>
						취소
					</PopupButton>

					<BasicPopupButton
						intent="confirm"
						className="bg-hbc-red disabled:bg-hbc-red/50 disabled:pointer-events-none disabled:cursor-not-allowed"
						onClick={handleApplyCode}
						disabled={isValidating}
					>
						{isValidating ? "확인 중..." : "적용하기"}
					</BasicPopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

PromotionCodeModal.displayName = "PromotionCodeModal";
