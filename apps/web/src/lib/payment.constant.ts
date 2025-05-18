const environment = process.env.NODE_ENV as "development" | "production";

export const PORTONE_STORE_ID = "store-c9824a41-6612-4e07-863c-07a9f0cc0ee4";

export const PORTONE_CHANNEL_KEY_MAP = {
	development: {
		PAYPAL: "channel-key-9322e092-e9a0-4a8d-bf12-c349b5db5c23",
		PAYMENT: "channel-key-f9e94e27-c30e-4134-88e7-a7beaae591d4",
		CARD_RECURRING: "channel-key-dd409e47-d49f-459a-b379-ae1442531c6a",
		EASY_PAY_TOSS_PAY: "channel-key-2c89103f-6334-4da5-87dd-fc56360945b7",
	},
	production: {
		// TODO: 프로덕션 채널키 설정
		PAYPAL: "channel-key-9322e092-e9a0-4a8d-bf12-c349b5db5c23",
		PAYMENT: "channel-key-f9e94e27-c30e-4134-88e7-a7beaae591d4",
		CARD_RECURRING: "channel-key-dd409e47-d49f-459a-b379-ae1442531c6a",
		EASY_PAY_TOSS_PAY: "channel-key-3b37819a-1c72-4deb-a245-8c810af5403d",
	},
};

export const PORTONE_CHANNEL_KEY = PORTONE_CHANNEL_KEY_MAP[environment];
