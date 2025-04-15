import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  onModuleInit() {
    const serviceAccount = require(
      path.resolve(
        __dirname,
        '../../twitter-clone-3e975-firebase-adminsdk-fbsvc-d88eee4217.json',
      ),
    );
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  get messaging() {
    return admin.messaging();
  }
}
