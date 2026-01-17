import { Cookie } from '../modules/common/enum'
import { injectable } from 'inversify';

@injectable()
export class DeauthenticationController {

  async deauthenticateAction(req, res) {
    res.clearCookie(Cookie.AUTH_TOKEN).send()
  }

}
