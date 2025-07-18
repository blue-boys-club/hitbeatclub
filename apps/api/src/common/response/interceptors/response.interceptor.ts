import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Response } from "express";
import { Reflector } from "@nestjs/core";
import { IRequestApp } from "~/common/request/interfaces/request.interface";
import {
	RESPONSE_MESSAGE_PATH_META_KEY,
	RESPONSE_MESSAGE_PROPERTIES_META_KEY,
} from "~/common/response/constants/response.constant";
import { IResponse } from "~/common/response/interfaces/response.interface";
import { ResponseDto, ResponseMetadataDto } from "~/common/response/dtos/response.dto";
import { ConfigService } from "@nestjs/config";
import { HelperDateService } from "~/common/helper/services/helper.date.service";

@Injectable()
export class ResponseInterceptor implements NestInterceptor<Promise<ResponseDto>> {
	constructor(
		private readonly reflector: Reflector,
		private readonly configService: ConfigService,
		private readonly helperDateService: HelperDateService,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<Promise<ResponseDto>> {
		if (context.getType() === "http") {
			return next.handle().pipe(
				map(async (res: Promise<any>) => {
					const ctx: HttpArgumentsHost = context.switchToHttp();
					const response: Response = ctx.getResponse();
					const request: IRequestApp = ctx.getRequest<IRequestApp>();

					let messagePath: string = this.reflector.get<string>(RESPONSE_MESSAGE_PATH_META_KEY, context.getHandler());
					let messageProperties = undefined;

					// set default response
					let httpStatus: HttpStatus = response.statusCode;
					let statusCode: number = response.statusCode;
					let data: Record<string, any> = undefined;

					// metadata
					const xPath = request.path;
					const xLanguage: string = request.__language;
					const xTimestamp = this.helperDateService.createTimestamp();
					const xTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
					const xVersion = request.__version ?? this.configService.get<string>("app.urlVersion.version");
					const xRepoVersion = this.configService.get<string>("app.repoVersion");
					let metadata: ResponseMetadataDto = {
						language: xLanguage,
						timestamp: xTimestamp,
						timezone: xTimezone,
						path: xPath,
						version: xVersion,
						repoVersion: xRepoVersion,
					};

					// response
					const responseData = (await res) as IResponse<any>;

					if (responseData) {
						const { _metadata, ...rest } = responseData as any;

						data = rest;
						httpStatus = _metadata?.customProperty?.httpStatus ?? httpStatus;
						statusCode = _metadata?.customProperty?.statusCode ?? statusCode;
						messagePath = _metadata?.customProperty?.message ?? messagePath;

						delete _metadata?.customProperty;

						metadata = {
							...metadata,
							..._metadata,
						};
					}

					const message: string = "Internal Server Error";

					response.setHeader("x-custom-lang", xLanguage);
					response.setHeader("x-timestamp", xTimestamp);
					response.setHeader("x-timezone", xTimezone);
					response.setHeader("x-version", xVersion);
					response.setHeader("x-repo-version", xRepoVersion);
					response.status(httpStatus);

					return {
						statusCode,
						message,
						// _metadata: metadata,
						data,
					};
				}),
			);
		}

		return next.handle();
	}
}
