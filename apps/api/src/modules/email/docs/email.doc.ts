import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { EmailSendDto } from 'src/modules/email/dtos/email.send.dto';

export function EmailSendDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: '이메일 전송',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            dto: EmailSendDto,
        }),
        DocResponse('email.send')
    );
}
