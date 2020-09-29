import { IsString, IsNotEmpty, IsIn, IsOptional, IsArray, ArrayUnique, ArrayMinSize, IsUrl } from 'class-validator'
import { Transform } from 'class-transformer'
import { Client } from './client.schema'

export class CreateClientDto implements Client {
  disabled: boolean
  whitelisted: boolean
  secret?: string
  salt?: string
  logo?: string
  image?: string
  createdAt: Date
  updatedAt: Date
  id: string
  
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description: string

  @IsIn(['public', 'confidential'])
  type: 'public' | 'confidential'

  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(1)
  @IsUrl({
    protocols: process.env.NODE_ENV === 'production' ? ['https'] : ['https', 'http'],
    require_valid_protocol: true,
    host_blacklist: process.env.NODE_ENV === 'production' ? ['localhost'] : undefined,
    require_tld: false,
  }, { each: true })
  allowedURI: string[]

}