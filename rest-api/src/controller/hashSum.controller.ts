import { Request, Response } from "express";
import HashSumCrackStartCommand from "../../../utils/commands/hashsum.crack.start.command.js";
import { Store } from "../../../utils/redis/client.js";

export class HashSumController {
  constructor() {
    this.createCrackCommand = this.createCrackCommand.bind(this);
    this.deleteCrack = this.deleteCrack.bind(this);
  }

  async createCrackCommand(req: Request, res: Response) {
    const { maxLength, searchHash } = req.body;
    await new HashSumCrackStartCommand(maxLength, searchHash).dispatch();
    res.json({ maxLength, searchHash });
  }

  async deleteCrack(req : Request, res : Response){
    const { searchHash } = req.params;
    if(!searchHash) {
      return res.json({ error: 400, message: 'Missing hash'}).end();
    }
    await Store.cancel(searchHash);
    return res.json({ deleted: searchHash }).end();
  }
}
