import Navbar from "@/components/landing/navbar";
import Link from "next/link";
import React from "react";

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div>
        <div className='flex justify-center gap-6'>
          <iframe
            className='w-[30rem] h-[50rem] outline-none'
            src='https://docs.google.com/forms/d/e/1FAIpQLSeo0mHHcT5HwvXQOD45GFnFKOKQahTAOzzR2xS512gb7hjeJg/viewform?embedded=true'
            width='520'
            height='920'
          >
            Loading…
          </iframe>

          <div className='flex flex-col justify-center'>
            <div>
              <p className='font-bold text-primary'>You may also contact us through the following:</p>
              <Link className='text-primary' href='mailto: sres_central1@yahoo.com'>
                sres_central1@yahoo.com | 508-1492
              </Link>
              <p>Rizal Blvd, Brgy. Malusak, City of Santa Rosa, Laguna</p>
            </div>
            <div className='mt-10'>
              <iframe
                className='outline-none'
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.952149186099!2d121.10989647590853!3d14.314212284022467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d9bac45ceb7b%3A0x93d940357c42e5b5!2sSanta%20Rosa%20Elementary%20School%20Central%20I%20HACIENDA%20DOMINICANO!5e0!3m2!1sen!2sph!4v1706164029909!5m2!1sen!2sph'
                width='600'
                height='450'
                allowFullScreen={true}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
