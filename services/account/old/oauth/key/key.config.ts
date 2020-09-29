import { registerAs } from "@nestjs/config"

export default registerAs('key', () => ({
  secret: process.env.OAUTH_KEY_SECRET,
}));