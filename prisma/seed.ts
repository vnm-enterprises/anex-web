import { PlanCode, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const districtNames = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Galle",
  "Kurunegala",
  "Matara",
  "Jaffna",
];

async function main() {
  await prisma.plan.upsert({
    where: { code: PlanCode.FREE },
    update: {},
    create: {
      code: PlanCode.FREE,
      name: "Free",
      monthlyPriceLkr: 0,
      listingLimitMonthly: 3,
      freeBoostsMonthly: 0,
      canFeature: false,
      priorityWeight: 0,
      analyticsLevel: "basic",
    },
  });

  await prisma.plan.upsert({
    where: { code: PlanCode.BASIC },
    update: {},
    create: {
      code: PlanCode.BASIC,
      name: "Basic",
      monthlyPriceLkr: 1900,
      listingLimitMonthly: 5,
      freeBoostsMonthly: 0,
      canFeature: false,
      priorityWeight: 10,
      analyticsLevel: "basic",
    },
  });

  await prisma.plan.upsert({
    where: { code: PlanCode.PRO },
    update: {},
    create: {
      code: PlanCode.PRO,
      name: "Pro",
      monthlyPriceLkr: 4900,
      listingLimitMonthly: 20,
      freeBoostsMonthly: 2,
      canFeature: false,
      priorityWeight: 25,
      analyticsLevel: "pro",
    },
  });

  await prisma.plan.upsert({
    where: { code: PlanCode.BUSINESS },
    update: {},
    create: {
      code: PlanCode.BUSINESS,
      name: "Business",
      monthlyPriceLkr: 9900,
      listingLimitMonthly: null,
      freeBoostsMonthly: 5,
      canFeature: true,
      priorityWeight: 40,
      analyticsLevel: "full",
    },
  });

  for (const districtName of districtNames) {
    const slug = districtName.toLowerCase().replace(/\s+/g, "-");

    const district = await prisma.district.upsert({
      where: { slug },
      update: {},
      create: {
        name: districtName,
        slug,
      },
    });

    await prisma.city.upsert({
      where: {
        districtId_slug: {
          districtId: district.id,
          slug,
        },
      },
      update: {},
      create: {
        districtId: district.id,
        name: districtName,
        slug,
      },
    });
  }

  const amenities = [
    "Wi-Fi",
    "Parking",
    "Attached Bathroom",
    "Air Conditioning",
    "Kitchen",
    "CCTV",
    "Hot Water",
    "Furnished",
  ];

  for (const amenity of amenities) {
    const slug = amenity.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    await prisma.amenity.upsert({
      where: { slug },
      update: {},
      create: { name: amenity, slug },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
