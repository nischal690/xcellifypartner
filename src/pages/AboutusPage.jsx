import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image1 from '../assets/aboutus/steps/image1.png';
import Image2 from '../assets/aboutus/steps/image2.png';
import Image3 from '../assets/aboutus/steps/image3.png';

import DipakImg from '../assets/aboutus/founders/dipak.png';
import AmitImg from '../assets/aboutus/founders/amit.png';
import PradiptaImg from '../assets/aboutus/founders/pradipta.png';

import Mimg from '../assets/aboutus/magic/m.png';
import Aimg from '../assets/aboutus/magic/a.png';
import Gimg from '../assets/aboutus/magic/g.png';
import Iimg from '../assets/aboutus/magic/i.png';
import Cimg from '../assets/aboutus/magic/c.png';

import ThreeArraowsImg from '../assets/aboutus/bottomSection/threeArrows.png';
import PeopleBg from '../assets/aboutus/bottomSection/peopleBg.png';

import LogoPrimary from "../assets/logo-primary.png";

import ImageWithTextbox from "../components/aboutus/ImageWithTextbox";
import FoundersInfo from "../components/aboutus/FoundersInfo";
import MagicLetters from "../components/aboutus/MagicLetters";
import WhyXcellify from "../components/aboutus/WhyXcellify";

let imagesWithTextsObjs = [
    {title: 'About us', image: Image1, direction: 'ltr', content : ["Xcellify began as a humble yet powerful dream– to create a world where education, growth, and opportunities are accessible to all. This dream was built on the idea of democratising access to quality resources so that students from every corner of the country are empowered to thrive academically, professionally, and personally.", "Xcellify isn't just a platform—it's a trusted partner in every student's journey. By bridging the gap between resources, guidance, and opportunities, we're building a comprehensive ecosystem designed to meet the diverse needs of students."]},
    {title: 'What We Represent', image: Image2, direction: 'rtl', content: ["We believe every student has the potential to achieve extraordinary things.", "Our name, a blend of "Excel" and "Amplify," reflects our commitment to helping students discover their true potential, learn with purpose, and excel in life with confidence." ,"The "X" in our logo symbolizes the limitless possibilities within each person—possibilities we strive to unlock through innovation, guidance, and community."]},
    {title: 'Our Mission and Vision', image: Image3, direction: 'ltr', subHeadings: ["Mission", "Vision"], content: ["To be the preferred marketplace for students, meeting all their needs and enabling them to achieve their full potential by nurturing excellence.", "We strive to empower students through innovative platforms providing the best, curated resources in a convenient and cost-effective manner to help them excel in everything they do."]}
] 

let foundersInfo = [
    {name: 'Dipka Sahoo', image: DipakImg, direction: 'ltr', content: "He is an accomplished leader with more than 27 years of extensive experience driving technology, transformation and innovation in multiple global organisations across international markets. Dipak has held board positions in innovative digital ventures and leadership roles in global innovation boards and has also mentored creative startups across the Asia Pacific. He brings a visionary approach to creating innovative and scalable customer-centric solutions at Xcellify."},
    {name: 'Amit Prasad', image: AmitImg, direction: 'rtl', content: "With 25 years of experience across education, IT, insurance, and media, Amit is an IIM alumni and a dynamic leader who has played a pivotal role in shaping academic and corporate landscapes. From establishing an Indian university to collaborating with global institutions like Monash and the London School of Economics, his work exemplifies excellence in education and innovation. Mr. Prasad's diverse expertise ensures that Xcellify bridges the gap between student aspirations and industry opportunities."},
    {name: 'Pratipta Sahoo', image: PradiptaImg, direction: 'ltr', content: "With over 30 years of experience spanning the insurance, retail, and financial services sectors, Pradipta has helped build successful businesses during the startup phase and held leadership roles in large organisations. He actively mentors & drives change management at startups and SME organisations as well as guides organisations at the Board level. With a Masters in Personnel Management & Law graduate, he has been passionately engaged with premier educational institutions and industry forums in knowledge sharing. His strategic insights into the student community fuel Xcellify's drive for operational excellence. "}
]

let magicObj = [
    {image: Mimg, content: "A one-stop destination for diverse, high-quality products and services tailored to every student's educational and lifestyle needs."},
    {image: Aimg, content: "An inclusive platform that provides equal access to high-quality curated resources, fostering equity & empowerment in education."},
    {image: Gimg, content: "We empower students to shape brighter futures through an educational transformation that transcends borders."},
    {image: Iimg, content: "We constantly leverage AI, analytics, and cutting-edge technologies to adapt and deliver exceptional outcomes for students and educators alike."},
    {image: Cimg, content: "We nurture a vibrant community where students can find guidance, collaboration, and support for academic, career, and personal growth."}
]

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const AboutusPage = () => {
  return(
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-primary opacity-5 z-0"></div>
        <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center"
          >
            <a href="https://www.xcellify.com" className="transition-transform duration-300 hover:scale-105">
              <img src={LogoPrimary} alt="Logo" className="w-28 md:w-32"/>
            </a>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-purple-primary text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              Contact Us
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mt-20 mb-24"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-primary to-blue-600 bg-clip-text text-transparent">
              Empowering Students
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Building a world where education, growth, and opportunities are accessible to all
            </p>
            <div className="h-1 w-24 bg-purple-primary mx-auto mt-8 rounded-full"></div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Us Sections */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren}
          className="space-y-32 py-16"
        >
          {imagesWithTextsObjs.map((item, index) => (
            <motion.div key={item.title} variants={fadeIn}>
              <ImageWithTextbox 
                direction={item.direction}
                title={item.title} 
                img={item.image}
                content={item.content}
                subHeadings={item?.subHeadings || []}
              /> 
            </motion.div>
          ))}
        </motion.div>

        {/* Founders Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerChildren}
          className="mt-32 py-20 relative"
        >
          <div className="absolute inset-0 bg-purple-50 rounded-3xl -z-10"></div>
          <motion.h1 
            variants={fadeIn}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-primary to-blue-600 bg-clip-text text-transparent text-center mb-16"
          >
            Meet Our Founders
          </motion.h1>
          <div className="space-y-20">
            {foundersInfo.map((item, index) => (
              <motion.div key={item.name} variants={fadeIn}>
                <FoundersInfo 
                  image={item.image}
                  name={item.name}
                  direction={item.direction}
                  content={item.content}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerChildren}
          className="my-32 py-20"
        >
          <motion.h1 
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            <span className="bg-gradient-to-r from-purple-primary to-blue-600 bg-clip-text text-transparent">
              Powered by MAGIC
            </span>
            <span className="block text-2xl md:text-3xl mt-3 text-gray-600 font-normal">Our Values in Action</span>
          </motion.h1>
          <motion.div 
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {magicObj.map((item, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <img src={item.image} alt="Magic letter" className="w-16 h-16 object-contain" />
                  </div>
                  <p className="text-gray-700 text-center">{item.content}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Why Xcellify Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerChildren}
          className="mt-32 mb-20 py-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-50 rounded-3xl -z-10"></div>
          <motion.h1 
            variants={fadeIn}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-primary to-blue-600 bg-clip-text text-transparent text-center mb-16"
          >
            Why Xcellify?
          </motion.h1>
          <WhyXcellify 
            arrowImage={ThreeArraowsImg}
            peopleImage={PeopleBg}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-purple-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src={LogoPrimary} alt="Logo" className="w-32 bg-white p-2 rounded-lg mb-4"/>
              <p className="text-sm">Empowering students to excel and amplify their potential through innovative platforms and resources.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-purple-200 transition-colors">Home</a></li>
                <li><a href="/about-us" className="hover:text-purple-200 transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-purple-200 transition-colors">Contact</a></li>
                <li><a href="/PrivacyPolicy" className="hover:text-purple-200 transition-colors">Privacy Policy</a></li>
                <li><a href="/TermsOfUse" className="hover:text-purple-200 transition-colors">Terms of Use</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </div>
              </div>
              <p className="text-sm">Email: info@xcellify.com</p>
              <p className="text-sm">Phone: +91 1234567890</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white border-opacity-20 text-center">
            <p className="text-sm"> {new Date().getFullYear()} Xcellify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
};

export default AboutusPage;
