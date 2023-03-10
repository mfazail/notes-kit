export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      codes: {
        Row: {
          content: string
          created_at: string | null
          id: number
          lang: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          lang?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          lang?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
      }
      topics: {
        Row: {
          content: string | null
          created_at: string | null
          draft: boolean
          from: string
          id: number
          subject: string
          title: string
          to: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          draft?: boolean
          from?: string
          id?: number
          subject: string
          title: string
          to?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          draft?: boolean
          from?: string
          id?: number
          subject?: string
          title?: string
          to?: string
          updated_at?: string | null
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
