import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ENUM_HELPER_FILE_EXCEL_TYPE } from 'src/common/helper/constants/helper.enum.constant';
import {
    RESPONSE_FILE_EXCEL_PASSWORD_META_KEY,
    RESPONSE_FILE_EXCEL_TYPE_META_KEY,
    RESPONSE_MESSAGE_PATH_META_KEY,
    RESPONSE_MESSAGE_PROPERTIES_META_KEY,
} from 'src/common/response/constants/response.constant';
import { ResponseInterceptor } from 'src/common/response/interceptors/response.interceptor';
import { ResponseFileExcelInterceptor } from 'src/common/response/interceptors/response.file.interceptor';
import { ResponsePagingInterceptor } from 'src/common/response/interceptors/response.paging.interceptor';
import { IResponseFileExcelOptions } from 'src/common/response/interfaces/response.interface';

export function Response(messagePath: string): MethodDecorator {
    return applyDecorators(
        UseInterceptors(ResponseInterceptor),
        SetMetadata(RESPONSE_MESSAGE_PATH_META_KEY, messagePath)
    );
}

export function ResponseFileExcel(
    options?: IResponseFileExcelOptions
): MethodDecorator {
    return applyDecorators(
        UseInterceptors(ResponseFileExcelInterceptor),
        SetMetadata(
            RESPONSE_FILE_EXCEL_TYPE_META_KEY,
            options?.type ?? ENUM_HELPER_FILE_EXCEL_TYPE.CSV
        ),
        SetMetadata(RESPONSE_FILE_EXCEL_PASSWORD_META_KEY, options?.password)
    );
}

export function ResponsePaging(messagePath: string): MethodDecorator {
    return applyDecorators(UseInterceptors(ResponsePagingInterceptor));
}
