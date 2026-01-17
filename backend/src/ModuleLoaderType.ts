import { interfaces } from 'inversify'
import config from './config'

export type AppConfigType = typeof config;

export type ModuleLoaderType = (kernel: interfaces.Container, config: AppConfigType) => void;
