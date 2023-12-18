import Image from "next/image";
import Link from "next/link";
import LandingImage from "@/assets/landing.jpg";
import Logo from "@/assets/logo.svg";
import CentralI from "@/public/landing_page_transparent.png";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/landing/navbar";

export default async function Index() {
  return (
    <div>
      <Navbar />
      <div>
        <div className='absolute top-48 left-0 md:left-24 flex flex-col px-4'>
          <h1 className='text-3xl md:text-[5rem] mb-6 font-black text-yellow-500'>e-Dukado LMS</h1>
          <div className='text-green-500 text-md md:text-2xl'>
            <p>A Learning Management System developed for</p>
            <p>Santa Rosa Elementary School Central I</p>
          </div>
        </div>
        <div className='absolute bottom-0 -z-10'>
          <Image src={CentralI} alt='school' />
        </div>
      </div>
    </div>
  );
}
