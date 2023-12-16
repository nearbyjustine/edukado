import { Database } from "@/lib/database.types";
import { createClient } from "@/utils/supabase/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  // SSR
  const supabase = createClient(cookieStore);
  // AUTH HELPER
  // const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
  // const {
  //   data: { user },
  //   error,
  // } = await supabase.auth.getUser();

  // if (error || !user) {
  //  return NextResponse.json({ error: error }, { status: 401 });
  // }

  // const role = user.user_metadata["role"];

  const { data, error } = await supabase.from("profiles").select().eq("id", params.id).single();

  if (error || !data) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  return NextResponse.json({ user: data }, { status: 200 });
}
