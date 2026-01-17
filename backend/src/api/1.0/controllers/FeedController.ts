import { LoggerInterface } from '../../../infrastructure/logger'
import * as WebSocket from 'ws'
import { Cookie } from '../modules/common/enum'
import { parse } from 'cookie';
import * as http from 'http'
import { IncomingMessage } from 'http'
import { injectable, inject } from 'inversify';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';
import { FeedServiceInterface } from '../modules/feed/interfaces/FeedServiceInterface';
import { FeedModule } from '../modules/feed/FeedModule';
import { AuthenticationServiceInterface } from '../modules/authentication/AuthenticationServiceInterface'
import { AuthenticationModule } from '../modules/authentication/AuthenticationModule'

@injectable()
export class FeedHandler {

  protected authCookieName: string;
  protected logger: LoggerInterface;
  protected service: FeedServiceInterface;
  protected authService: AuthenticationServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(FeedModule.FeedServiceInterface) service: FeedServiceInterface,
    @inject(AuthenticationModule.AuthenticationServiceInterface) authService,
      authCookieName: string = Cookie.AUTH_TOKEN
  ) {
    this.logger = logger;
    this.service = service;
    this.authCookieName = authCookieName;
    this.authService = authService;
  }

  /**
   * Verifies auth info before handshake if finished.
   * Returns 403 if not authorized.
   *
   * @param headers
   * @param {"http".IncomingMessage} request
   */
  public onHeaders(headers, request: IncomingMessage) {
    const userId = this.getAuthenticatedUserId(request);
    if (!userId) {
      headers.splice(0, 100, 'HTTP/1.1 403 Frobidden');
    }
  }

  /**
   * Handles opening of websocket connection.
   * Connection MUST be opened by authenticated user. Otherwise it will be closed.
   *
   * @param {WebSocket} socket
   * @param {"http".IncomingMessage} request
   */
  public onConnection(socket: WebSocket, request: IncomingMessage) {
    this.logger.info('Client connected');
    // This connection should be terminated before. But in case something is wrong -- let's check it again.
    const userId = this.getAuthenticatedUserId(request);
    if (!userId) {
      this.logger.info('Unauthenticated connection attempt');
      socket.close();
      return;
    }
    this.service.registerUserSocket(userId, socket);
  }

  /**
   * @param {"http".IncomingMessage} request
   * @return {string}
   */
  private getAuthCookie(request: http.IncomingMessage): string {
    const cookies = parse(request.headers.cookie || '');

    if (!cookies[this.authCookieName]) {
      return null;
    }

    return cookies[this.authCookieName];
  }

  private getAuthenticatedUserId(request: IncomingMessage) {
    const authCookie = this.getAuthCookie(request);
    if (!authCookie) {
      return null;
    }
    const authResult = this.authService.getAuthResultFromToken(authCookie);
    if (!authResult.isAuthenticated) {
      return null;
    }

    return authResult.userId;
  }
}
