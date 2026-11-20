import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Vercel(또는 .env.local)에 아래 두 값을 넣으면 Supabase 로그인이 켜집니다.
// 값이 없으면 null → 브라우저 저장 방식(데모 로그인)으로 동작합니다.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null
