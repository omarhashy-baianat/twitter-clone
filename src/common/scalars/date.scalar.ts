import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<number, Date | undefined> {
  description = 'Date custom scalar type';

  parseValue(value: number): Date {
    return new Date(value);
  }

  serialize(value: Date) {
    return value.getTime();
  }

  parseLiteral(ast: ValueNode): Date | undefined {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value));
    }
  }
}
