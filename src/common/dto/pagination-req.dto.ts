import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional } from 'class-validator';
import { AuthRespDto } from '../../auth/dto/auth-resp.dto';

export class PaginationReqDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsObject()
  @IsOptional()
  user?: AuthRespDto;
}
