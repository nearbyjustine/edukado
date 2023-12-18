import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const Response = NextResponse;

export async function POST(request: NextRequest): Promise<void | NextResponse> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  console.log(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return Response.json({ error: error }, { status: 401 });
  }

  const file = await request.formData();
  const avatarImage = file.get("avatar_file") as File;

  const response = await supabase.storage.from("avatar").upload(`avatar_${user.id}_${Date.now()}_${avatarImage.name}`, avatarImage);
  if (response.error) {
    return Response.json({ error: response.error }, { status: 401 });
  }
  return Response.json({ url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatar/${response.data.path}` }, { status: 200 });
}
