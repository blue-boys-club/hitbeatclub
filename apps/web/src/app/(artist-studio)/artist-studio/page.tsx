"use client";

import { getArtistMeQueryOption } from "@/apis/artist/query/artist.query-options";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ArtistStudioPage() {
	const router = useRouter();
	const {
		data: artistMe,
		isSuccess,
		isError,
	} = useQuery({
		...getArtistMeQueryOption(),
	});

	useEffect(() => {
		if (isSuccess) {
			router.push(`/artist-studio/${artistMe.id}`);
		} else if (isError) {
			router.back();
		}
	}, [artistMe, router, isSuccess, isError]);

	return null;

	// return <div>아티스트 스튜디오 페이지</div>;
}
