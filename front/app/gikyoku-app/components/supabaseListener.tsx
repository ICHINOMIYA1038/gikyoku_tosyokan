// components/supabaseListener.tsx
'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Navigation from "./navigation"

const SupabaseListener = ({ initialData }) => {
  const supabase = createClientComponentClient()
  // supabase ロジック

  return (
    <div>
      <Navigation />
      {/* 他のコンポーネント */}
    </div>
  )
}

export default SupabaseListener