import { useState } from "react";
import { CHALLENGE_ITEMS } from "../data";

export default function Challenge() {
  // Initialize state tracking for the hovered item index
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);

  return (
    <section className="bg-white py-24 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-20 md:space-y-28">
        {/* ================= SECTION 1: Header Content (Left) + First Image (Right) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Top Header & Intro Paragraph (Left Column) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1.5px] w-6 bg-gold-500" />
              <span className="font-sans text-[0.7rem] tracking-[0.3em] text-gold-600 font-bold uppercase">
                THE CHALLENGE
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-green-950 tracking-wide leading-tight">
              Welcome to Horizon <br className="hidden md:block" />
              Leisure Group{" "}
              <span className="text-gold-500 italic pr-2 font-normal">
                (ASF Boeing 747)
              </span>
            </h2>

            <p className="mt-6 font-sans text-base sm:text-lg text-green-900/80 tracking-wide leading-relaxed font-light">
              Experience one of Pakistan's most unique event venues inside the
              iconic ASF Boeing 747. This is not a restaurant it's a
              one-of-a-kind venue designed exclusively for unforgettable
              celebrations. Whether you're planning.
            </p>

            <p className="mt-8 font-serif text-lg md:text-xl text-gold-600 italic">
              Our Boeing 747 venue offers an extraordinary setting that
              transforms every occasion into a truly memorable experience.
            </p>
          </div>

          {/* First Image (Right Column) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] bg-green-900 double-border overflow-hidden group rounded-sm shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-950 to-green-900 flex flex-col justify-between p-8 text-gold-50 z-0">
                <div className="border-t border-l border-gold-400/30 w-12 h-12" />
                <div className="self-end border-b border-r border-gold-400/30 w-12 h-12" />
              </div>

              <img
                src="/The_Challenge_01.jpeg"
                alt="Venue Ambience 1"
                className="absolute inset-0 w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out z-10"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-transparent to-green-950/20 z-20 pointer-events-none" />
              <div className="absolute inset-4 border border-gold-400/20 z-20 pointer-events-none group-hover:inset-3 transition-all duration-500" />
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: Second Image (Left) + 10 Challenge Items (Right) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Second Image (Left Column) */}
          <div className="lg:col-span-5 flex items-center justify-center order-2 lg:order-1 lg:sticky lg:top-24">
            <div className="relative w-full max-w-md aspect-[4/5] bg-green-900 double-border overflow-hidden group rounded-sm shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-950 to-green-900 flex flex-col justify-between p-8 text-gold-50 z-0">
                <div className="border-t border-l border-gold-400/30 w-12 h-12" />
                <div className="self-end border-b border-r border-gold-400/30 w-12 h-12" />
              </div>

              <img
                src="/The_Challenge_02.jpeg"
                alt="Venue Ambience 2"
                className="absolute inset-0 w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out z-10"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-transparent to-green-950/20 z-20 pointer-events-none" />
              <div className="absolute inset-4 border border-gold-400/20 z-20 pointer-events-none group-hover:inset-3 transition-all duration-500" />
            </div>
          </div>

          {/* 10 Items List (Right Column) */}
          <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2">
            <div className="space-y-2">
              {CHALLENGE_ITEMS.map((challenge, idx) => {
                const itemIndex = idx + 1;
                const isActive = activeChallenge === itemIndex;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveChallenge(itemIndex)}
                    onMouseLeave={() => setActiveChallenge(null)}
                    className={`flex items-center gap-5 p-4 border-b border-gold-200/20 transition-all duration-300 group cursor-default ${
                      isActive
                        ? "bg-gold-50/40 translate-x-1"
                        : "bg-transparent"
                    }`}
                  >
                    <div className="relative">
                      {/* Gold vertical indicator */}
                      <div
                        className={`absolute -left-4 top-0 bottom-0 w-[2px] transition-all duration-300 ${
                          isActive ? "bg-gold-400 h-full" : "bg-transparent h-0"
                        }`}
                      />

                      <span className="font-serif text-sm font-semibold text-gold-500 tracking-wider">
                        {itemIndex < 10 ? `0${itemIndex}` : itemIndex}
                      </span>
                    </div>

                    <p className="font-sans text-sm sm:text-base text-green-950 font-medium tracking-wide group-hover:text-gold-600 transition-colors">
                      {challenge.text}
                    </p>
                  </div>
                );
              })}
              <p className="mt-8 font-serif text-lg md:text-xl text-gold-600 italic">
                Create lifelong memories at Pakistan's most unique event
                destination with Horizon Leisure Group. For further details
                please call  <span className="font-bold font-sans">+92 303 2789312</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
