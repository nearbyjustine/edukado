import Navbar from "@/components/landing/navbar";
import Link from "next/link";
import React from "react";

const Contact = () => {
  return (
    <div className=''>
      <Navbar />
      <div className='pt-24 md:pt-10'>
        <div className='flex flex-col lg:flex-row items-center justify-center gap-2'>
          <div className='flex flex-col gap-4 p-2 h-fit items-center lg:items-start justify-center'>
            <div>
              <p className='font-bold text-primary'>You may also contact us through the following:</p>
              <Link className='text-primary' href='mailto: sres_central1@yahoo.com'>
                sres_central1@yahoo.com | 508-1492
              </Link>
              <p>Rizal Blvd, Brgy. Malusak, City of Santa Rosa, Laguna</p>
            </div>
            <iframe
              className='outline-none w-[20rem] sm:w-[30rem]'
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.952149186099!2d121.10989647590853!3d14.314212284022467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d9bac45ceb7b%3A0x93d940357c42e5b5!2sSanta%20Rosa%20Elementary%20School%20Central%20I%20HACIENDA%20DOMINICANO!5e0!3m2!1sen!2sph!4v1706164029909!5m2!1sen!2sph'
              height='450'
              allowFullScreen={true}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
          </div>
          <iframe
            className='max-h-[30rem] outline-none w-[20rem] sm:w-[50rem]'
            src='https://docs.google.com/forms/d/e/1FAIpQLSeo0mHHcT5HwvXQOD45GFnFKOKQahTAOzzR2xS512gb7hjeJg/viewform?embedded=true'
            height='920'
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
