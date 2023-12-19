import Navbar from "@/components/landing/navbar";
import React from "react";

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div className='frame'>
        <div className='overlap-wrapper'>
          <div className='overlap'>
            <div className='overlap-group'>
              <img className='vector' src='vector.png' alt='Vector Image' />
              <img className='bg' src='banner.jpg' alt='Background Image' />

              <p className='central-i-santa-rosa'>
                Central I Santa Rosa <br />
                Elementary School
              </p>
            </div>
            <img className='CENTRAL-removebg' src='logo.png' alt='Central Logo' />

            <div className='name-info'>
              <p>Buerano, Jester</p>
              <p>Casteñeda, Justine</p>
              <p>Cruz, Lesley</p>
              <p>Delas Alas, Chloie</p>
              <p>Napari, John Marc</p>
              <p>Rico, John Oswald</p>
            </div>

            <div className='contact-info'>
              <p>sres_central1@yahoo.com | 508-1492</p>
              <p>Rizal Blvd, Brgy. Malusak, City of Santa Rosa, Laguna</p>
              <p>HACIENDA DOMINICADO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
