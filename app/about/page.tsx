import React from "react";
import UWU from "@/public/uwu.png";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/landing/navbar";
const AboutPage = () => {
  return (
    <div>
      <Navbar />
      <section className='hero'>
        {/* <div className='heading'>
          <h1>About Us</h1>
        </div> */}
        <div className='container'>
          <div className='hero-content'>
            <h2>Central 1 City of Sta.Rosa Laguna</h2>
            <p>
              Central I Elementary School, nestled in the heart of Santa Rosa, Laguna, is more than an academic institution; it's a vibrant community dedicated to holistic education. We prioritize not
              only academic excellence but also the development of character, critical thinking, and creativity. Our philosophy centers on recognizing each student's unique potential, fostering a love
              for learning, and equipping them with the skills to navigate a dynamic world.
            </p>

            <Link href='/learn_more' className='button'>
              Click Here
            </Link>
          </div>
          <div className='hero-image'>
            <Image alt='uwu' src={UWU} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
