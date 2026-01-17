import { Request, Response } from "express";


export class VersionController {
  public static versionAction(req: Request, res: Response) {
    res.send('1.0');
  }
}