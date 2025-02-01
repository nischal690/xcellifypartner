import React from "react";

export default function ImageWithTextbox({ title, direction = "ltr", img, content, subHeadings }) {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
        <h1 className={`text-4xl font-bold mb-4 ${direction === "ltr" ? "ps-5" : "pe-5 text-right"} text-purple-primary`}>{title}</h1>
        <div
        className={`flex items-center justify-center  ${
            direction === "rtl" ? "flex-row-reverse" : "flex-row"
        }`}
        >
        {/* Image Container */}
        <div className="relative w-[600px] h-[500px] flex-shrink-0">
            <img
                src={img}
                alt="About Us"
                className="w-full h-full object-cover shadow-lg"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
        </div>

        {/* Text Container */}
        <div className="w-1/2 bg-purple-primary text-white p-6  shadow-lg">
            {content.map((text, index) => (
                <React.Fragment key={index+123}>
                    {subHeadings && <h2 className="text-2xl">{subHeadings[index]}</h2>}
                    
                    <p key={index} className="text-[20px] mb-4">
                        {text}
                    </p>
                </React.Fragment>
            ))}
        </div>
        </div>
    </div>
  );
}
