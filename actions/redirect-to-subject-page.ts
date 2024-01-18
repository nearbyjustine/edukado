"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const redirectToSubjectPageAction = (subjectId: string) => {
  revalidatePath(`/teacher/subjects/${subjectId}`);
  redirect(`/teacher/subjects/${subjectId}`);
};

export default redirectToSubjectPageAction;
