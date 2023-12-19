import Navbar from "@/components/landing/navbar";
import React from "react";

const LearnMore = () => {
  return (
    <div>
      <Navbar />
      <section className='hero'>
        {/* <div className='heading'>
          <h1>Learn More</h1>
        </div> */}
        <div className='container'>
          <div className='hero-content'>
            <h2>Our vision</h2>
            <p>
              Santa Rosa Elementary School Central I aspires to be a beacon of educational excellence, cultivating dynamic learners and future leaders committed to positive societal impact. We
              envision a community where our students thrive academically, socially, and emotionally, contributing to a better world through diversity, inclusivity, and a passion for c ontinuous
              improvement.
            </p>
          </div>
          <div className='hero-image'>
            <img src='c1.jpg' />
          </div>
        </div>
        <div className='heading'></div>
        <div className='container'>
          <div className='hero1-image'>
            <img src='c2.jpg' alt='c2' />
          </div>
          <div className='hero1-content'>
            <h2>Our Mission</h2>
            <p>
              Santa Rosa Elementary School Central I aspires to be a beacon of educational excellence, cultivating dynamic learners and future leaders committed to positive societal impact. We
              envision a community where our students thrive academically, socially, and emotionally, contributing to a better world through diversity, inclusivity, and a passion for c ontinuous
              improvement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;
