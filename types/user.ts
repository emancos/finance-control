export interface User {
    id: string
    name: string
    email: string
    password: string
    profileImage?: string
    createdAt: number
    updatedAt: number
}

export interface UserProfile {
    id: string
    name: string
    email: string
    profileImage?: string
    createdAt: number
    updatedAt: number
}
  