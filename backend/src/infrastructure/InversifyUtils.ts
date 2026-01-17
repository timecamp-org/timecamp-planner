import { interfaces } from 'inversify'
import ServiceIdentifier = interfaces.ServiceIdentifier
import Request = interfaces.Request

export function injectedIntoService<T>(
  serviceIdentifier: ServiceIdentifier<T>,
  anyAncestor: boolean = false
) : (Request) => boolean {
  return (r: Request) => {
    let ancestorRequest : Request | null = r.parentRequest;

    do {

      if (ancestorRequest.serviceIdentifier === serviceIdentifier) {
        return true;
      }

      ancestorRequest = ancestorRequest.parentRequest;
    } while(anyAncestor && ancestorRequest !== null);

    return false;
  }
}
