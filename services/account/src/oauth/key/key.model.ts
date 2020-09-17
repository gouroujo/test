import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { Document } from 'dynamoose/dist/Document'

export interface KeyKey {
  id: string;
}

export type KeyDocument = Document & Key
export interface Key extends KeyKey {
  id: string
  active: number
  publicKey: string
  privateKey: string
}

@ObjectType()
export class KeyModel {
  @Field(/* istanbul ignore next */ () => ID)
  id: string;

  @Field()
  createdAt: Date;

}