import React from "react";
import LMS from "@/public/edukado-dashboard.png";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/landing/navbar";
const AboutPage = () => {
  return (
    <div className='h-screen'>
      <Navbar />
      <section className='pt-[10rem] sm:pt-16 h-full'>
        {/* <div className='heading'>
          <h1>About Us</h1>
        </div> */}
        <div className='container items-center flex flex-col lg:flex-row'>
          <div className='flex-1'>
            <Image className='min-w-[5rem] w-[20rem] md:w-screen max-w-[35rem] shadow-xl' alt='uwu' src={LMS} />
          </div>
          <div className='p-4 flex flex-col gap-2 justify-center'>
            <h2 className='text-primary font-bold text-2xl'>E-dukado LMS</h2>
            <p>
              Introducing "E-dukado", the innovative Learning Management System tailored exclusively for{" "}
              <Link className='text-primary' href='https://www.facebook.com/DepEdTayoSantaRosaESCentral1Calabarzon'>
                Santa Rosa Elementary School Central 1
              </Link>
              . Designed with a commitment to advancing education in the digital age, E-dukado seamlessly integrates cutting-edge technology with a user-friendly interface, providing an engaging and
              efficient platform for both educators and students.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
