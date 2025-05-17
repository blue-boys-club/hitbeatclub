type Product = {
	id: number;
	title: string;
	artist: string;
	description: string;
	albumImgSrc: string;
	genres?: string[];
	downloadUrl: string;
	licenses: {
		id: number;
		name: string;
		price: number;
		specialNote: {
			text: string;
			color: string;
		};
	}[];
};

const PRODUCTS: Array<Product> = [
	{
		id: 1,
		title: "Paranoid instrumental (Fm bpm86)",
		artist: "NotJake",
		description:
			"Paranoid instrumental (Fm bpm86) Paranoid instrumental (Fm bpm86)Paranoid instrumental (Fm bpm86) Paranoid instrumental (Fm bpm86) Paranoid instrumental (Fm bpm86)Paranoid instrumental (Fm bpm86)",
		albumImgSrc: "https://prod-assets.hitbeatclub.com/dummy/11.jpg",
		downloadUrl: "https://prod-assets.hitbeatclub.com/dummy/NotJake+-+Paranoid+instrumental+(Fm+bpm86).mp3",
		genres: ["Hip-Hop", "R&B", "Pop", "Rock"],
		licenses: [
			{
				id: 1,
				name: "Exclusive",
				price: 100000,
				specialNote: {
					text: "저작권 표기 필수",
					color: "text-hbc-red",
				},
			},
			{
				id: 2,
				name: "Master",
				price: 15000,
				specialNote: {
					text: "저작권 일체 판매",
					color: "text-hbc-blue",
				},
			},
		],
	},
	{
		id: 2,
		title: "Fadeaway instrumental (Em bpm80)",
		artist: "NotJake",
		description:
			"Fadeaway instrumental (Em bpm80) Fadeaway instrumental (Em bpm80)Fadeaway instrumental (Em bpm80) Fadeaway instrumental (Em bpm80) Fadeaway instrumental (Em bpm80)",
		albumImgSrc: "https://prod-assets.hitbeatclub.com/dummy/1111.jpg",
		downloadUrl: "https://prod-assets.hitbeatclub.com/dummy/NotJake+-+Fadeaway+instrumental+(Em+bpm80).mp3",
		genres: ["Hip-Hop", "R&B", "Pop", "Rock"],
		licenses: [
			{
				id: 1,
				name: "Exclusive",
				price: 100000,
				specialNote: {
					text: "저작권 표기 필수",
					color: "text-hbc-red",
				},
			},
			{
				id: 2,
				name: "Master",
				price: 10000,
				specialNote: {
					text: "저작권 일체 판매",
					color: "text-hbc-blue",
				},
			},
		],
	},
	{
		id: 3,
		title: "Baby, show you instrumental (Em bpm60)",
		artist: "NotJake",
		description:
			"Baby, show you instrumental (Em bpm60) Baby, show you instrumental (Em bpm60)Baby, show you instrumental (Em bpm60) Baby, show you instrumental (Em bpm60) Baby, show you instrumental (Em bpm60)",
		albumImgSrc: "https://prod-assets.hitbeatclub.com/dummy/333.jpg",
		downloadUrl: "https://prod-assets.hitbeatclub.com/dummy/NotJake+-+Baby,+show+you+instrumental+(Em+bpm60).mp3",
		licenses: [
			{
				id: 1,
				name: "Exclusive",
				price: 100000,
				specialNote: {
					text: "저작권 표기 필수",
					color: "text-hbc-red",
				},
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
