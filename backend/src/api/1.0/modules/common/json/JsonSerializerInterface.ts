export interface JsonSerializerInterface
{
  toJson(obj: any) : string;
  fromJson(json: string) : any;
}
