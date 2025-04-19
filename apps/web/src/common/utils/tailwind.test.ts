import { describe, it, expect } from "vitest";
import { cn } from "./tailwind";

describe("twMerge utility", () => {
	describe("spacing", () => {
		it("should merge height classes", () => {
			expect(cn("h-10")).toBe("h-10");
			expect(cn("h-10", "h-20")).toBe("h-20");
			expect(cn("h-10", "h-20", "h-30px")).toBe("h-30px");
		});

		it("should merge leading classes", () => {
			expect(cn("leading-tight")).toBe("leading-tight");
			expect(cn("leading-tight", "leading-normal")).toBe("leading-normal");
			expect(cn("leading-tight", "leading-normal", "leading-30px")).toBe("leading-30px");
			expect(cn("leading-tight", "leading-normal", "leading-30px", "leading-04px")).toBe("leading-04px");
		});

		it("should merge tracking classes", () => {
			expect(cn("tracking-tight")).toBe("tracking-tight");
			expect(cn("tracking-tight", "tracking-normal")).toBe("tracking-normal");
			expect(cn("tracking-tight", "tracking-normal", "tracking-30px")).toBe("tracking-30px");
			expect(cn("tracking-tight", "tracking-normal", "tracking-30px", "tracking-04px")).toBe("tracking-04px");
		});

		it("should merge text width classes", () => {
			expect(cn("text-10")).toBe("text-10");
			expect(cn("text-10", "text-20")).toBe("text-20");
			expect(cn("text-10", "text-20", "text-30px")).toBe("text-30px");
		});

		it("should merge gap classes", () => {
			expect(cn("gap-10")).toBe("gap-10");
			expect(cn("gap-10", "gap-20")).toBe("gap-20");
			expect(cn("gap-10", "gap-20", "gap-30px")).toBe("gap-30px");
		});

		it("should merge margin classes", () => {
			expect(cn("m-10")).toBe("m-10");
			expect(cn("m-10", "m-20")).toBe("m-20");
			expect(cn("m-10", "m-20", "m-30px")).toBe("m-30px");
		});

		it("should merge padding classes", () => {
			expect(cn("p-10")).toBe("p-10");
			expect(cn("p-10", "p-20")).toBe("p-20");
			expect(cn("p-10", "p-20", "p-30px")).toBe("p-30px");
		});

		it("should merge radius classes", () => {
			expect(cn("rounded-xs")).toBe("rounded-xs");
			expect(cn("rounded-xs", "rounded-sm")).toBe("rounded-sm");
			expect(cn("rounded-xs", "rounded-sm", "rounded-30px")).toBe("rounded-30px");
		});
	});

	describe("colors", () => {
		it("should merge color classes", () => {
			expect(cn("text-hbc-blue")).toBe("text-hbc-blue");
			expect(cn("text-hbc-blue", "text-hbc-red")).toBe("text-hbc-red");
			expect(cn("text-hbc-blue", "text-hbc-red", "text-hbc-black")).toBe("text-hbc-black");
		});
	});
});
