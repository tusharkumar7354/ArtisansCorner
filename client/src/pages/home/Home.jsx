import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Gift,
  ShieldCheck,
  Users,
  ShoppingBag,
  UserPlus,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const heroImages = Object.values(
  import.meta.glob("../../assets/images/hero_*.{jpg,jpeg,png,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);

const heroContent = [
  {
    eyebrow: "HANDMADE WITH PASSION",
    title: (
      <>
        Discover Unique
        <br />
        Handmade Creations
      </>
    ),
    description:
      "Explore one-of-a-kind products created by talented artisans and independent sellers.",
  },
  {
    eyebrow: "CRAFTED BY ARTISANS",
    title: (
      <>
        Made With
        <br />
        Creativity & Care
      </>
    ),
    description:
      "Find thoughtfully crafted handmade products from independent sellers.",
  },
  {
    eyebrow: "SHOP SOMETHING UNIQUE",
    title: (
      <>
        Bring Handmade
        <br />
        Into Your Life
      </>
    ),
    description:
      "Discover beautiful creations made with skill, creativity and passion.",
  },
];

const Home = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = useMemo(() => {
    return heroImages.map((image, index) => ({
      image,
      ...heroContent[index % heroContent.length],
    }));
  }, []);

  /*
   * Automatic carousel
   * Each image stays visible for 7 seconds.
   */
  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((previousSlide) => {
        return (previousSlide + 1) % slides.length;
      });
    }, 7000);

    return () => {
      clearInterval(interval);
    };
  }, [slides.length]);

  const goToPreviousSlide = () => {
    setCurrentSlide((previousSlide) => {
      return previousSlide === 0 ? slides.length - 1 : previousSlide - 1;
    });
  };

  const goToNextSlide = () => {
    setCurrentSlide((previousSlide) => {
      return (previousSlide + 1) % slides.length;
    });
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="bg-stone-50">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[520px] max-w-7xl overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-sm">
          {/* =================================================
              HERO SLIDES
          ================================================== */}
          {slides.map((slide, index) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            >
              {/* Image */}
              <img
                src={slide.image}
                alt={`Artisan's Corner handmade collection ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#fff8f0]/95 via-[#fff8f0]/60 to-[#fff8f0]/10" />
            </div>
          ))}

          {/* =================================================
              HERO CONTENT
          ================================================== */}
          {currentSlideData && (
            <div className="relative z-20 flex min-h-[520px] w-full items-center">
              <div className="max-w-2xl px-6 py-16 md:px-12 lg:px-16">
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
                  {currentSlideData.eyebrow}
                </p>

                <h1 className="text-5xl font-black leading-[1.05] text-stone-900 lg:text-7xl">
                  {currentSlideData.title}
                </h1>

                <p className="mt-8 max-w-xl text-lg leading-9 text-stone-600 md:text-xl">
                  {currentSlideData.description}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    to="/products"
                    className="inline-flex h-10 items-center justify-center gap-3 rounded-xl border border-amber-700 bg-amber-700 px-7 text-base font-semibold leading-none text-white shadow-sm transition-all duration-300 hover:bg-amber-800 hover:shadow-md"
                  >
                    <ShoppingBag size={18} />
                    Shop Now
                    <ArrowRight size={18} />
                  </Link>

                  {!user?.isSeller && (
                    <Link
                      to="/become-seller"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-7 text-base font-semibold leading-none text-amber-800 shadow-sm transition-all duration-300 hover:border-amber-500 hover:bg-amber-50 hover:shadow-md"
                    >
                      <UserPlus size={18} />
                      Become a Seller
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              PREVIOUS BUTTON
          ================================================== */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={goToPreviousSlide}
              aria-label="Previous hero slide"
              className="absolute left-5 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white/85 text-stone-800 shadow-md backdrop-blur transition-all duration-300 hover:bg-white hover:shadow-lg"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* =================================================
              NEXT BUTTON
          ================================================== */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={goToNextSlide}
              aria-label="Next hero slide"
              className="absolute right-5 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white/85 text-stone-800 shadow-md backdrop-blur transition-all duration-300 hover:bg-white hover:shadow-lg"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* =================================================
              DOTS

              IMPORTANT:
              heroImages.length === number of dots
              Therefore:
              1 image = 1 dot
              4 images = 4 dots
              9 images = 9 dots
          ================================================== */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={`hero-dot-${slide.image}`}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to hero slide ${index + 1}`}
                  aria-current={currentSlide === index ? "true" : undefined}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-8 bg-amber-700"
                      : "w-2.5 bg-stone-400/70 hover:bg-stone-600"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-stone-200 bg-white px-8 py-12 shadow-sm">
          <h2 className="text-center text-4xl font-black text-stone-900">
            Explore Artisan&apos;s Corner
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-center text-lg text-stone-600">
            Discover handmade products, support independent artisans and find
            something truly unique.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {/* Handmade Products */}
            <div className="flex items-start gap-5 md:border-r md:border-stone-200 md:pr-6">
              <div className="rounded-full bg-amber-100 p-4 text-amber-700">
                <Gift size={32} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-stone-900">
                  Handmade Products
                </h3>

                <p className="mt-2 leading-7 text-stone-600">
                  Browse unique products created by independent artisans.
                </p>
              </div>
            </div>

            {/* Independent Sellers */}
            <div className="flex items-start gap-5 md:border-r md:border-stone-200 md:pr-6">
              <div className="rounded-full bg-amber-100 p-4 text-amber-700">
                <Users size={32} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-stone-900">
                  Independent Sellers
                </h3>

                <p className="mt-2 leading-7 text-stone-600">
                  Support sellers and discover products from artisan stores.
                </p>
              </div>
            </div>

            {/* Secure Marketplace */}
            <div className="flex items-start gap-5">
              <div className="rounded-full bg-amber-100 p-4 text-amber-700">
                <ShieldCheck size={32} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-stone-900">
                  Secure Marketplace
                </h3>

                <p className="mt-2 leading-7 text-stone-600">
                  Manage your cart, orders and purchases from one trusted
                  marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;







