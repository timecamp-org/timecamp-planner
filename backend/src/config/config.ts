import { OAuth1AuthorizedApplication } from '../api/1.0/modules/oauth1/types';
import cronTabConfig from './cron.tab';
import knexConfig from './db.config';
import frontendRoutes from './frontendRoutes.config';

const environment = process.env.NODE_ENV || 'development';
const env = process.env;
const parseNumberList = (value: string | undefined, fallback: number[]) => {
  if (!value) {
    return fallback;
  }

  const result = value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));

  return result.length > 0 ? result : fallback;
};

const fileStorageScheme = env.FILE_STORAGE_SCHEME === 'https' ? 'https' : 'http';
const fileStorageUsePathStyleEndpoint = env.FILE_STORAGE_USE_PATH_STYLE
  ? env.FILE_STORAGE_USE_PATH_STYLE === 'true'
  : true;
const db = knexConfig[environment];

export default {
  baseUrl: 'http://localhost.timecamp.com:3000',
  debugMode: environment === 'development',
  frontendRoutes,
  db,
  cron: {
    tab: cronTabConfig,
  },
  permissions: {
    isEnabled: true,
  },
  rateLimiter: {
    isEnabled: true,
  },
  log: {
    filter: ['error', 'warn', 'info', 'debug'],
  },
  jwt: {
    issuer: 'dev',
    defaultTtl: 3600 * 24 * 365,
    algorithm: 'HS256',
    secret: env.JWT_SECRET || '',
  },
  openId: {
    providers: {},
    issuers: {},
  },
  apple: {
    mobileAppId: 'com.heyspacemobile',
  },
  amazon: {
    s3: {
      endpoint: env.FILE_STORAGE_ENDPOINT || 'minio:9000',
      region: env.FILE_STORAGE_REGION || 'us-east-1',
      bucket: env.FILE_STORAGE_BUCKET || 'planner-files',
      requestExpiryTime: env.FILE_STORAGE_REQUEST_EXPIRY ? Number(env.FILE_STORAGE_REQUEST_EXPIRY) : 180,
      acceptableResizeSizes: parseNumberList(env.FILE_STORAGE_ACCEPTABLE_RESIZE_SIZES, [20, 95, 360]),
      accessKeyId: env.FILE_STORAGE_ACCESS_KEY_ID || '',
      secretAccessKey: env.FILE_STORAGE_SECRET_ACCESS_KEY || '',
      scheme: fileStorageScheme,
      usePathStyleEndpoint: fileStorageUsePathStyleEndpoint,
    },
  },
  mailing: {
    primary: {
      host: env.MAIL_HOST || 'mailpit',
      port: env.MAIL_PORT ? Number(env.MAIL_PORT) : 1025,
      tls: env.MAIL_USE_TLS === 'true',
      auth: {
        user: env.MAIL_USER || '',
        pass: env.MAIL_PASSWORD || '',
      },
    },
    fallback: {
      host: env.MAIL_HOST || 'mailpit',
      port: env.MAIL_PORT ? Number(env.MAIL_PORT) : 1025,
      tls: env.MAIL_USE_TLS === 'true',
      auth: {
        user: env.MAIL_USER || '',
        pass: env.MAIL_PASSWORD || '',
      },
    },
  },
  analytics: {
    tokens: {
      amplitude: env.AMPLITUDE_TOKEN || '',
    },
    storeLogShipment: false,
  },
  sentry: {
    isEnabled: false,
    dsn: '',
  },
  scraper: {
    maxHtmlBodyLength: 3000000,
    isScraperEnabled: true,
    requestTimeout: 5000,
  },
  cache: {
    cachedValueExpirationTime: 24 * 60 * 60 * 1000,
  },
  pushNotifications: {
    ntfy: {
      baseUrl: process.env.NTFY_BASE_URL || 'http://localhost:8080',
      topicPrefix: process.env.NTFY_TOPIC_PREFIX || 'heyspace-',
    },
  },
  oauth1: {
    [OAuth1AuthorizedApplication.TRELLO]: {
      requestURL: 'https://trello.com/1/OAuthGetRequestToken',
      accessURL: 'https://trello.com/1/OAuthGetAccessToken',
      authorizeURL: 'https://trello.com/1/OAuthAuthorizeToken',
      urlToRedirectAfterAuthorization: 'http://localhost:3000/trello2',
    },
  },
  colors: {
    tags: [
      '#7FC241',
      '#00D4A0',
      '#FF8C94',
      '#FF693B',
      '#FBCB53',
      '#47C6D8',
      '#635F63',
      '#47B9EA',
      '#838CFF',
      '#FF8900',
    ],
    projects: ['#1584fc', '#57bec7', '#f8c233', '#e94149', '#f79dd0', '#67b868', '#5ccff5', '#7850fc', '#e9579e'],
  },
  messageQueue: {
    amqp: {
      hostname: 'rabbitmq',
      username: env.RABBITMQ_USERNAME || '',
      password: env.RABBITMQ_PASSWORD || '',
    },
  },
  redis: {
    port: env.REDIS_PORT ? Number(env.REDIS_PORT) : 6379,
    host: env.REDIS_HOST || '127.0.0.1',
    username: env.REDIS_USERNAME || 'default',
    password: env.REDIS_PASSWORD || '',
    db: 0,
  },
};
