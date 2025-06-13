import { Injectable } from "@nestjs/common";
import { IFileReadOptions, IFileRows } from "../interfaces/file.interface";
import { utils, read, write } from "xlsx";
import { ENUM_HELPER_FILE_EXCEL_TYPE } from "~/common/helper/constants/helper.enum.constant";

@Injectable()
export class FileService {
	constructor() {}

	readCsv(file: Buffer): IFileRows {
		// workbook
		const workbook = read(file, {
			type: "buffer",
		});

		// worksheet
		const worksheetsName: string = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[worksheetsName];
		const rows: Record<string, string | number | Date>[] = utils.sheet_to_json(worksheet);

		return {
			data: rows,
			sheetName: worksheetsName,
		};
	}

	readExcel(file: Buffer, options?: IFileReadOptions): IFileRows[] {
		// workbook
		const workbook = read(file, {
			type: "buffer",
			password: options?.password,
		});

		// worksheet
		const worksheetsName: string[] = workbook.SheetNames;
		const sheets: IFileRows[] = [];

		for (let i = 0; i < worksheetsName.length; i++) {
			const worksheet = workbook.Sheets[worksheetsName[i]];

			// rows
			const rows: Record<string, string | number | Date>[] = utils.sheet_to_json(worksheet);

			sheets.push({
				data: rows,
				sheetName: worksheetsName[i],
			});
		}

		return sheets;
	}

	writeCsv<T = any>(rows: IFileRows<T>): Buffer {
		const worksheet = utils.json_to_sheet(rows.data);
		const csv = utils.sheet_to_csv(worksheet, { FS: ";" });

		// create buffer
		const buff: Buffer = Buffer.from(csv, "utf8");

		return buff;
	}

	writeExcel<T = any>(rows: IFileRows<T>[], options?: IFileReadOptions): Buffer {
		// workbook
		const workbook = utils.book_new();

		for (const [index, row] of rows.entries()) {
			// worksheet
			const worksheet = utils.json_to_sheet(row.data);
			utils.book_append_sheet(workbook, worksheet, row.sheetName ?? `Sheet${index + 1}`);
		}

		// create buffer
		const buff: Buffer = write(workbook, {
			type: "buffer",
			bookType: ENUM_HELPER_FILE_EXCEL_TYPE.XLSX,
			password: options?.password,
		});

		return buff;
	}
}
