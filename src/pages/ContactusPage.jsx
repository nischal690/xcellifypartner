import { Phone, Mail } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 font-dmsans space-y-10 min-h-screen">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-5xl sm:text-7xl font-bold text-purple-primary text-center">
            Contact us
        </h1>
        <p className="text-2xl text-center text-gray-800 mt-2 text-bold">
            Feel free to contact us
        </p>
      </div>

      {/* Contact Cards */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mt-8 w-full max-w-4xl">
        {/* Partner Contact Card */}
        <div className="flex-1 bg-white balanced-shadow rounded-xl p-6 text-center">
          <h2 className="text-3xl font-semibold text-purple-primary mb-10">
            For Partners
          </h2>
          <div className="flex flex-col gap-3 mt-4 space-y-3">
            <div className="flex items-center gap-2 text-gray-800">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-600 rounded-full">
                <Phone className="text-white w-5 h-5" />
              </div>
              <span>9019033343</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-600 rounded-full">
                <Mail className="text-white w-5 h-5" />
              </div>
              <span>partnercare@xcellify.com</span>
            </div>
          </div>
        </div>

        {/* Customer Contact Card */}
        <div className="flex-1 bg-white balanced-shadow rounded-xl p-6 text-center">
          <h2 className="text-3xl font-semibold text-purple-600 mb-10">
            For Customers
          </h2>
          <div className="flex flex-col gap-3 mt-4 space-y-3">
            <div className="flex items-center gap-2 text-gray-800">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-600 rounded-full">
                <Phone className="text-white w-5 h-5" />
              </div>
              <span>9019033345</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-600 rounded-full">
                <Mail className="text-white w-5 h-5" />
              </div>
              <span>customercare@xcellify.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}