import React, { useEffect, useState } from "react";
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
    {title: 'About us', image: Image1, direction: 'ltr', content : ["Xcellify began as a humble yet powerful dream– to create a world where education, growth, and opportunities are accessible to all. This dream was built on the idea of democratising access to quality resources so that students from every corner of the country are empowered to thrive academically, professionally, and personally.", "Xcellify isn’t just a platform—it’s a trusted partner in every student’s journey. By bridging the gap between resources, guidance, and opportunities, we’re building a comprehensive ecosystem designed to meet the diverse needs of students."]},
    {title: 'What We Represent', image: Image2, direction: 'rtl', content: ["We believe every student has the potential to achieve extraordinary things.", "Our name, a blend of “Excel” and “Amplify,” reflects our commitment to helping students discover their true potential, learn with purpose, and excel in life with confidence." ,"The “X” in our logo symbolizes the limitless possibilities within each person—possibilities we strive to unlock through innovation, guidance, and community."]},
    {title: 'Our Mission and Vision', image: Image3, direction: 'ltr', subHeadings: ["Mission", "Vision"], content: ["To be the preferred marketplace for students, meeting all their needs and enabling them to achieve their full potential by nurturing excellence.", "We strive to empower students through innovative platforms providing the best, curated resources in a convenient and cost-effective manner to help them excel in everything they do."]}
] 

let foundersInfo = [
    {name: 'Dipka Sahoo', image: DipakImg, direction: 'ltr', content: "He is an accomplished leader with more than 27 years of extensive experience driving technology, transformation and innovation in multiple global organisations across international markets. Dipak has held board positions in innovative digital ventures and leadership roles in global innovation boards and has also mentored creative startups across the Asia Pacific. He brings a visionary approach to creating innovative and scalable customer-centric solutions at Xcellify."},
    {name: 'Amit Prasad', image: AmitImg, direction: 'rtl', content: "With 25 years of experience across education, IT, insurance, and media, Amit is an IIM alumni and a dynamic leader who has played a pivotal role in shaping academic and corporate landscapes. From establishing an Indian university to collaborating with global institutions like Monash and the London School of Economics, his work exemplifies excellence in education and innovation. Mr. Prasad’s diverse expertise ensures that Xcellify bridges the gap between student aspirations and industry opportunities."},
    {name: 'Pratipta Sahoo', image: PradiptaImg, direction: 'ltr', content: "With over 30 years of experience spanning the insurance, retail, and financial services sectors, Pradipta has helped build successful businesses during the startup phase and held leadership roles in large organisations. He actively mentors & drives change management at startups and SME organisations as well as guides organisations at the Board level. With a Masters in Personnel Management & Law graduate, he has been passionately engaged with premier educational institutions and industry forums in knowledge sharing. His strategic insights into the student community fuel Xcellify’s drive for operational excellence. "}
]

let magicObj = [
    {image: Mimg, content: "A one-stop destination for diverse, high-quality products and services tailored to every student’s educational and lifestyle needs."},
    {image: Aimg, content: "An inclusive platform that provides equal access to high-quality curated resources, fostering equity & empowerment in education."},
    {image: Gimg, content: "We empower students to shape brighter futures through an educational transformation that transcends borders."},
    {image: Iimg, content: "We constantly leverage AI, analytics, and cutting-edge technologies to adapt and deliver exceptional outcomes for students and educators alike."},
    {image: Cimg, content: "We nurture a vibrant community where students can find guidance, collaboration, and support for academic, career, and personal growth."}
]


const AboutusPage = () => {
  return(
    <div className="max-w-7xl mx-auto pt-5 font-dmsans">
        <div>
            <a href="https://www.xcellify.com">
                <img src={LogoPrimary} alt="Logo" className="w-24"/>
            </a>
        </div>
        <div className="my-20 space-y-28 ">
            {imagesWithTextsObjs.map(item => (
                <ImageWithTextbox 
                    key={item.title}
                    direction={item.direction}
                    title={item.title} 
                    img={item.image}
                    content={item.content}
                    subHeadings={item?.subHeadings || []}
                /> 
            ))}
        </div>
        <div className="mt-32">
            <h1 className="text-purple-primary text-5xl ps-10 font-semibold">Meet Our Founders</h1>
            <div className="my-20 space-y-10">
                {foundersInfo.map(item => (
                    <FoundersInfo 
                        key={item.name}
                        image={item.image}
                        name={item.name}
                        direction={item.direction}
                        content={item.content}
                    />
                ))}
            </div>
        </div>

        <div className="my-32">
            <h1 className="text-purple-primary text-4xl text-center font-semibold">Powered by MAGIC: Our Values in Action</h1>
            <div className="my-20 max-w-screen-xl px-20 mx-auto space-y-6">
                {magicObj.map(item => (
                    <MagicLetters 
                        image={item.image}
                        content={item.content}
                    />
                ))}
            </div>
        </div>

        <div className="mt-32 arrows-bg">
            <h1 className="text-purple-primary font-semibold text-6xl mb-20">Why Xcellify?</h1>
            <WhyXcellify 
                arrowImage={ThreeArraowsImg}
                peopleImage={PeopleBg}
            />
        </div>
        
    </div>
  )
};

export default AboutusPage;
