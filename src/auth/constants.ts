import * as path from 'path';
import { ConfigService } from '../config/config.service';

const env = process.env.NODE_ENV || 'development';
const p = path.join(process.cwd(), `${env}.env`);

const configService = new ConfigService(p);

export const jwtConstants = {
  secret: configService.getString('JWT_SECRET'),
};
