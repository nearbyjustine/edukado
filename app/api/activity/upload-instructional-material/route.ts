import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const Response = NextResponse;

export async function POST(request: NextRequest): Promise<void | NextResponse> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return Response.json({ error }, { status: 401 });
  }

  const file = await request.formData();
  const instructionalMaterial = file.get("instructional_material") as File;
  const response: any = await supabase.storage.from("instructional_materials").upload(`im_${user.id}_${Date.now()}_${instructionalMaterial.name}`, instructionalMaterial);

  if (response.error) return Response.json({ error }, { status: 401 });
  console.log(response);

  return Response.json({ url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${response.data.fullPath}` }, { status: 200 });
}
