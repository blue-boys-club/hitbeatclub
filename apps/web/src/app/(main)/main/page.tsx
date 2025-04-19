"use client";

import { useToast } from "@/hooks/use-toast";

export default function MainPage() {
	const { toast } = useToast();

	const handleSampleToast = () => {
		toast({
			// title: "Sample Toast",
			description: "This is a sample toast",
		});
	};

	return (
		<div>
			MainPage Test
			<br />
			TODO: `/main` URL은 사용하지 않을 예정입니다. (테스트 용도로 페이지 하나 따로 판 상황입니다)
			<br />
			<button
				className="border cursor-pointer"
				onClick={handleSampleToast}
			>
				Sample Toast
			</button>
			<br />
			Long Page Test:
			<br />
			{Array.from({ length: 100 }).map((_, index) => (
				<div key={index}>{index}</div>
			))}
		</div>
	);
}
