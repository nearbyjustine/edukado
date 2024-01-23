"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const redirectToSubjectPageAction = (subjectId: string) => {
  revalidatePath(`/teacher/subjects/${subjectId}`);
  redirect(`/teacher/subjects/${subjectId}`);
};
export const redirectToSettingsPageActionStudent = () => {
  revalidatePath(`/student/settings`);
  redirect(`/student/settings`);
};

export const redirectToSubjectPageActionStudent = (subjectId: string) => {
  revalidatePath(`/student/subjects/${subjectId}`);
};
