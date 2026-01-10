'use client';
import { ChevronRight, Grid } from "lucide-react";
import { useState } from "react";
import GalleryModal from "./GalleryModal";

const IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsT9lGc13HXqr__AWJF3SWdX8NafFYolR3z26kNe6n0LKAGT6B4zdwKaFcqLI4nLzy-dL6Q72WpBtAEXm_SctI11cHv_nFoYiCgbudOiiKTo75VwVYxw_QgkfxGDlY6jSirGTHgYEMcN9BgD8gXqLOJDx2aNW0Cr_6cvHKNpr-ComjVaQqJ_GC8UaInyh5mRz5FlLOvEMMb9QMXNaHZoD-gP_r3qON90C-cHpA1HFAQgsHVsPHu9OeHS__TmbMfF9EI3gKlyC0LlM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCgSiiK4hZqM1PcklbAME6j91QQhbkqOVvWGNkKD7JNWvmwruSGH_dLyj2DAmnQu5kM7B6mAIFZzr4AfDOqi550_fwXh7WvhlMr1l2CpXMbbrsuqDKvwMXmeMURA4K6WLmYVeJvfjt7PaPUgYhmR246PCGIA_PnrfCuNCXT9jtbPywYlVuqCumg8sQK4yrFGSdqrkOX9fF5GAG5jeq6DVfpdq-YKz0iY1EukTiy39lFgZEq3HvvbnQYhnhxll24vfI-ac9me3YgVu8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBBPY-MFLVRIJdy2QxiDShjJCV6H3Bn_lk4tyMwzMaD86ziXk1I4WR_ETmCaKMsmT1fJAXFABkqU4tjuYLUgiP9yKOUNrXcRQlPrYAxuSQxz6dYpzIL3lmbUtgAYQ0-BhSFUFcSAqAmgMvgrrP7iKqKz5okfFvC8jn4oDQ_YCMbE3XRsdWELaeERHuh98LgJMMHd6d_H1fTd2t--EbAXQDHzu-0ZCELxXFHjUEimBMSvuS3_JxNV7uIp7BDhplaGgJvkMC8zjYjIsQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD7iUjbc9Khgh_bwfE43zKlDSiPhQ8apCtzqgiQpygwO2kPgVR1l7YmVTIB8H9KwhX6UZh02EGTb0__8yZSfzxXj6a9WuNrOQuvhbxzNb_4EMkIO0h_pMzDSodCh-yE9SgLXuflCWNp-Qy1M6UkeWqiAnvBPwmjI_pFtm-5XxOxft6pMsK4J908ESplTqQURmgiVpwUGy34Qp4q3m8mVPiYKuA16dVqt8mKKYpBt_rSJiOCsnsH8Rb9LTtBRRpjk1nM4eLJ1_VDAc4",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDNdZHvqEIkvY94uqPFekmbMpwXr0mm14rRvI1n9fa2HyvXFWy_lX6y94UicoaEfU36HaElI4uSEBCjnkqGL9eM4z-WiXUBMjL5hsUOsOjxznUv5b8qjUlV3wmcNJsN6m-uNJJAOacJQvR-1T_YDpIMWW61J0-i2pFUiYH5aX8Hc7Tz2KYsoiL9ztEmN_n5SOo8pguprY9XL3TYDUil3qr2-NnljnhFxgBdDJ-E8ri4OwoWQVZ-WGJMGZBj0CnnlRDnwJb24AX4Na4",
];

export default function Gallery() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
          <a href="#" className="hover:text-primary transition-colors">
            Home
          </a>
          <ChevronRight size={14} />
          <a href="#" className="hover:text-primary transition-colors">
            Colombo
          </a>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white font-medium">
            Nugegoda
          </span>
        </nav>
      </div>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:h-[480px] rounded-2xl overflow-hidden relative group">

          {/* Hero Image */}
          <div className="md:col-span-2 md:row-span-2 h-64 md:h-full relative overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsT9lGc13HXqr__AWJF3SWdX8NafFYolR3z26kNe6n0LKAGT6B4zdwKaFcqLI4nLzy-dL6Q72WpBtAEXm_SctI11cHv_nFoYiCgbudOiiKTo75VwVYxw_QgkfxGDlY6jSirGTHgYEMcN9BgD8gXqLOJDx2aNW0Cr_6cvHKNpr-ComjVaQqJ_GC8UaInyh5mRz5FlLOvEMMb9QMXNaHZoD-gP_r3qON90C-cHpA1HFAQgsHVsPHu9OeHS__TmbMfF9EI3gKlyC0LlM')",
              }}
            />
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Right Top */}
          <GalleryImage
            url="https://lh3.googleusercontent.com/aida-public/AB6AXuCgSiiK4hZqM1PcklbAME6j91QQhbkqOVvWGNkKD7JNWvmwruSGH_dLyj2DAmnQu5kM7B6mAIFZzr4AfDOqi550_fwXh7WvhlMr1l2CpXMbbrsuqDKvwMXmeMURA4K6WLmYVeJvfjt7PaPUgYhmR246PCGIA_PnrfCuNCXT9jtbPywYlVuqCumg8sQK4yrFGSdqrkOX9fF5GAG5jeq6DVfpdq-YKz0iY1EukTiy39lFgZEq3HvvbnQYhnhxll24vfI-ac9me3YgVu8"
          />

          <GalleryImage
            url="https://lh3.googleusercontent.com/aida-public/AB6AXuBBPY-MFLVRIJdy2QxiDShjJCV6H3Bn_lk4tyMwzMaD86ziXk1I4WR_ETmCaKMsmT1fJAXFABkqU4tjuYLUgiP9yKOUNrXcRQlPrYAxuSQxz6dYpzIL3lmbUtgAYQ0-BhSFUFcSAqAmgMvgrrP7iKqKz5okfFvC8jn4oDQ_YCMbE3XRsdWELaeERHuh98LgJMMHd6d_H1fTd2t--EbAXQDHzu-0ZCELxXFHjUEimBMSvuS3_JxNV7uIp7BDhplaGgJvkMC8zjYjIsQ"
          />

          {/* Right Bottom */}
          <GalleryImage
            url="https://lh3.googleusercontent.com/aida-public/AB6AXuD7iUjbc9Khgh_bwfE43zKlDSiPhQ8apCtzqgiQpygwO2kPgVR1l7YmVTIB8H9KwhX6UZh02EGTb0__8yZSfzxXj6a9WuNrOQuvhbxzNb_4EMkIO0h_pMzDSodCh-yE9SgLXuflCWNp-Qy1M6UkeWqiAnvBPwmjI_pFtm-5XxOxft6pMsK4J908ESplTqQURmgiVpwUGy34Qp4q3m8mVPiYKuA16dVqt8mKKYpBt_rSJiOCsnsH8Rb9LTtBRRpjk1nM4eLJ1_VDAc4"
          />

          <div className="hidden md:block h-full relative overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNdZHvqEIkvY94uqPFekmbMpwXr0mm14rRvI1n9fa2HyvXFWy_lX6y94UicoaEfU36HaElI4uSEBCjnkqGL9eM4z-WiXUBMjL5hsUOsOjxznUv5b8qjUlV3wmcNJsN6m-uNJJAOacJQvR-1T_YDpIMWW61J0-i2pFUiYH5aX8Hc7Tz2KYsoiL9ztEmN_n5SOo8pguprY9XL3TYDUil3qr2-NnljnhFxgBdDJ-E8ri4OwoWQVZ-WGJMGZBj0CnnlRDnwJb24AX4Na4')",
              }}
            />

            {/* Show All Photos */}
            <button
              onClick={() => setOpen(true)}
              className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur
                         px-4 py-2 rounded-lg shadow-sm text-sm font-medium
                         hover:bg-white transition flex items-center gap-2"
            >
              <Grid size={16} />
              Show all photos
            </button>
          </div>
        </div>
      </section>

       {open && <GalleryModal images={IMAGES} onClose={() => setOpen(false)} />}
    </>
  );
}

/* ---------------------------------- */
/* Reusable Gallery Image              */
/* ---------------------------------- */

function GalleryImage({ url }: { url: string }) {
  return (
    <div className="hidden md:block h-full relative overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url('${url}')` }}
      />
    </div>
  );
}
