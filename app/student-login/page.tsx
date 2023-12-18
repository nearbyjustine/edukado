import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AuthForm } from "@/components/forms/auth-form";
import { Icons } from "@/components/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className='container relative h-screen grid grid-cols-1 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-zinc-900' />
          <div className='relative z-20 flex items-center text-lg font-medium'>
            <Icons.edukado className='w-28 fill-primary' />
          </div>
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;E-dukado LMS is a game-changer! Its intuitive interface and comprehensive features make learning seamless and engaging. A top choice for organizations committed to continuous
                growth and excellence.&rdquo;
              </p>
              <footer className='text-sm'>Chatur Jipitah</footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8 h-96'>
          <Tabs defaultValue='login' className='flex flex-col justify-center'>
            <TabsList className='mx-auto'>
              <TabsTrigger value='login'>Log In</TabsTrigger>
              <TabsTrigger value='sign-up'>Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value='sign-up'>
              <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
                <div className='flex flex-col space-y-2 text-center'>
                  <h1 className='text-2xl font-semibold tracking-tight'>Create an account</h1>
                  <p className='text-sm text-muted-foreground'>Enter your email below to create your account</p>
                </div>
                <AuthForm role='student' auth='sign-up' />
                <p className='px-8 text-center text-sm text-muted-foreground'>
                  By clicking continue, you agree to our{" "}
                  <Link href='/terms' className='underline underline-offset-4 hover:text-primary'>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href='/privacy' className='underline underline-offset-4 hover:text-primary'>
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </TabsContent>
            <TabsContent value='login'>
              <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
                <div className='flex flex-col space-y-2 text-center'>
                  <h1 className='text-2xl font-semibold tracking-tight'>Login to account</h1>
                  <p className='text-sm text-muted-foreground'>Login to access e-Dukado LMS</p>
                </div>
                <AuthForm role='student' auth='login' />
                <p className='px-8 text-center text-sm text-muted-foreground'>
                  By clicking continue, you agree to our{" "}
                  <Link href='/terms' className='underline underline-offset-4 hover:text-primary'>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href='/privacy' className='underline underline-offset-4 hover:text-primary'>
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
