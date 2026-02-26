import { v4 as uuidv4 } from 'uuid'

export function getUserKey(): string {
  if (typeof window === 'undefined') return ''
  
  let userKey = localStorage.getItem('userKey')
  
  if (!userKey) {
    userKey = uuidv4()
    localStorage.setItem('userKey', userKey)
  }
  
  return userKey
}
