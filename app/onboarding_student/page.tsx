import { OnboardingForm } from "@/components_student/forms/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className='w-screen h-screen bg-primary flex justify-center items-center'>
      <div className='bg-white min-w-[20rem] w-[24rem] p-12 rounded-2xl'>
        <div className='font-semibold text-2xl'>Basic Info</div>
        <div className='text-md text-gray-500'>Tell us a bit more about yourself</div>
        <OnboardingForm />
      </div>
    </div>
  );
}
