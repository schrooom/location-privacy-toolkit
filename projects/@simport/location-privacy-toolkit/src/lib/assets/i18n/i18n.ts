import { en } from './en'

export interface Translation {
  language: string
  translations: any
}

// put further translations here
export const translations: [Translation] = [en]
