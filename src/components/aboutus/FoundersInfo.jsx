import React from "react";

export default function FoundersInfo({ name, image, direction = "ltr", content }) {
  return (
    <div
      className={`flex items-center w-full mx-auto p-6 ${
        direction === "rtl" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Image with Background */}
      <div className=" w-[300px] h-[300px] flex-shrink-0">
        <img
          src={image}
          alt="Founder"
          className="relative w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Text Content */}
      <div className="ml-6">
        <p className="text-3xl font-semibold">{name}</p>
        <p className="text-gray-700 mt-2 text-xl">{content}</p>
      </div>
    </div>
  );
}
