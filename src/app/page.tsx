import { FragranceProvider } from "@/components/product/FragranceProvider";
import { HomeStory } from "@/components/sections/HomeStory";

export default function HomePage() {
  return (
    <FragranceProvider>
      <HomeStory />
    </FragranceProvider>
  );
}
