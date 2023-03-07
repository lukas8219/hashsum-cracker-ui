import { Request, Response } from "express";
import HashSumCrackStartCommand from "../../../utils/commands/hashsum.crack.start.command.js";

export class HashSumController {
  constructor() {
    this.createCrackCommand = this.createCrackCommand.bind(this);
  }

  async createCrackCommand(req: Request, res: Response) {
    const { maxLength, searchHash } = req.body;
    await new HashSumCrackStartCommand(maxLength, searchHash).dispatch();
    res.json({ maxLength, searchHash });
  }
}
