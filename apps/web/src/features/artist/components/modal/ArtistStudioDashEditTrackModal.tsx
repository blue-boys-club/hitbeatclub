"use client";
import { Acapella, Beat, LargeEqualizer, MinusCircle, Plus, PlusCircle } from "@/assets/svgs";
import Circle from "@/assets/svgs/Circle";
import { cn } from "@/common/utils";
import { AlbumAvatar, Badge, BPMDropdown, Dropdown, Input, KeyDropdown } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { GenreButton } from "@/components/ui/GenreButton";
import { Popup, PopupButton, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { TagButton } from "@/components/ui/TagButton";
import { useState } from "react";

type BPM = number | undefined;
type BPMRange = { min?: number | undefined; max?: number | undefined } | undefined;

interface ArtistStudioDashEditTrackModalProps {
	isModalOpen: boolean;
	onClose: () => void;
	openCompleteModal: () => void;
}
const ArtistStudioDashEditTrackModal = ({
	isModalOpen,
	onClose,
	openCompleteModal,
}: ArtistStudioDashEditTrackModalProps) => {
	const [exactBPM, setExactBPM] = useState<BPM>(undefined);
	const [bpmRange, setBpmRange] = useState<BPMRange>({
		min: undefined,
		max: undefined,
	});
	const [keyValue, setKeyValue] = useState<string>();
	const [scaleValue, setScaleValue] = useState<string>();

	const onChangeExactBPM = (bpm: number) => {
		if (isNaN(bpm)) return;

		setExactBPM(bpm === 0 ? undefined : bpm);
	};

	const onChangeBPMRange = (type: "min" | "max", bpm: number) => {
		if (isNaN(bpm)) return;

		if (type === "min") {
			setBpmRange((prev) => ({
				...prev,
				min: bpm === 0 ? undefined : bpm,
			}));
		} else {
			setBpmRange((prev) => ({
				...prev,
				max: bpm === 0 ? undefined : bpm,
			}));
		}
	};

	const onChangeKey = (newKey: string) => {
		if (keyValue !== newKey) {
			setScaleValue(undefined);
		}

		setKeyValue(newKey);
	};

	const onChangeScale = (scale: string) => {
		setScaleValue(scale);
	};

	const onClearKey = () => {
		setKeyValue(undefined);
		setScaleValue(undefined);
	};

	const onClearBPM = () => {
		setExactBPM(undefined);
		setBpmRange({ min: undefined, max: undefined });
	};

	const onSave = () => {
		onClose();
		openCompleteModal();
	};

	return (
		<Popup
			open={isModalOpen}
			onOpenChange={onClose}
		>
			<PopupContent className="max-w-[649px] pb-6">
				<PopupHeader>
					<PopupTitle>트랙 수정</PopupTitle>
				</PopupHeader>
				<section className="grid grid-cols-2 gap-6">
					<div className="flex flex-col gap-10">
						<div className="flex flex-col justify-center items-center gap-[10px]">
							<AlbumAvatar
								src="/"
								alt="앨범 사진"
							/>
							<div className="flex flex-col gap-1">
								<div className="flex items-center justify-center">
									<Button
										rounded={"full"}
										size={"sm"}
									>
										이미지 업로드
									</Button>
								</div>
								<div className={cn("invisible", "flex items-center gap-1")}>
									<div className="rotate-45">
										<Plus stroke="red" />
									</div>
									<span className="text-hbc-red font-[SUIT] text-md font-extrabold leading-[150%] tracking-[0.12px]">
										사용할 수 없는 파일입니다.
									</span>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-[10px] justify-center items-center">
							<Badge
								variant="destructive"
								className="flex gap-[7px] px-5 py-[14px] rounded-5px"
							>
								<LargeEqualizer fill="white" />
								<div>Cheek_to_cheek.mp3</div>
							</Badge>
							<div>
								<Button
									rounded={"full"}
									size={"sm"}
								>
									MP3 파일 업로드
								</Button>
							</div>
							<div className={cn("invisible", "flex items-center justify-center gap-1")}>
								<Circle />
								<span className="text-[#3884FF] text-sm font-extrabold ">완료 !</span>
							</div>
						</div>
						<div className="flex flex-col gap-[10px] justify-center items-center">
							<Badge
								variant="destructive"
								className="flex gap-[7px] px-5 py-[14px] rounded-5px"
							>
								<LargeEqualizer fill="white" />
								<div>Cheek_to_cheek.zip</div>
							</Badge>
							<div>
								<Button
									rounded={"full"}
									size={"sm"}
								>
									압축 파일 업로드
								</Button>
							</div>
							<div className={cn("invisible", "flex items-center justify-center gap-1")}>
								<Circle />
								<span className="text-[#3884FF] text-sm font-extrabold ">완료 !</span>
							</div>
						</div>
					</div>
					{/* 오른쪽 부분 */}
					<div className="flex flex-col gap-2.5">
						<div className="flex flex-col gap-[5px]">
							<div className="font-[SUIT] text-xs flex justify-between">
								<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">제목</div>
								<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">필수 입력사항 입니다.</div>
							</div>
							<Input variant={"rounded"} />
						</div>
						<div className="flex flex-col gap-[5px]">
							<div className="font-[SUIT] text-xs flex justify-between">
								<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">곡 설명 / 가사</div>
								<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">필수 입력사항 입니다.</div>
							</div>
							<textarea className="border-x-[1px] border-y-[2px] border-black rounded-lg p-2 h-[162px] resize-none text-hbc-black font-suit text-xs font-semibold leading-[160%] tracking-[0.18px] focus:outline-none" />
						</div>
						<div className="grid grid-cols-2 gap-7">
							<Button
								size={"md"}
								rounded={"full"}
							>
								<Beat
									width="42"
									height="12"
									fill="white"
								/>
							</Button>
							<Button
								size={"md"}
								variant={"outline"}
								rounded={"full"}
							>
								<Acapella
									width="90"
									height="12"
									fill="black"
								/>
							</Button>
						</div>
						<div className="flex flex-col gap-[5px]">
							<div className="font-[SUIT] text-xs flex justify-between">
								<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">장르</div>
								<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">필수 입력사항 입니다.</div>
							</div>
							<div className="flex gap-[5px] p-2 border-x-[1px] border-y-[2px] border-black rounded-[5px]">
								<GenreButton
									name="Hip-hop"
									showDeleteButton
									onDelete={() => {
										alert("Hip-hop 장르 선택 해제");
									}}
								/>
								<GenreButton
									name="G-funk"
									showDeleteButton
									onDelete={() => {
										alert("G-funk 장르 선택 해제");
									}}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-[5px]">
							<div className="font-[SUIT] text-xs flex justify-between">
								<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">태그</div>
								<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">필수 입력사항 입니다.</div>
							</div>
							<div className="flex gap-[5px] p-2 border-x-[1px] border-y-[2px] border-black rounded-[5px] h-[92px]">
								<TagButton name="Hip-hop" />
								<TagButton name="G-funk" />
							</div>
						</div>
						<div className="flex flex-col gap-[5px]">
							<div className="font-[SUIT] text-xs flex justify-between">
								<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">BPM</div>
							</div>
							<BPMDropdown
								bpmValue={exactBPM}
								bpmRangeValue={bpmRange}
								onChangeExactBPM={onChangeExactBPM}
								onChangeBPMRange={onChangeBPMRange}
								onClear={onClearBPM}
							/>
						</div>
						<div className="flex flex-col gap-[5px]">
							<div className="font-[SUIT] text-xs flex justify-between">
								<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">Key</div>
							</div>
							<KeyDropdown
								keyValue={keyValue}
								scaleValue={scaleValue}
								onChangeKey={onChangeKey}
								onChangeScale={onChangeScale}
								onClear={onClearKey}
							/>
						</div>
						<div className="flex flex-col gap-[5px]">
							<div className="font-[SUIT] text-xs flex justify-between">
								<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">License</div>
								<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">필수 입력사항 입니다.</div>
							</div>
							<div className="flex gap-5 items-center">
								<div className="flex-grow grid grid-cols-2 gap-[5px]">
									<Input variant={"rounded"} />
									<Input variant={"rounded"} />
								</div>
								<button className="flex-shrink-0 cursor-pointer">
									<MinusCircle />
								</button>
							</div>

							<button className="flex justify-center cursor-pointer">
								<PlusCircle />
							</button>
						</div>
						<div className="flex flex-col gap-[5px]">
							<div className="font-[SUIT] text-xs flex justify-between">
								<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">공개여부</div>
							</div>
							<div className="grid grid-cols-2">
								<Dropdown
									className="w-full"
									buttonClassName="border-x-1px border-y-2px"
									defaultValue="공개"
									options={[{ label: "공개", value: "공개" }]}
								/>
							</div>
						</div>
						<div className="w-full flex justify-end gap-1">
							<input
								id="free-download-checkbox"
								type="checkbox"
							/>
							<label
								htmlFor="free-download-checkbox"
								className="select-none text-[#000] font-[Suisse Int'l] text-[12px] font-semibold leading-normal tracking-[0.12px]"
							>
								Free DownLoad
							</label>
						</div>
					</div>
				</section>

				<PopupFooter>
					<PopupButton
						onClick={onClose}
						className="bg-white px-2 py-1 text-hbc-gray-200 border-b-2 border-hbc-gray-200 rounded-none font-[Suisse Int'l] text-[24px] font-bold leading-normal tracking-[0.24px]"
					>
						CANCEL
					</PopupButton>
					<PopupButton
						onClick={onSave}
						className="bg-white px-2 py-1 text-hbc-red border-b-2 border-hbc-red rounded-none font-[SUIT] text-[24px] font-extrabold leading-normal tracking-[0.24px]"
					>
						SAVE
					</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};

export default ArtistStudioDashEditTrackModal;
