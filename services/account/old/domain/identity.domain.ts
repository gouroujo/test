export interface Identity {
  type: 'local' | 'facebook'
  credentials: {
    username: string
  }

}