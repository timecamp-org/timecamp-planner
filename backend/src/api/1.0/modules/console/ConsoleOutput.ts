import { OutputInterface } from './OutputInterface'
import { injectable } from 'inversify'

@injectable()
export class ConsoleOutput implements OutputInterface
{
  print(...params: any[]) {
    params.forEach(process.stdout.write.bind(process.stdout));
  }
}
