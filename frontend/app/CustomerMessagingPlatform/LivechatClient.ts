import { omitBy } from 'lodash';
import { AbstractCustomerMessagingPlatform } from './AbstractCustomerMessagingPlatform';
import { DataProviderInterface, LivechatDataInterface } from './types';

export class LivechatClient extends AbstractCustomerMessagingPlatform<LivechatDataInterface> {
  constructor(private customerMessagingPlatformApiKey: string, isTrackingEnabled: boolean) {
    super(isTrackingEnabled);

    this.initialize();
  }

  getPayload(data: DataProviderInterface): LivechatDataInterface {
    return {
      user_id: data.currentUserId,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      phone_number: data.phoneNumber,
      created_at: new Date(data.createdAt).toDateString(),
      organization_id: data.organizationId,
      organization_name: data.organizationName,
      organization_size: data.organizationUserCount,
      organization_role: data.organizationRole,
      organization_created_at: new Date(data.organizationCreatedAt).toDateString(),
      plan: data.planName,
      subscription_status: data.subscriptionStatus,
      monthly_spend: data.currentMonthBill,
      extensions_enabled: data.extensionsEnabled,
    };
  }

  hideChatWindow() {
    window.LiveChatWidget.call('hide');
  }

  showChatWindow() {
    window.LiveChatWidget.call('minimize');
  }

  startChat() {
    window.LiveChatWidget.call('maximize');
  }

  sendData(data: LivechatDataInterface) {
    if (!window.LiveChatWidget) {
      return;
    }

    omitBy(data, (prop) => prop === undefined);

    window.LiveChatWidget.call('set_session_variables', data);
  }

  private initialize() {
    if (!window.LiveChatWidget) {
      setTimeout(() => this.initialize(), 4_00);
      return;
    }

    this.hideChatWindow();

    window.LiveChatWidget.on('visibility_changed', ({ visibility }) => {
      if (visibility === 'minimized') {
        setTimeout(() => this.hideChatWindow(), 1_00);
      }
    });
  }
}
