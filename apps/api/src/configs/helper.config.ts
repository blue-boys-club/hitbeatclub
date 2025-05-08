import { registerAs } from '@nestjs/config';
import ms from 'ms';

export default registerAs(
  'helper',
  (): Record<string, any> => ({
    salt: {
      length: 8,
    },
  }),
);
