import FeaturedRecipes from "@/component/homepage/FeaturedRecipes";
import HeroSection from "@/component/homepage/HeroSection";
import PopularRecipes from "@/component/homepage/PopularRecipes";
import PremiumCTA from "@/component/homepage/PremiumCTA";
import TopCategories from "@/component/homepage/TopCategories";
import WhyChooseUs from "@/component/homepage/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <HeroSection/>
      <FeaturedRecipes/>
      <PopularRecipes/>
      <TopCategories/>
      <WhyChooseUs/>
      <PremiumCTA/>
    </div>
  );
}
