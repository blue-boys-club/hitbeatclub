"use client";
import { useState } from "react";
import { Delete, Edit, SmallEqualizer } from "@/assets/svgs";
import { AlbumCoverCard, Badge, SquareDropdown, TagDropdown } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { SearchTag } from "@/components/ui/SearchTag";
import ArtistStudioTrackModal from "@/features/artist/components/modal/ArtistStudioTrackModal";
import ArtistStudioDashDeleteTrackModal from "@/features/artist/components/modal/ArtistStudioDashDeleteTrackModal";
import ArtistStudioDashCompleteModal from "@/features/artist/components/modal/ArtistStudioDashCompleteModal";
import blankCdImage from "@/assets/images/blank-cd.png";

const ArtistStudioDashboardContentList = () => {
	const [editingProductId, setEditingProductId] = useState<number | null>(null);
	const [isDeleteTrackOpen, setIsDeleteTrackOpen] = useState<boolean>(false);
	const [isCompleteOpen, setIsCompleteOpen] = useState<boolean>(false);

	const openEditTrackModal = (id: number) => setEditingProductId(id);
	const closeEditTrackModal = () => setEditingProductId(null);
	const openDeleteTrackModal = () => setIsDeleteTrackOpen(true);
	const closeDeleteTrackModal = () => setIsDeleteTrackOpen(false);
	const openCompleteModal = () => setIsCompleteOpen(true);
	const closeCompleteModal = () => setIsCompleteOpen(false);

	return (
		<>
			<section>
				<div className="border-b-6 pl-[2px] pb-2 text-hbc-black text-[24px] font-extrabold leading-[100%] tracking-[0.24px]">
					컨텐츠 목록
				</div>
				<div className="flex flex-col gap-2">
					<div className="pt-4 flex justify-between">
						<div className="flex gap-1">
							<Button
								size={"sm"}
								variant={"outline"}
								className="rounded-none border-4"
							>
								ALL
							</Button>
							<Button
								size={"sm"}
								variant={"outline"}
								rounded={"full"}
								className="border-4"
							>
								공개
							</Button>
							<Button
								size={"sm"}
								variant={"outline"}
								rounded={"full"}
								className="border-4"
							>
								비공개
							</Button>
							<Button
								size={"sm"}
								variant={"outline"}
								rounded={"full"}
								className="border-4"
							>
								판매완료
							</Button>
						</div>
						<SquareDropdown
							buttonClassName={"border-x-[3px] border-y-[4px] w-[109px] h-7 justify-initial"}
							optionsClassName={"w-[109px] border-x-[3px] border-y-[4px]"}
							optionClassName={
								"h-7 p-0 pl-3 flex items-center text-black font-suisse text-base font-bold leading-[150%] tracking-[0.16px]"
							}
							options={[
								{ label: "Recent", value: "1" },
								{ label: "A - Z", value: "2" },
								{ label: "Popular", value: "3" },
							]}
						/>
					</div>
					<div className="flex gap-1">
						<TagDropdown
							trigger={<span className="font-medium leading-[16px]">Category</span>}
							options={[]}
						/>
						<TagDropdown
							trigger={<span className="font-medium leading-[16px]">Genre</span>}
							options={[]}
						/>
						<TagDropdown
							trigger={<span className="font-medium leading-[16px]">Key</span>}
							options={[]}
						/>
						<TagDropdown
							trigger={<span className="font-medium leading-[16px]">BPM</span>}
							options={[]}
						/>
					</div>
					<div>
						<SearchTag placeholder={"Search tag"} />
					</div>
				</div>
				<div className="grid grid-cols-1">
					<div className="flex gap-4 border-b-hbc-black bg-hbc-white py-3 px-2 border-b-4 border-black">
						<AlbumCoverCard
							albumImgSrc={blankCdImage}
							size={"xl"}
							AlbumCoverCardWrapperClassName={"rounded-full"}
							AlbumCoverCardInnerClassName={"rounded-full"}
						/>
						<div className="flex-grow flex justify-between gap-2">
							<div>
								<div className="flex flex-col gap-3">
									<div className="flex gap-3 items-center">
										<span className="text-hbc-black text-[26px] font-bold leading-[100%] tracking-[0.26px]">
											Cheek To Cheek
										</span>
										<Badge
											variant={"secondary"}
											size={"sm"}
											rounded={true}
										>
											비공개
										</Badge>
									</div>
									<div className="flex gap-1">
										<Badge
											size={"sm"}
											rounded={true}
											bold={"semibold"}
										>
											Boombap
										</Badge>
										<Badge
											size={"sm"}
											rounded={true}
											bold={"semibold"}
										>
											Old School
										</Badge>
									</div>
									<div className="text-hbc-black text-base font-[450] leading-[150%] tracking-[0.16px]">
										<div>BPM : 120BPM</div>
										<div>Key : G min</div>
										<div>Basic : {(100000).toLocaleString()} KRW</div>
									</div>
								</div>
							</div>
							<div className="flex flex-col justify-between items-end">
								<div className="flex gap-2 ">
									<Button
										variant="outline"
										size="sm"
										rounded="full"
										className="flex gap-1.5 border-1"
										onClick={() => openEditTrackModal(1)}
									>
										<div className="text-hbc-black text-[12px] font-suit font-bold leading-[100%] tracking-[0.12px]">
											수정하기
										</div>
										<Edit />
									</Button>
									<Button
										variant="outline"
										size="sm"
										rounded="full"
										className="flex gap-1.5 border-1"
										onClick={openDeleteTrackModal}
									>
										<div className="text-hbc-black text-[12px] font-suit font-bold leading-[100%] tracking-[0.12px]">
											삭제하기
										</div>
										<Delete />
									</Button>
								</div>
								<div>
									<SmallEqualizer />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{editingProductId && (
				<ArtistStudioTrackModal
					mode="edit"
					isModalOpen={true}
					onClose={closeEditTrackModal}
					openCompleteModal={openCompleteModal}
					productId={editingProductId}
				/>
			)}

			<ArtistStudioDashDeleteTrackModal
				isModalOpen={isDeleteTrackOpen}
				onClose={closeDeleteTrackModal}
			/>
			<ArtistStudioDashCompleteModal
				isModalOpen={isCompleteOpen}
				onClose={closeCompleteModal}
			/>
		</>
	);
};

export default ArtistStudioDashboardContentList;
