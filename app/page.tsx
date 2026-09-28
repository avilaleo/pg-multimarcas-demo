import { Hero } from "@/components/home/Hero";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { TrustFacts } from "@/components/home/TrustFacts";
import { SellVehicleTeaser } from "@/components/home/SellVehicleTeaser";
import { ContactLocation } from "@/components/home/ContactLocation";
import { vehicleRepository } from "@/lib/repositories/static-vehicle-repository";

export default async function HomePage() {
  const [brands, featuredVehicles] = await Promise.all([
    vehicleRepository.getBrands(),
    vehicleRepository.getFeaturedVehicles(8),
  ]);

  return (
    <>
      <Hero brands={brands} />
      <TrustFacts />
      <FeaturedVehicles vehicles={featuredVehicles} />
      <SellVehicleTeaser />
      <ContactLocation />
    </>
  );
}
