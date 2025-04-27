import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Order, UserInfo, ArtistInfo, Product, ProductsByArtist } from "../types";

// --- Mock Data (moved from OrderItem, adjust as needed) ---

const defaultUserInfo: UserInfo = {
	name: "김일상",
	email: "kimilsang@everyday-practice.com",
	phone: "010-1234-5678",
	address: "서울시 마포구 포은로 127 망원제일빌딩 3층",
};

const defaultArtist1: ArtistInfo = {
	id: "artist-beenzino",
	name: "Beenzino",
	realName: "임성빈",
	location: "Korea, Republic of",
	city: "서울시",
	iconUrl: "https://placehold.co/51x51.png",
	links: [{ type: "kakaotalk", value: "https://kakao.me/beenzino" }],
};

const defaultProducts1: Product[] = [
	{
		id: "prod-1",
		imageUrl: "https://placehold.co/79x79.png",
		title: "빈지노 타입 아카펠라 #1",
		type: "acapella",
		licenseType: "Exclusive (mp3, wav, stems)",
		price: 140000,
		downloadStatus: "available",
		licenseUrl: "#",
		bpm: 130,
		key: "A min",
	},
	{
		id: "prod-2",
		imageUrl: "https://placehold.co/79x79.png",
		title: "빈지노 타입 비트 #2",
		type: "beat",
		licenseType: "Basic (mp3)",
		price: 30000,
		downloadStatus: "downloaded",
		licenseUrl: "#",
		bpm: 130,
		key: "A min",
	},
];

const defaultArtist2: ArtistInfo = {
	id: "artist-codekunst",
	name: "Code Kunst",
	realName: "조성우",
	location: "Korea, Republic of",
	city: "서울시",
	iconUrl: "https://placehold.co/51x51.png",
	links: [{ type: "instagram", value: "https://instagram.com/code_kunst" }],
};

const defaultProducts2: Product[] = [
	{
		id: "prod-3",
		imageUrl: "https://placehold.co/79x79.png",
		title: "코드쿤스트 타입 비트 #3",
		type: "beat",
		licenseType: "Exclusive (mp3, wav, stems)",
		price: 150000,
		downloadStatus: "available",
		licenseUrl: "#",
		bpm: 90,
		key: "C maj",
	},
];

const mockOrderHistory: Order[] = [
	{
		id: "order-123",
		orderDate: "2024/10/05",
		orderTime: "12:06 AM",
		userInfo: defaultUserInfo,
		productsByArtist: {
			[defaultArtist1.id]: {
				artistInfo: defaultArtist1,
				products: defaultProducts1,
			},
		},
		subtotal: 170000,
		serviceFee: 0,
		total: 170000,
	},
	{
		id: "order-456",
		orderDate: "2024/11/15",
		orderTime: "03:30 PM",
		userInfo: { ...defaultUserInfo, name: "박개발" }, // Different user for variation
		productsByArtist: {
			[defaultArtist1.id]: {
				artistInfo: defaultArtist1,
				products: [defaultProducts1[1]!],
			},
			[defaultArtist2.id]: {
				artistInfo: defaultArtist2,
				products: defaultProducts2,
			},
		},
		subtotal: 30000 + 150000,
		serviceFee: 5000,
		total: 30000 + 150000 + 5000,
	},
	// Add more mock orders as needed
];

// --- API Fetching Functions ---

// Fetches the entire list of orders
const fetchOrderHistory = async (): Promise<Order[]> => {
	await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
	console.log("Fetching mock order history list...");
	return mockOrderHistory;
};

// Fetches a single order by its ID
const fetchOrderById = async (orderId: string): Promise<Order | undefined> => {
	await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay
	console.log(`Fetching mock order details for ID: ${orderId}...`);
	const order = mockOrderHistory.find((o) => o.id === orderId);
	if (!order) {
		// In a real app, the API might return 404, which could be handled here
		console.error(`Order with ID ${orderId} not found in mock data.`);
		// Returning undefined might be okay, or throw an error depending on desired behavior
	}
	return order;
};

// --- Query Keys Factory ---
// Centralized place to manage query keys for orders

export const orderQueryKeys = {
	all: ["orders"] as const, // Key for the list
	lists: () => [...orderQueryKeys.all, "list"] as const, // More specific key for lists if needed
	details: () => [...orderQueryKeys.all, "detail"] as const, // Base key for details
	detail: (id: string) => [...orderQueryKeys.details(), id] as const, // Key for a specific order detail
};

// --- React Query Hooks ---

// --- Optional: Pre-configured Query Options (if needed) ---
// Can still export options functions if you want defaults separate from hooks

export const getOrderHistoryQueryOptions = (): UseQueryOptions<Order[], Error> => ({
	queryKey: orderQueryKeys.lists(),
	queryFn: fetchOrderHistory,
	staleTime: 5 * 60 * 1000, // Example: 5 minutes stale time
});

export const getOrderDetailsQueryOptions = (orderId: string): UseQueryOptions<Order | undefined, Error> => ({
	queryKey: orderQueryKeys.detail(orderId),
	queryFn: () => fetchOrderById(orderId),
	enabled: !!orderId,
	// staleTime: Infinity, // Example: Cache forever until invalidated
});
