import React from 'react';

import NewNavbar from '../commonComponents/NewNavbar';
import HeroSection from './HeroSection';
import WhyXcellifySection from './WhyXcellifySection';
import WhatCanYouSellSection from './WhatCanYouSellSection';
import HowToJoinSection from './HowToJoinSection';
import EarnStripSection from './EarnStripSection';
import FAQSection from './FAQSection';
import TrustedPartnerSection from './TrustedPartnerSection';
import FooterSection from './FooterSection';

const LandingPage = () => {
  return (
    <div>
      <NewNavbar />
      <HeroSection />
      <WhyXcellifySection />
      <WhatCanYouSellSection />
      <HowToJoinSection />
      <EarnStripSection />
      <FAQSection />
      <TrustedPartnerSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
