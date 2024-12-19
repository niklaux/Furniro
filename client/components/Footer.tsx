import React from "react";
import SectionContainer from "./SectionContainer";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <SectionContainer>
      <div className="grid grid-col-span-1 md:grid-cols-6">
        <div className="col-span-3">
          <Image
            src="/assets/Furniro_Logo.svg"
            className="h-8"
            alt="Furniro Logo"
            width={32} // Specify width for Image component
            height={32} // Specify height for Image component
          />
          <p className="text-gray-500">
            Join our newsletter to stay up to date on features and releases.
          </p>
          <div className="my-3">
            <input type="text" placeholder="Enter your email" />
            <button className="px-3 py-2 border border-gray-500 rounded-full mx-2">
              Subscribe
            </button>
          </div>
          <div>
            <small className="text-gray-500">
              By subscribing you agree to with our Privacy Policy and provide
              consent to receive updates from our company.
            </small>
          </div>
        </div>

        {/* About Us */}
        <div className="">
          <h1 className="font-bold">About Us</h1>
          <div className="flex flex-col">
            <Link className="text-gray-500" href="/">
              FAQ
            </Link>
            <Link className="text-gray-500" href="/">
              Contact
            </Link>
            <Link className="text-gray-500" href="/">
              Returns
            </Link>
            <Link className="text-gray-500" href="/">
              Blog
            </Link>
            <Link className="text-gray-500" href="/">
              Shipping
            </Link>
          </div>
        </div>

        {/* Customer Support */}
        <div className="">
          <h1 className="font-bold">Customer Support</h1>
          <div className="flex flex-col">
            <Link className="text-gray-500" href="/">
              Affiliates
            </Link>
            <Link className="text-gray-500" href="/">
              Apple Pay Payments
            </Link>
            <Link className="text-gray-500" href="/">
              Returns
            </Link>
            <Link className="text-gray-500" href="/">
              Return Policy
            </Link>
          </div>
        </div>

        {/* Follow Us */}
        <div className="">
          <h1 className="font-bold">Follow Us</h1>
          <div className="flex flex-col">
            <Link className="text-gray-500" href="/">
              Facebook
            </Link>
            <Link className="text-gray-500" href="/">
              Instagram
            </Link>
            <Link className="text-gray-500" href="/">
              Twitter
            </Link>
            <Link className="text-gray-500" href="/">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Footer;
