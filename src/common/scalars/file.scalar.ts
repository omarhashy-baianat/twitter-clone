import { Scalar, CustomScalar } from '@nestjs/graphql';

export class File {}
@Scalar('File', () => File)
export class FileScaler implements CustomScalar<null, null> {
  parseValue() {
    return null;
  }

  serialize() {
    return null;
  }

  parseLiteral() {
    return null;
  }
}
