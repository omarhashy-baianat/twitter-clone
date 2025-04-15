import { BadRequestException } from '@nestjs/common';

export function getSkip(page: number, total: number, limit: number = 1): number {
  if (limit <= 0) throw new BadRequestException('page must be greater than 0');
  const maxPage = Math.ceil(total / limit);
  if (page > maxPage)
    throw new BadRequestException(
      `page must be less than or equal ${maxPage}`,
    );
  const skip = (page - 1) * limit;

  return skip;
}
