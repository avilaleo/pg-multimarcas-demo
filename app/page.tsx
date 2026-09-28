import { Hero } from "@/components/home/Hero";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { DeliveryCarousel } from "@/components/home/DeliveryCarousel";
import { SellVehicleTeaser } from "@/components/home/SellVehicleTeaser";
import { FinancingTeaser } from "@/components/home/FinancingTeaser";
import { Wayfinding } from "@/components/home/Wayfinding";
import { vehicleRepository } from "@/lib/repositories/static-vehicle-repository";

export default async function HomePage() {
  const [brands, featuredVehicles] = await Promise.all([
    vehicleRepository.getBrands(),
    vehicleRepository.getFeaturedVehicles(8),
  ]);

  return (
    <>
      <Hero brands={brands} />
      <FeaturedVehicles vehicles={featuredVehicles} />
      <DeliveryCarousel />
      <SellVehicleTeaser />
      <FinancingTeaser />
      <Wayfinding />
    </>
  );
}
