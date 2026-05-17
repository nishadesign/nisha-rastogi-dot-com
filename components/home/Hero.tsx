import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section className="px-5 tablet:px-10 py-12 tablet:py-20">
      <h1 className="hero-h1">{profile.positioning}</h1>
    </section>
  );
}
