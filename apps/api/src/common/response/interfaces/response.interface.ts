import { HttpStatus } from "@nestjs/common";
import { IFileRows } from "src/common/file/interfaces/file.interface";
import { ENUM_HELPER_FILE_EXCEL_TYPE } from "src/common/helper/constants/helper.enum.constant";

export interface IResponseCustomProperty {
	statusCode?: number;
	message?: string;
	httpStatus?: HttpStatus;
}

// metadata
export interface IResponseMetadata {
	customProperty?: IResponseCustomProperty;
	[key: string]: any;
}

export interface IResponseFileExcelOptions {
	type?: ENUM_HELPER_FILE_EXCEL_TYPE;
	password?: string;
}

// response
export interface IResponse<T = void> {
	// _metadata?: IResponseMetadata;
	statusCode?: number;
	message?: string;
	data?: T;
}

export interface IResponsePagination<T> {
	_metadata?: IResponseMetadata;
	_pagination: IResponsePagingPagination;
	data: T[] | T;
}

// response pagination
export interface IResponsePagingPagination {
	totalPage: number;
	total: number;
}

export interface IResponsePaging<T> {
	statusCode: number;
	message: string;
	_metadata?: IResponseMetadata;
	_pagination: IResponsePagingPagination;
	data: T[] | T;
}

export interface IResponseFileExcel {
	data: IFileRows[];
}
