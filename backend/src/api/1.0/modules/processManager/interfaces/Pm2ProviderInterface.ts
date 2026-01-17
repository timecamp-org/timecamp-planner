
export interface Pm2ProviderInterface {
  getPm2Instance(): PromiseLike<PM2.Manager>;
  getBus(): PromiseLike<PM2.Bus>;
  connect(): PromiseLike<PM2.Manager>;
  disconnect(): PromiseLike<void>;
}
