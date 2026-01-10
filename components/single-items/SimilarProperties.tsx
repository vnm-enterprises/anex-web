
import SimilarPropertyCard from "./SimilarPropertyCard";

const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Modern Annex near High Level Road",
    location: "Nugegoda, Colombo",
    price: "Rs. 32,000",
    beds: 1,
    baths: 1,
    area: "500 sqft",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWPk_rKtHoptMcNcXJkc8xBG-x348eO10TrImXIS4QQ9R7LzVSDMKeEnfScoDcTHJ3OWWRWgPtvkKgeXdCQuMU_sc2V4sg2XoIeVrO9tNwx7zcNwL2TiSHPvgLpJmPhrsNWXcLAkGdgYdE_do6z72uw83qajE6Euux0lEXRr7aAWTbyduMcjY3UYPg23SDZqGLVHUnWIh6UvuzBRdGSKnuvOFYwUnrTopOpltmZ-E1rLcm7AyJ3KdKcSeRXF1BzixHevgEt_GQxxI",
  },
  {
    id: 2,
    title: "Single Room for Professionals",
    location: "Kohuwala, Nugegoda",
    price: "Rs. 18,500",
    beds: 1,
    baths: 1,
    area: "350 sqft",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgSiiK4hZqM1PcklbAME6j91QQhbkqOVvWGNkKD7JNWvmwruSGH_dLyj2DAmnQu5kM7B6mAIFZzr4AfDOqi550_fwXh7WvhlMr1l2CpXMbbrsuqDKvwMXmeMURA4K6WLmYVeJvfjt7PaPUgYhmR246PCGIA_PnrfCuNCXT9jtbPywYlVuqCumg8sQK4yrFGSdqrkOX9fF5GAG5jeq6DVfpdq-YKz0iY1EukTiy39lFgZEq3HvvbnQYhnhxll24vfI-ac9me3YgVu8",
  },
  {
    id: 3,
    title: "Small Apartment with Balcony",
    location: "Mirihana, Colombo",
    price: "Rs. 45,000",
    beds: 2,
    baths: 1,
    area: "720 sqft",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-g2yPu5eDMhSkZqUUQWCoj-8RtOosKt6EnLURiEIpcUlw7gh80WUy6F6Sk4pLwtg17Cmay895e-BkxRKi82Mp6YZ_UeOx_Stfa9skjobDPcPuVZy9i0RNFFl9-42570rbW2WcLQeUWo5skpvYZT4fDlOuX6MLic4zV_IwarjG-lDNf_4UfCKft6oOeX13BDskVVYwUySyIxqg8KIe6NIrutGHfF10xIOFtf7CDQ9_4Wn9Wct_oRPM3CINRiC-BfY5QIJq8Ex66Ao",
  },
];


export function SimilarProperties() {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Similar properties you may like
        </h3>

        <button className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_PROPERTIES.map((property) => (
          <SimilarPropertyCard key={property.id} {...property} />
        ))}
      </div>
    </section>
  );
}
