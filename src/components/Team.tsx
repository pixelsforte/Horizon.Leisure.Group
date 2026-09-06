import { motion } from "motion/react";
import { Users, ShieldCheck, Mail, Target } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  discipline: string;
  desc: string;
  pills: string[];
  image: string;
}

export default function Team() {
  const teamMembers: TeamMember[] = [
    {
      name: "Sana Malik",
      role: "Head of Operations",
      discipline: "OPERATIONS",
      desc: "Over 12 years directing leisure facility operations across Pakistan's most prestigious establishments.",
      pills: ["CLUB MANAGEMENT", "PROCESS OPTIMISATION", "STAFF DEVELOPMENT"],
      image: "/client1.jpg",
    },
    {
      name: "Usman Tariq",
      role: "Director of Finance",
      discipline: "FINANCE",
      desc: "A CFA charterholder with deep expertise in hospitality-sector financial structuring and P&L management.",
      pills: ["REVENUE STRATEGY", "BUDGET ARCHITECTURE", "FINANCIAL MODELLING"],
      image: "/client2.png",
    },
    {
      name: "Ayesha Rauf",
      role: "Head of Member Experience",
      discipline: "MEMBER RELATIONS",
      desc: "Crafting world-class member journeys that transform clubs into communities of distinction.",
      pills: ["GUEST RELATIONS", "LOYALTY PROGRAMMES", "BRAND ELEVATION"],
      image: "/client3.jpg",
    },
    {
      name: "Bilal Hussain",
      role: "Technical & Infrastructure Lead",
      discipline: "TECHNICAL",
      desc: "Ensuring every square metre of your facility performs at the highest standard, day after day.",
      pills: ["FACILITY ENGINEERING", "SMART SYSTEMS", "PREVENTIVE MAINTENANCE"],
      image: "/client4.png",
    },
    {
      name: "Nadia Khalid",
      role: "Marketing & Brand Strategist",
      discipline: "MARKETING",
      desc: "Architecting compelling brand narratives that attract and retain a premium membership base.",
      pills: ["BRAND POSITIONING", "DIGITAL STRATEGY", "MEMBERSHIP GROWTH"],
      image: "/client5.jpg",
    },
    {
      name: "Kamran Shah",
      role: "F&B & Hospitality Director",
      discipline: "HOSPITALITY",
      desc: "Transforming dining and events into signature experiences that define a club's reputation.",
      pills: ["CULINARY CURATION", "EVENT MANAGEMENT", "REVENUE OPTIMISATION"],
      image: "/client6.jpg",
    },
  ];

  const clients = [
    { id: 1, init: "AAJ", name: "AA Joyland", sub: "FAMILY ENTERTAINMENT", img: "/client1.jpg" },
    { id: 2, init: "DGC", name: "DHA Golf Club", sub: "GOLF & RECREATION", img: "/client2.png" },
    { id: 3, init: "DCC", name: "DHA Creek Club", sub: "PREMIUM HOSPITALITY", img: "/client3.jpg" },
    { id: 4, init: "RH", name: "Ramada Hotel", sub: "LUXURY HOSPITALITY", img: "/client4.png" },
    { id: 5, init: "CSS", name: "City School System", sub: "ACADEMIC INSTITUTION", img: "/client5.jpg" },
    { id: 6, init: "TS", name: "Turk Station", sub: "F&B CONCEPT", img: "/client6.jpg" },
  ];
  
  const clientStats = [
    { num: "25+", label: "YEARS OF PARTNERSHIP" },
    { num: "30+", label: "CLIENT ORGANISATIONS" },
    { num: "100%", label: "RETENTION RATE" },
    { num: "PKR 2B+", label: "REVENUE MANAGED" },
  ];

  return (
    <div className="w-full">
      <section id="team" className="bg-gold-50 py-24 md:py-32 relative overflow-hidden border-b border-gold-200/40">
        <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1.5px] w-6 bg-gold-500" />
              <span className="font-sans text-[0.7rem] tracking-[0.3em] text-gold-600 font-bold uppercase">
                OUR SPECIALISTS
              </span>
              <div className="h-[1.5px] w-6 bg-gold-500" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-green-950 tracking-wide leading-tight">
              The Team That Delivers <span className="text-gold-500 font-normal italic pr-2">Excellence</span>
            </h2>

            <p className="mt-6 font-sans text-sm sm:text-base text-green-900/60 tracking-widest leading-relaxed font-light">
              Seasoned specialists across every discipline of leisure management — united by an
              uncompromising commitment to your club's success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white border border-gold-200/40 p-6 flex flex-col justify-between group hover:border-gold-400 transition-all duration-300 relative shadow-md hover:shadow-xl"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden mb-6">
                    
                    <span className="absolute top-4 left-4 z-20 bg-gold-400 text-green-950 font-mono text-[0.55rem] font-bold tracking-[0.15em] px-2.5 py-1 uppercase shadow-md select-none">
                      {member.discipline}
                    </span>

                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-contain brightness-95 group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    <div className="absolute inset-3 border border-gold-400/10 z-10 pointer-events-none" />
                  </div>

                  <h3 className="font-serif text-xl text-green-950 font-medium tracking-wide">
                    {member.name}
                  </h3>
                  <p className="font-sans text-xs text-gold-600 tracking-[0.1em] font-semibold mt-1 uppercase">
                    {member.role}
                  </p>
                  <p className="mt-4 font-sans text-xs sm:text-sm text-green-900/70 tracking-wider leading-relaxed font-light">
                    {member.desc}
                  </p>
                </div>

                <div className="mt-6 border-t border-gold-200/40 pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {member.pills.map((pill, pIdx) => (
                      <span
                        key={pIdx}
                        className="font-mono text-[0.55rem] text-green-950 bg-gold-50 border border-gold-300/30 px-2 py-0.5 tracking-wider uppercase font-medium"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute top-2 right-2 border-t border-r border-gold-400/20 w-3 h-3 pointer-events-none" />
                <div className="absolute bottom-2 left-2 border-b border-l border-gold-400/20 w-3 h-3 pointer-events-none" />
              </div>
            ))}
          </div>

        </div>
        <div className="flex items-center gap-6 my-12 opacity-100 transform-none">
          <div className="flex-1 h-[1px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
          </div>

          <div className="flex items-center gap-2 select-none">
            <span className="text-[10px] text-gold-500">◆</span>
            <span className="text-[6px] text-gold-500/50">◆</span>
            <span className="text-[10px] text-gold-500">◆</span>
          </div>

          <div className="flex-1 h-[1px] relative">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-gold-500/50 to-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
}