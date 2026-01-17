import { injectable } from 'inversify'
import { JsonSerializerInterface } from './JsonSerializerInterface';

@injectable()
export class  JsonSerializer implements JsonSerializerInterface {
  fromJson(json: string): any {
    return JSON.parse(json);
  }

  toJson(value: any): string {
    return JSON.stringify(value);
  }
  
}
