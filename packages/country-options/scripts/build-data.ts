import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// world_countries_lists 패키지의 데이터 경로
const DATA_PATH = join(process.cwd(), "node_modules", "world_countries_lists", "data");

interface CountryData {
	id: number;
	alpha2: string;
	alpha3: string;
	name: string;
}

interface SubdivisionData {
	country: string;
	code: string;
	name: string;
	type: string;
	parent: string;
}

interface DropdownOption {
	label: string;
	value: string;
}

// 한국어 국가 데이터 로드
function loadCountriesKo(): CountryData[] {
	const koPath = join(DATA_PATH, "countries", "ko", "countries.json");
	if (!existsSync(koPath)) {
		throw new Error(`Korean countries data not found at ${koPath}`);
	}
	const data = readFileSync(koPath, "utf-8");
	return JSON.parse(data);
}

// 영어 국가 데이터 로드 (한국어가 없는 경우 fallback)
function loadCountriesEn(): CountryData[] {
	const enPath = join(DATA_PATH, "countries", "en", "countries.json");
	if (!existsSync(enPath)) {
		throw new Error(`English countries data not found at ${enPath}`);
	}
	const data = readFileSync(enPath, "utf-8");
	return JSON.parse(data);
}

// subdivision 데이터 로드
function loadSubdivisions(): SubdivisionData[] {
	const subdivisionPath = join(DATA_PATH, "subdivisions", "subdivisions.json");
	if (!existsSync(subdivisionPath)) {
		throw new Error(`Subdivisions data not found at ${subdivisionPath}`);
	}
	const data = readFileSync(subdivisionPath, "utf-8");
	return JSON.parse(data);
}

// 북한 제외 필터
function excludeNorthKorea(countries: CountryData[]): CountryData[] {
	return countries.filter((country) => country.alpha3.toUpperCase() !== "PRK");
}

// 한국 지역 영어명 -> 한국어명 + 짧은 영어명 매핑
const koreanRegionMapping: Record<string, { label: string; value: string }> = {
	// cspell:disable
	"Seoul-teukbyeolsi": { label: "서울특별시", value: "Seoul" },
	"Busan-gwangyeoksi": { label: "부산광역시", value: "Busan" },
	"Daegu-gwangyeoksi": { label: "대구광역시", value: "Daegu" },
	"Incheon-gwangyeoksi": { label: "인천광역시", value: "Incheon" },
	"Gwangju-gwangyeoksi": { label: "광주광역시", value: "Gwangju" },
	"Daejeon-gwangyeoksi": { label: "대전광역시", value: "Daejeon" },
	"Ulsan-gwangyeoksi": { label: "울산광역시", value: "Ulsan" },
	"Sejong-si": { label: "세종특별자치시", value: "Sejong" },
	Sejong: { label: "세종특별자치시", value: "Sejong" },
	"Gyeonggi-do": { label: "경기도", value: "Gyeonggi-do" },
	"Gangwon-do": { label: "강원도", value: "Gangwon-do" },
	"Gangwon-teukbyeoljachido": { label: "강원특별자치도", value: "Gangwon-do" },
	"Chungcheongbuk-do": { label: "충청북도", value: "Chungcheongbuk-do" },
	"Chungcheongnam-do": { label: "충청남도", value: "Chungcheongnam-do" },
	"Jeollabuk-do": { label: "전라북도", value: "Jeollabuk-do" },
	"Jeollanam-do": { label: "전라남도", value: "Jeollanam-do" },
	"Gyeongsangbuk-do": { label: "경상북도", value: "Gyeongsangbuk-do" },
	"Gyeongsangnam-do": { label: "경상남도", value: "Gyeongsangnam-do" },
	"Jeju-teukbyeoljachido": { label: "제주특별자치도", value: "Jeju-do" },
	// cspell:enable
};

// 지역 변환 함수
function transformRegion(name: string, countryCode: string): DropdownOption {
	if (countryCode === "KR") {
		// 한국의 경우 매핑 테이블 사용
		const mapping = koreanRegionMapping[name];
		if (mapping) {
			return mapping;
		}
		// 매핑이 없는 경우 fallback
		return { label: name, value: name.replace(/[^a-zA-Z0-9]/g, "") };
	}

	// 다른 국가의 경우 label을 그대로 value로 사용
	return { label: name, value: name };
}

// 메인 빌드 함수
async function buildData() {
	console.log("Loading country data...");

	const countriesKo = loadCountriesKo();
	const countriesEn = loadCountriesEn();
	const subdivisions = loadSubdivisions();

	// 북한 제외
	const filteredCountriesKo = excludeNorthKorea(countriesKo);
	const filteredCountriesEn = excludeNorthKorea(countriesEn);

	// 영어 데이터를 맵으로 변환 (fallback용)
	const enCountryMap = new Map(filteredCountriesEn.map((country) => [country.alpha3, country]));

	// 국가 옵션 생성 (한국어 우선, 영어 fallback)
	const countryOptions: DropdownOption[] = filteredCountriesKo.map((country) => ({
		label: country.name || enCountryMap.get(country.alpha3)?.name || country.alpha3,
		value: country.alpha3.toUpperCase(),
	}));

	// 국가 코드 타입 생성
	const countryCodes = filteredCountriesKo.map((country) => `"${country.alpha3.toUpperCase()}"`);

	// ISO 3자리 코드를 국가 전체 이름으로 매핑 (한국어)
	const countryCodeToNameMapKo: Record<string, string> = {};
	filteredCountriesKo.forEach((country) => {
		const alpha3Code = country.alpha3.toUpperCase();
		countryCodeToNameMapKo[alpha3Code] = country.name;
	});

	// ISO 3자리 코드를 국가 전체 이름으로 매핑 (영어)
	const countryCodeToNameMapEn: Record<string, string> = {};
	filteredCountriesEn.forEach((country) => {
		const alpha3Code = country.alpha3.toUpperCase();
		countryCodeToNameMapEn[alpha3Code] = country.name;
	});

	// subdivision 데이터 처리
	const regionsByCountry: Record<string, DropdownOption[]> = {};

	subdivisions.forEach((sub) => {
		const countryCode = sub.country.toUpperCase();
		const alpha3Country = filteredCountriesKo.find((c) => c.alpha2.toUpperCase() === countryCode);

		if (alpha3Country && !sub.parent) {
			// parent가 없는 최상위 행정구역만
			const alpha3Code = alpha3Country.alpha3.toUpperCase();

			if (!regionsByCountry[alpha3Code]) {
				regionsByCountry[alpha3Code] = [];
			}

			const regionOption = transformRegion(sub.name, countryCode);
			regionsByCountry[alpha3Code].push(regionOption);
		}
	});

	// Linter disable 코멘트
	const linterDisable = `/* eslint-disable */
/* tslint:disable */
/* prettier-ignore */
// cspell:disable`;

	// 생성된 타입 파일 작성
	const typeContent = `${linterDisable}
// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// Generated at: ${new Date().toISOString()}

export interface DropdownOption {
	label: string;
	value: string;
}

export type CountryCode = ${countryCodes.join(" | ")};

export interface CountryRegion {
	countryCode: CountryCode;
	regions: DropdownOption[];
}`;

	// Tree shaking을 위한 개별 파일 생성

	// 1. 국가 옵션 데이터
	const countryOptionsContent = `${linterDisable}
// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// Generated at: ${new Date().toISOString()}

import type { DropdownOption } from './types';

export const COUNTRY_OPTIONS: DropdownOption[] = ${JSON.stringify(countryOptions, null, 2)} as const;`;

	// 2. 지역 옵션 데이터
	const regionOptionsContent = `${linterDisable}
// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// Generated at: ${new Date().toISOString()}

import type { DropdownOption, CountryCode } from './types';

export const REGION_OPTIONS_BY_COUNTRY: Record<CountryCode, DropdownOption[]> = ${JSON.stringify(regionsByCountry, null, 2)} as any;`;

	// 3. 한국어 국가명 매핑
	const countryNamesKoContent = `${linterDisable}
// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// Generated at: ${new Date().toISOString()}

import type { CountryCode } from './types';

export const COUNTRY_CODE_TO_NAME_MAP_KO: Record<CountryCode, string> = ${JSON.stringify(countryCodeToNameMapKo, null, 2)} as any;`;

	// 4. 영어 국가명 매핑
	const countryNamesEnContent = `${linterDisable}
// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// Generated at: ${new Date().toISOString()}

import type { CountryCode } from './types';

export const COUNTRY_CODE_TO_NAME_MAP_EN: Record<CountryCode, string> = ${JSON.stringify(countryCodeToNameMapEn, null, 2)} as any;`;

	// 5. 지역 관련 유틸리티 함수
	const regionUtilsContent = `${linterDisable}
// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// Generated at: ${new Date().toISOString()}

import type { DropdownOption, CountryCode } from './types';
import { REGION_OPTIONS_BY_COUNTRY } from './region-options';

export const getRegionOptionsByCountry = (countryCode: CountryCode): DropdownOption[] => {
	return REGION_OPTIONS_BY_COUNTRY[countryCode] || [];
};`;

	// 6. 국가명 관련 유틸리티 함수
	const countryUtilsContent = `${linterDisable}
// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// Generated at: ${new Date().toISOString()}

import type { CountryCode } from './types';
import { COUNTRY_CODE_TO_NAME_MAP_KO } from './country-names-ko';
import { COUNTRY_CODE_TO_NAME_MAP_EN } from './country-names-en';

export const getCountryNameByCodeKo = (countryCode: CountryCode): string => {
	return COUNTRY_CODE_TO_NAME_MAP_KO[countryCode] || countryCode;
};

export const getCountryNameByCodeEn = (countryCode: CountryCode): string => {
	return COUNTRY_CODE_TO_NAME_MAP_EN[countryCode] || countryCode;
};

export const getCountryNameByCodeWithLang = (countryCode: CountryCode, lang: 'ko' | 'en' = 'ko'): string => {
	return lang === 'en' 
		? getCountryNameByCodeEn(countryCode) 
		: getCountryNameByCodeKo(countryCode);
};

// 기본값으로 한국어 사용 (하위 호환성)
export const getCountryNameByCode = (countryCode: CountryCode): string => {
	return getCountryNameByCodeKo(countryCode);
};

// 기본값으로 한국어 매핑 export (하위 호환성)
export const COUNTRY_CODE_TO_NAME_MAP = COUNTRY_CODE_TO_NAME_MAP_KO;`;

	// 7. 메인 index 파일 (re-exports)
	const indexContent = `${linterDisable}
// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// Generated at: ${new Date().toISOString()}

// Types
export type { CountryCode, DropdownOption, CountryRegion } from './types';

// Data exports - tree-shakable
export { COUNTRY_OPTIONS } from './country-options';
export { REGION_OPTIONS_BY_COUNTRY } from './region-options';
export { COUNTRY_CODE_TO_NAME_MAP_KO } from './country-names-ko';
export { COUNTRY_CODE_TO_NAME_MAP_EN } from './country-names-en';

// Utility functions - tree-shakable
export { getRegionOptionsByCountry } from './region-utils';
export { 
	getCountryNameByCodeKo,
	getCountryNameByCodeEn, 
	getCountryNameByCodeWithLang,
	getCountryNameByCode,
	COUNTRY_CODE_TO_NAME_MAP
} from './country-utils';

// Legacy re-exports for backward compatibility
export { COUNTRY_CODE_TO_NAME_MAP_KO as COUNTRY_CODE_TO_NAME_MAP_LEGACY } from './country-names-ko';
export { COUNTRY_CODE_TO_NAME_MAP_EN as COUNTRY_CODE_TO_NAME_MAP_EN_LEGACY } from './country-names-en';`;

	// 파일 저장
	const srcDir = join(process.cwd(), "src");
	writeFileSync(join(srcDir, "types.ts"), typeContent);
	writeFileSync(join(srcDir, "country-options.ts"), countryOptionsContent);
	writeFileSync(join(srcDir, "region-options.ts"), regionOptionsContent);
	writeFileSync(join(srcDir, "country-names-ko.ts"), countryNamesKoContent);
	writeFileSync(join(srcDir, "country-names-en.ts"), countryNamesEnContent);
	writeFileSync(join(srcDir, "region-utils.ts"), regionUtilsContent);
	writeFileSync(join(srcDir, "country-utils.ts"), countryUtilsContent);
	writeFileSync(join(srcDir, "index.ts"), indexContent);

	console.log("✅ Country data generated successfully!");
	console.log(`📊 Generated ${countryOptions.length} countries`);
	console.log(`🌍 Generated regions for ${Object.keys(regionsByCountry).length} countries`);
}

// 스크립트 실행
buildData().catch(console.error);
