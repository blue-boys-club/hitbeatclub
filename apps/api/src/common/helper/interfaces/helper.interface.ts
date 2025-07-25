import { ENUM_HELPER_DATE_DIFF, ENUM_HELPER_DATE_FORMAT } from "~/common/helper/constants/helper.enum.constant";

// Helper Encryption
export interface IHelperJwtVerifyOptions {
	audience: string;
	issuer: string;
	subject: string;
	secretKey: string;
	ignoreExpiration?: boolean;
}

export interface IHelperJwtOptions extends Omit<IHelperJwtVerifyOptions, "ignoreExpiration"> {
	expiredIn: number | string;
	notBefore?: number | string;
}

// Helper String
export interface IHelperStringRandomOptions {
	safe?: boolean;
}

export interface IHelperStringCurrencyOptions {
	locale?: string;
}

export interface IHelperStringPasswordOptions {
	length: number;
}

// Helper Date
export interface IHelperDateSetTimeOptions {
	hour?: number;
	minute?: number;
	second?: number;
	millisecond?: number;
}

export interface IHelperDateDiffOptions {
	format?: ENUM_HELPER_DATE_DIFF;
}

export interface IHelperDateCreateOptions {
	startOfDay?: boolean;
}

export interface IHelperDateFormatOptions {
	format?: ENUM_HELPER_DATE_FORMAT | string;
	locale?: string;
}

export interface IHelperDateForwardOptions {
	fromDate?: Date;
}

export type IHelperDateBackwardOptions = IHelperDateForwardOptions;

export interface IHelperDateRoundDownOptions {
	hour: boolean;
	minute: boolean;
	second: boolean;
	millisecond: boolean;
}
