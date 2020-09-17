import {PassportSerializer} from "@nestjs/passport"
import {Injectable} from "@nestjs/common"

import {UserService} from "../user/user.service"
import { UserDocument } from "src/user/user.schema"

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private readonly userService: UserService
  ) {
    super()
  }
  
/**
 *
 *
 * @param {UserDocument} user
 * @param {((err: Error | null, user: string) => void)} done
 * @memberof SessionSerializer
 */
serializeUser(user: UserDocument, done: (err: Error | null, user: string) => void): void {
    done(null, user.username);
  }

/**
 *
 *
 * @param {string} username
 * @param {((err: Error | null, payload?: any) => void)} done
 * @returns {Promise<void>}
 * @memberof SessionSerializer
 */
async deserializeUser(username: string, done: (err: Error | null, payload?: any) => void): Promise<void> {
    const user = await this.userService.findByUsername(username)
    done(null, user)
  }
} 