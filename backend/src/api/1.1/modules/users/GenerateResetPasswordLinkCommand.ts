import { ConsoleCommandInterface } from '../console/ConsoleCommandInterface'
import { CommandParameters } from '../console/types'
import { OutputInterface } from '../console/OutputInterface'
import { inject, injectable } from 'inversify'
import { UsersModule } from './UsersModule';
import { UserServiceInterface } from './UserServiceInterface';
import { GeneratePasswordResetLinkStatus } from './types';
import ErrorDefinitions, { Type } from '../common/ErrorDefinitions';

@injectable()
export class GenerateResetPasswordLinkCommand implements ConsoleCommandInterface
{
  private userService: UserServiceInterface;

  constructor(
    @inject(UsersModule.UserServiceInterface)
    userService : UserServiceInterface
  ) {
    this.userService = userService;
  }

  async execute(params: CommandParameters, output: OutputInterface): Promise<void> {
    if (params.params.length < 1) {
      throw new Error('Missing email!');
    }
    const email = params.params[0];
    const { url, status } = await this.userService.generatePasswordResetLink(email)

    switch(status) {
      case GeneratePasswordResetLinkStatus.USER_NOT_FOUND:
        throw ErrorDefinitions[Type.USER_NOT_FOUND]
    }

    output.print(url);
  }
}
