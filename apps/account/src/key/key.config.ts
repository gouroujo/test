import { registerAs } from "@nestjs/config"

export default registerAs('key', () => ({
  secret: process.env.KEY_SECRET || 'secret',
}));