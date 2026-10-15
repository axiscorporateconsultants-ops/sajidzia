import React from 'react';

/**
 * Using the original PNG logos directly as requested without converting to SVG:
 * - /sajidzia.png : Original Sajid Zia & Co. Chartered Accountants logo
 * - /ca.png       : Original The Institute of Chartered Accountants of Pakistan | CA PAKISTAN logo
 */

export const SajidZiaLogo: React.FC<{
  className?: string;
}> = ({ className = 'h-10 sm:h-12 md:h-14' }) => {
  return (
    <img
      src="/sajidzia.png"
      alt="Sajid Zia & Co. Chartered Accountants"
      className={`${className} w-auto object-contain select-none`}
    />
  );
};

export const IcapPakistanLogo: React.FC<{
  className?: string;
}> = ({ className = 'h-10 sm:h-11 md:h-12' }) => {
  return (
    <img
      src="/ca.png"
      alt="The Institute of Chartered Accountants of Pakistan | CA PAKISTAN"
      className={`${className} w-auto object-contain select-none`}
    />
  );
};

// Aliases for seamless imports
export const SzcLetterheadBrand = SajidZiaLogo;
export const IcapLetterheadLogo = IcapPakistanLogo;
export const SzcEmblem = ({ className = 'h-10 w-auto' }: { className?: string }) => (
  <img
    src="/sajidzia.png"
    alt="Sajid Zia & Co."
    className={`${className} object-contain select-none`}
  />
);
