import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleProfile } from 'src/common/types/google-profile.type';

@Injectable()
export class GoogleAuthService {
  constructor() {}

  async validateGoogleToken(token: string): Promise<GoogleProfile> {
    const userInfo = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!userInfo.ok) {
      throw new UnauthorizedException('invalid token');
    }

    const profile = (await userInfo.json()) as GoogleProfile;

    return profile;
  }
}
