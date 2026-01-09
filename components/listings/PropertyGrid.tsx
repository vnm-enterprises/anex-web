import PropertyCard from "./PropertyCard";

export default function PropertyGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <PropertyCard
        title="Modern Annex for Rent"
        location="Nugegoda, Colombo"
        price="LKR 35,000"
        badge="NEW"
        image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6"
      />

      <PropertyCard
        title="Single Room for Ladies"
        location="Kohuwala, Nugegoda"
        price="LKR 18,500"
        badge="VERIFIED"
        image="https://images.unsplash.com/photo-1598928506311-c55ded91a20c"
      />

      <PropertyCard
        title="2 Story House for Rent"
        location="Mirihana, Nugegoda"
        price="LKR 95,000"
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
      />
    </div>
  );
}
