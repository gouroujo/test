export class User {
  id: string
  username: string

  profile: any = {}
  pictures: any[] = []

  active: boolean = true
  role?: string = 'user'
}