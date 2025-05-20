type Product = {
	id: number;
	title: string;
	artist: string;
	artistImgSrc: string;
	description: string;
	albumImgSrc: string;
	genres?: string[];
	downloadUrl: string;
	type: "acapella" | "beat";
	licenses: {
		id: number;
		name: string;
		price: number;
		description: string;
		notes: (
			| string
			| {
					text: string;
					color: string;
			  }
		)[];
	}[];
};

const PRODUCTS: Array<Product> = [
	{
		id: 1,
		title: "Paranoid instrumental (Fm bpm86)",
		artist: "NotJake",
		artistImgSrc: "https://prod-assets.hitbeatclub.com/dummy/11.jpg",
		description:
			"Paranoid instrumental (Fm bpm86) Paranoid instrumental (Fm bpm86)Paranoid instrumental (Fm bpm86) Paranoid instrumental (Fm bpm86) Paranoid instrumental (Fm bpm86)Paranoid instrumental (Fm bpm86)",
		albumImgSrc: "https://prod-assets.hitbeatclub.com/dummy/11.jpg",
		downloadUrl: "https://prod-assets.hitbeatclub.com/dummy/NotJake+-+Paranoid+instrumental+(Fm+bpm86).mp3",
		genres: ["Hip-Hop", "R&B", "Pop", "Rock"],
		type: "beat",
		licenses: [
			{
				id: 1,
				name: "Exclusive",
				price: 100000,
				description: "MP3, WAV, Stems",
				notes: [
					"무제한 뮤직비디오 제작 가능",
					"상업적 라이브 공연에서 자유롭게 사용 가능",
					"라디오 방송 권한 (무제한 방송국 포함)",
					"온라인 오디오 스트리밍 무제한 가능",
					"음원 복제 및 유통 수량 제한 없음",
					"음악 녹음 및 발매용 사용 가능",
					"상업적 이용 가능",
					{
						text: "저작권 표기 필수",
						color: "text-hbc-red",
					},
				],
			},
			{
				id: 2,
				name: "Master",
				price: 15000,
				description: "MP3",
				notes: [
					"무제한 뮤직비디오 제작 가능",
					"상업적 라이브 공연에서 자유롭게 사용 가능",
					"라디오 방송 권한 (무제한 방송국 포함)",
					"온라인 오디오 스트리밍 무제한 가능",
					"음원 복제 및 유통 수량 제한 없음",
					"음악 녹음 및 발매용 사용 가능",
					"상업적 이용 가능",
					{
						text: "저작권 일체 판매",
						color: "text-hbc-blue",
					},
				],
			},
		],
	},
	{
		id: 2,
		title: "Fadeaway instrumental (Em bpm80)",
		artist: "NotJake",
		artistImgSrc: "https://prod-assets.hitbeatclub.com/dummy/11.jpg",
		description:
			"Fadeaway instrumental (Em bpm80) Fadeaway instrumental (Em bpm80)Fadeaway instrumental (Em bpm80) Fadeaway instrumental (Em bpm80) Fadeaway instrumental (Em bpm80)",
		albumImgSrc: "https://prod-assets.hitbeatclub.com/dummy/1111.jpg",
		downloadUrl: "https://prod-assets.hitbeatclub.com/dummy/NotJake+-+Fadeaway+instrumental+(Em+bpm80).mp3",
		genres: ["Hip-Hop", "R&B", "Pop", "Rock"],
		type: "acapella",
		licenses: [
			{
				id: 1,
				name: "Exclusive",
				price: 100000,
				description: "MP3, WAV, Stems",
				notes: [
					"무제한 뮤직비디오 제작 가능",
					"상업적 라이브 공연에서 자유롭게 사용 가능",
					"라디오 방송 권한 (무제한 방송국 포함)",
					"온라인 오디오 스트리밍 무제한 가능",
					"음원 복제 및 유통 수량 제한 없음",
					"음악 녹음 및 발매용 사용 가능",
					"상업적 이용 가능",
					{
						text: "저작권 표기 필수",
						color: "text-hbc-red",
					},
				],
			},
			{
				id: 2,
				name: "Master",
				price: 10000,
				description: "MP3",
				notes: [
					"무제한 뮤직비디오 제작 가능",
					"상업적 라이브 공연에서 자유롭게 사용 가능",
					"라디오 방송 권한 (무제한 방송국 포함)",
					"온라인 오디오 스트리밍 무제한 가능",
					"음원 복제 및 유통 수량 제한 없음",
					"음악 녹음 및 발매용 사용 가능",
					"상업적 이용 가능",
					{
						text: "저작권 일체 판매",
						color: "text-hbc-blue",
					},
				],
			},
		],
	},
	{
		id: 3,
		title: "Baby, show you instrumental (Em bpm60)",
		artist: "NotJake",
		artistImgSrc: "https://prod-assets.hitbeatclub.com/dummy/11.jpg",
		description:
			"Baby, show you instrumental (Em bpm60) Baby, show you instrumental (Em bpm60)Baby, show you instrumental (Em bpm60) Baby, show you instrumental (Em bpm60) Baby, show you instrumental (Em bpm60)",
		albumImgSrc: "https://prod-assets.hitbeatclub.com/dummy/333.jpg",
		downloadUrl: "https://prod-assets.hitbeatclub.com/dummy/NotJake+-+Baby,+show+you+instrumental+(Em+bpm60).mp3",
		type: "beat",
		licenses: [
			{
				id: 1,
				name: "Exclusive",
				price: 100000,
				description: "MP3, WAV, Stems",
				notes: [
					"무제한 뮤직비디오 제작 가능",
					"상업적 라이브 공연에서 자유롭게 사용 가능",
					"라디오 방송 권한 (무제한 방송국 포함)",
					"온라인 오디오 스트리밍 무제한 가능",
					"음원 복제 및 유통 수량 제한 없음",
					"음악 녹음 및 발매용 사용 가능",
					"상업적 이용 가능",
					{
						text: "저작권 표기 필수",
						color: "text-hbc-red",
					},
				],
			},
		],
	},
];

const PRODUCTS_MAP = PRODUCTS.reduce(
	(acc, product) => {
		acc[product.id] = product;
		return acc;
	},
	{} as Record<number, (typeof PRODUCTS)[number]>,
);

export { PRODUCTS, PRODUCTS_MAP };
