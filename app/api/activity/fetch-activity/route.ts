import { Database } from "@/lib/database.types";
import { createClient } from "@/utils/supabase/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("activities").select().eq("id", params.id).single();

  if (error || !data) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  return NextResponse.json({ activity: data }, { status: 200 });
}
