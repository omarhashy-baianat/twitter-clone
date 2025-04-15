import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';
import { MessageData } from 'src/common/graphql/objects/message.object';
import { Transactional } from 'typeorm-transactional';
import { SubscribeToNotificationsDto } from './dtos/subscribe-to-notifications.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => MessageData)
  subscribeToNotifications(
    @Args('subscriptionData')
    subscribeToNotificationsDto: SubscribeToNotificationsDto,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.addActiveDevice(
      subscribeToNotificationsDto,
      user,
    );
  }
}
