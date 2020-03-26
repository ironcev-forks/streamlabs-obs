import Vue from 'vue';
import { StatefulService, mutation, ViewHandler } from 'services/core/stateful-service';
import { UserService } from 'services/user';
import { HostsService } from 'services/hosts';
import { Inject } from 'services/core/injector';
import { I18nService, $t } from 'services/i18n';
import { InitAfter } from 'services/core';

// TODO: replace with real data
import { messages } from './STUB_DATA';

export interface IMessage {
  id: string;
  user_id: string;
  chat_id: string;
  content: string;
  username: string;
  avatar: string;
  date_posted?: string;
}

interface IMessagesState {
  messages: Dictionary<Array<IMessage>>;
}

class MessagesViews extends ViewHandler<IMessagesState> {
  messages(chatId: string) {
    if (!this.state.messages[chatId]) return;
    return this.state.messages[chatId];
  }
}

@InitAfter('UserService')
export class MessagesService extends StatefulService<IMessagesState> {
  @Inject() private hostsService: HostsService;
  @Inject() private userService: UserService;
  @Inject() private i18nService: I18nService;

  static initialState: IMessagesState = {
    messages: {},
  };

  @mutation()
  ADD_MESSAGE(chatId: string, message: IMessage) {
    if (!this.state.messages[chatId]) Vue.set(this.state.messages, chatId, []);
    this.state.messages[chatId].push(message);
  }

  @mutation()
  DESTROY_CHAT(chatId: string) {
    Vue.delete(this.state.messages, chatId);
  }

  @mutation()
  LOAD_MESSAGES(messages: Dictionary<Array<IMessage>>) {
    this.state.messages = messages;
  }

  init() {
    this.LOAD_MESSAGES(messages);
  }

  get views() {
    return new MessagesViews(this.state);
  }
}