/**
 * 플레이리스트 시스템 사용 예제
 *
 * 이 파일은 새로운 플레이리스트 시스템을 어떻게 사용하는지 보여주는 예제입니다.
 * 실제 프로젝트에서는 이 컴포넌트들을 각 페이지에 통합하여 사용하세요.
 */

import React from "react";
import { PlaylistProvider, createPlaylistConfig } from "@/components/layout/PlaylistProvider";
import { usePlaylist } from "@/hooks/use-playlist";

/**
 * 메인 페이지에서의 사용 예제
 */
export const MainPageExample = () => {
	return (
		<PlaylistProvider
			autoPlaylistConfig={createPlaylistConfig.main("RECENT")}
			preserveGuestPlaylist={true}
		>
			<div>
				<h1>메인 페이지</h1>
				<p>이 페이지는 최신 곡들로 자동 플레이리스트를 생성합니다.</p>
				<PlaylistControls />
			</div>
		</PlaylistProvider>
	);
};

/**
 * 검색 페이지에서의 사용 예제
 */
export const SearchPageExample = ({ searchQuery }: { searchQuery: any }) => {
	return (
		<PlaylistProvider
			autoPlaylistConfig={createPlaylistConfig.search(searchQuery)}
			preserveGuestPlaylist={true}
		>
			<div>
				<h1>검색 결과</h1>
				<p>검색 결과에 기반한 플레이리스트가 생성됩니다.</p>
				<PlaylistControls />
			</div>
		</PlaylistProvider>
	);
};

/**
 * 아티스트 페이지에서의 사용 예제
 */
export const ArtistPageExample = ({ artistId }: { artistId: number }) => {
	return (
		<PlaylistProvider
			autoPlaylistConfig={createPlaylistConfig.artist(artistId)}
			preserveGuestPlaylist={true}
		>
			<div>
				<h1>아티스트 페이지</h1>
				<p>이 아티스트의 곡들로 플레이리스트가 생성됩니다.</p>
				<PlaylistControls />
			</div>
		</PlaylistProvider>
	);
};

/**
 * 플레이리스트 컨트롤 컴포넌트 (예제)
 */
const PlaylistControls = () => {
	const { trackIds, currentIndex, currentPlayableTrackId, syncStatus, playNextTrack, playPreviousTrack, isLoggedIn } =
		usePlaylist();

	return (
		<div className="border p-4 rounded">
			<h3>플레이리스트 정보</h3>
			<div>
				<p>총 트랙 수: {trackIds.length}</p>
				<p>현재 인덱스: {currentIndex}</p>
				<p>현재 재생 가능한 트랙 ID: {currentPlayableTrackId}</p>
				<p>동기화 상태: {syncStatus}</p>
				<p>로그인 상태: {isLoggedIn ? "로그인됨" : "비로그인"}</p>
			</div>

			<div className="flex gap-2 mt-4">
				<button
					onClick={playPreviousTrack}
					disabled={currentIndex === 0}
					className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
				>
					이전 곡
				</button>

				<button
					onClick={playNextTrack}
					disabled={currentIndex === trackIds.length - 1}
					className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
				>
					다음 곡
				</button>
			</div>
		</div>
	);
};

/**
 * 수동 플레이리스트 생성 예제
 */
export const ManualPlaylistExample = () => {
	const { createManualPlaylist, addTrackToPlaylist } = usePlaylist();

	const handleCreateManualPlaylist = async () => {
		try {
			const trackIds = [1, 2, 3, 4, 5]; // 예제 트랙 ID들
			await createManualPlaylist({ trackIds });
			console.log("수동 플레이리스트가 생성되었습니다.");
		} catch (error) {
			console.error("플레이리스트 생성 실패:", error);
		}
	};

	const handleAddTrack = () => {
		const newTrackId = Math.floor(Math.random() * 1000); // 랜덤 트랙 ID
		addTrackToPlaylist(newTrackId);
	};

	return (
		<div className="border p-4 rounded">
			<h3>수동 플레이리스트 관리</h3>
			<div className="flex gap-2 mt-4">
				<button
					onClick={handleCreateManualPlaylist}
					className="px-4 py-2 bg-green-500 text-white rounded"
				>
					수동 플레이리스트 생성
				</button>

				<button
					onClick={handleAddTrack}
					className="px-4 py-2 bg-orange-500 text-white rounded"
				>
					랜덤 트랙 추가
				</button>
			</div>
		</div>
	);
};

/**
 * 전체 사용 예제
 */
export const FullPlaylistExample = () => {
	return (
		<div className="space-y-8 p-8">
			<h1>플레이리스트 시스템 사용 예제</h1>

			<div>
				<h2>1. 메인 페이지 예제</h2>
				<MainPageExample />
			</div>

			<div>
				<h2>2. 검색 페이지 예제</h2>
				<SearchPageExample searchQuery={{ keyword: "test" }} />
			</div>

			<div>
				<h2>3. 아티스트 페이지 예제</h2>
				<ArtistPageExample artistId={1} />
			</div>

			<div>
				<h2>4. 수동 플레이리스트 관리</h2>
				<PlaylistProvider>
					<ManualPlaylistExample />
				</PlaylistProvider>
			</div>
		</div>
	);
};
