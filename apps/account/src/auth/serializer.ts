import {PassportSerializer} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";

import {UserService} from "../user/user.service";
import { User } from "src/user/model/user.model";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: (err: Error | null, user: string) => void): void {
    done(null, user.id);
  }

  async deserializeUser(id: string, done: (err: Error | null, payload?: any) => void): Promise<void> {
    const user = await this.userService.findOne({ id })
    done(null, user)
  }
} 