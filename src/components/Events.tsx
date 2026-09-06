import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  Calendar,
  Users,
  Home,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import { EVENT_TABS } from "../data";

export default function Events() {
  const [activeTabId, setActiveTabId] = useState("corporate");
  const [bookingStep, setBookingStep] = useState(1);

  const [selectedEventType, setSelectedEventType] = useState<string>("");
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [selectedGuestCount, setSelectedGuestCount] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeTab =
    EVENT_TABS.find((tab) => tab.id === activeTabId) || EVENT_TABS[0];

  const tabImages: Record<string, string> = {
    corporate: "/corporate.jpeg",
    matrimonial: "/Matrimonial.jpeg",
    birthday: "/Birthday.jpeg",
    school: "/school_academic.jpeg",
  };

  const currentImageSrc = tabImages[activeTabId] || "/corporate.jpeg";

  const handleNextStep = () => {
    if (bookingStep === 1) {
      if (!selectedEventType) {
        setValidationError("Please select an event type to proceed.");
        return;
      }
      setValidationError("");
      setBookingStep(2);
    } else if (bookingStep === 2) {
      if (!selectedVenue) {
        setValidationError("Please select a venue type.");
        return;
      }
      if (!selectedGuestCount) {
        setValidationError("Please select an expected guest count.");
        return;
      }
      if (!preferredDate) {
        setValidationError("Please select your preferred event date.");
        return;
      }
      setValidationError("");
      setBookingStep(3);
    }
  };

  const handleBackStep = () => {
    setBookingStep((prev) => Math.max(1, prev - 1));
    setValidationError("");
  };

  const handleSubmitBooking = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setValidationError("Full Name is required.");
      return;
    }
    if (!phoneNumber.trim()) {
      setValidationError("Phone Number is required.");
      return;
    }
    if (!emailAddress.trim() || !emailAddress.includes("@")) {
      setValidationError("Please provide a valid Email Address.");
      return;
    }

    setValidationError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedEventType,
          selectedVenue,
          selectedGuestCount,
          preferredDate,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          emailAddress: emailAddress.trim(),
          additionalNotes: additionalNotes.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit booking inquiry.");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Booking submission error:", err);
      setValidationError((err as Error).message || "A connection error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBookingForm = () => {
    setBookingStep(1);
    setSelectedEventType("");
    setSelectedVenue("");
    setSelectedGuestCount("");
    setPreferredDate("");
    setFullName("");
    setPhoneNumber("");
    setEmailAddress("");
    setAdditionalNotes("");
    setIsSubmitted(false);
  };

  return (
    <section
      id="events"
      className="py-24 bg-[#0a2e0a] text-white border-b border-[#c09f53]/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-1.5 h-1.5 bg-[#112d11] rounded-full"></span>
            <span className="font-mono text-xs tracking-[0.3em] text-[#c09f53] uppercase font-bold">
              Event Management
            </span>
            <span className="w-1.5 h-1.5 bg-[#c09f53] rounded-full"></span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#f4edd9] leading-tight mb-4"
          >
            Every Occasion, Elevated
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-sans text-sm md:text-base text-[#e5d7af]/85 font-light leading-relaxed"
          >
            25 years of orchestrating unforgettable events across Pakistan's
            finest leisure facilities — from intimate gatherings to grand
            celebrations of a thousand guests.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 border-b border-white/5 pb-6">
          {EVENT_TABS.map((tab) => (
            <button
              key={tab.id}
              id={`event-tab-btn-${tab.id}`}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-5 py-3 font-sans text-[11px] md:text-xs tracking-widest uppercase transition-all duration-300 font-semibold rounded-sm border cursor-pointer ${
                activeTabId === tab.id
                  ? "bg-[#c09f53] text-[#112d11] border-[#c09f53] shadow-lg"
                  : "bg-[#112d11]/40 text-[#f4edd9]/80 border-white/10 hover:border-[#c09f53]/50 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mb-24 bg-[#112d11]/60 border border-[#c09f53]/15 rounded-sm overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 items-stretch"
            >
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[450px] bg-[#0] overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#112d11]/90 to-transparent pointer-events-none z-10"></div>
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#112d11]/95 to-transparent pointer-events-none z-10"></div>

                <img
                  src={currentImageSrc}
                  alt={activeTab.title}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <span className="font-serif text-[#c09f53] text-xl md:text-2xl lg:text-3xl italic block font-light">
                    “{activeTab.tagline}”
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                <span className="font-mono text-[10px] text-[#c09f53] tracking-[0.3em] uppercase font-bold block mb-2">
                  EVENT HIGHLIGHT
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-[#f4edd9] mb-4">
                  {activeTab.title}
                </h3>

                <p className="font-sans text-sm md:text-base text-[#e5d7af]/80 leading-relaxed font-light mb-8">
                  {activeTab.description}
                </p>

                <div className="border-t border-[#c09f53]/15 pt-6">
                  <h4 className="font-mono text-[10px] text-[#c09f53] tracking-widest uppercase font-bold mb-4">
                    WHAT WE OFFER
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    {activeTab.offers.map((offer, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-3">
                        <span className="w-1.5 h-[1.5px] bg-[#c09f53]"></span>
                        <span className="font-sans text-xs md:text-sm text-[#f4edd9]/95 font-medium">
                          {offer}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="max-w-4xl mx-auto border border-[#c09f53]/25 bg-[] p-6 md:p-10 rounded-sm shadow-xl"
          id="event-journey"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-[1px] bg-[#c09f53]/50"></div>
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-[#c09f53] uppercase font-bold">
              RESERVED YOUR DATE
            </span>
            <div className="w-8 h-[1px] bg-[#c09f53]/50"></div>
          </div>

          <div className="text-left mb-10 border-b border-[#c09f53]/10 pb-4">
            <h3 className="font-serif text-2xl md:text-3xl text-[#f4edd9] mt-1">
              Begin Your Event Journey
            </h3>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
              id="booking-success-card"
            >
              <div className="w-16 h-16 bg-[#c09f53]/15 text-[#c09f53] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="font-serif text-2xl text-[#f4edd9] mb-3">
                Enquiry Received Successfully
              </h4>
              <p className="font-sans text-sm text-[#e5d7af]/80 max-w-md mx-auto mb-8 leading-relaxed">
                Thank you, <strong className="text-white">{fullName}</strong>.
                Our event director will review your event request for{" "}
                <strong className="text-[#c09f53]">{preferredDate}</strong> and
                reach out to you within 24 hours.
              </p>

              <div className="bg-[#0a2e0a] border border-[#c09f53]/15 p-6 rounded-sm max-w-md mx-auto text-left space-y-3 mb-8">
                <h5 className="font-mono text-[10px] text-[#c09f53] tracking-wider uppercase border-b border-[#c09f53]/15 pb-2">
                  BOOKING CONFIRMATION SUMMARY
                </h5>
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-[#e5d7af]/60">Event Category:</span>
                  <span className="text-white font-medium">
                    {selectedEventType}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-[#e5d7af]/60">Selected Venue:</span>
                  <span className="text-white font-medium">
                    {selectedVenue}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-[#e5d7af]/60">Expected Guests:</span>
                  <span className="text-white font-medium">
                    {selectedGuestCount}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-[#e5d7af]/60">Scheduled Date:</span>
                  <span className="text-[#c09f53] font-medium">
                    {preferredDate}
                  </span>
                </div>
              </div>

              <button
                id="cta-restart-booking"
                onClick={resetBookingForm}
                className="px-6 py-2.5 border border-[#c09f53]/50 text-[#e5d7af] hover:text-[#112d11] hover:bg-[#c09f53] text-xs tracking-widest uppercase transition-colors rounded-sm cursor-pointer"
              >
                Plan Another Event
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmitBooking}
              id="booking-multi-step-form"
              className="space-y-10"
            >
              {validationError && (
                <div className="mb-6 p-4 bg-red-950/45 border border-red-800 text-red-200 text-xs font-sans rounded-sm text-center">
                  {validationError}
                </div>
              )}

              <div className="space-y-6">
                <p className="font-sans text-xs tracking-widest text-[#e5d7af]/75 uppercase block mb-3 font-semibold text-center">
                  SELECT EVENT TYPE
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Corporate",
                      desc: "Where Business Meets Distinction",
                    },
                    { title: "Matrimonial", desc: "Memories Woven in Gold" },
                    {
                      title: "Birthday",
                      desc: "Celebrations Worth Remembering",
                    },
                    {
                      title: "School & Academic",
                      desc: "Inspiring the Next Generation",
                    },
                  ].map((item) => {
                    const isSelected = selectedEventType === item.title;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        id={`btn-select-type-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                        onClick={() => {
                          setSelectedEventType(item.title);
                          setValidationError("");
                        }}
                        className={`relative text-left p-5 border transition-all duration-300 rounded-sm cursor-pointer ${
                          isSelected
                            ? "border-[#c09f53] bg-[#c09f53]/5 shadow-[0_4px_15px_rgba(192,159,83,0.06)]"
                            : "border-white/10 bg-[#112d11] hover:border-[#c09f53]/35"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-4 right-4 bg-[#c09f53] text-[#112d11] rounded-full p-0.5">
                            <Check size={10} className="stroke-[3]" />
                          </span>
                        )}
                        <h4 className="font-serif text-lg text-white font-medium mb-1">
                          {item.title}
                        </h4>
                        <p className="font-sans text-[11px] text-[#e5d7af]/65 italic">
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {selectedEventType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8 border-t border-[#c09f53]/15 pt-8 overflow-hidden"
                  >
                    <p className="font-sans text-xs tracking-widest text-[#e5d7af]/75 uppercase block mb-3 font-semibold text-center">
                      VENUE PREFERENCE & DATE (for {selectedEventType} event)
                    </p>

                    <div>
                      <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-3">
                        VENUE TYPE
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          "Grand Ballroom",
                          "Outdoor Lawn",
                          "Conference Hall",
                          "Poolside Terrace",
                          "Private Dining Room",
                          "Sports Arena",
                        ].map((venue) => {
                          const isSelected = selectedVenue === venue;
                          return (
                            <button
                              key={venue}
                              type="button"
                              id={`btn-select-venue-${venue.toLowerCase().replace(/\s/g, "-")}`}
                              onClick={() => {
                                setSelectedVenue(venue);
                                setValidationError("");
                              }}
                              className={`p-3.5 text-center text-xs font-sans font-medium border rounded-sm transition-all duration-300 cursor-pointer ${
                                isSelected
                                  ? "bg-[#c09f53] text-[#112d11] border-[#c09f53]"
                                  : "bg-[#112d11] text-[#e5d7af]/80 border-white/10 hover:border-[#c09f53]/50"
                              }`}
                            >
                              {venue}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-3">
                        EXPECTED GUEST COUNT
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                        {[
                          "Up to 50",
                          "50 - 150",
                          "150 - 300",
                          "300 - 500",
                          "500 - 1,000",
                          "1,000+",
                        ].map((count) => {
                          const isSelected = selectedGuestCount === count;
                          return (
                            <button
                              key={count}
                              type="button"
                              id={`btn-select-guests-${count.toLowerCase().replace(/\s/g, "-")}`}
                              onClick={() => {
                                setSelectedGuestCount(count);
                                setValidationError("");
                              }}
                              className={`p-2.5 text-center text-[11px] font-sans border rounded-sm transition-all duration-300 cursor-pointer ${
                                isSelected
                                  ? "bg-[#c09f53] text-[#112d11] border-[#c09f53] font-semibold"
                                  : "bg-[#112d11] text-[#e5d7af]/80 border-white/10 hover:border-[#c09f53]/50"
                              }`}
                            >
                              {count}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">
                        PREFERRED EVENT DATE
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#c09f53] pointer-events-none">
                          <Calendar size={14} />
                        </span>
                        <input
                          type="date"
                          id="preferred-event-date-input"
                          value={preferredDate}
                          onChange={(e) => {
                            setPreferredDate(e.target.value);
                            setValidationError("");
                          }}
                          className="w-full bg-[#112d11] border border-white/15 text-white pl-10 pr-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {selectedEventType &&
                  selectedVenue &&
                  selectedGuestCount &&
                  preferredDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6 border-t border-[#c09f53]/15 pt-8 overflow-hidden"
                    >
                      <p className="font-sans text-xs tracking-widest text-[#e5d7af]/75 uppercase block mb-3 font-semibold text-center">
                        YOUR DETAILS
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                            FULL NAME
                          </label>
                          <input
                            type="text"
                            placeholder="Your full name"
                            id="booking-name-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full bg-[#112d11] border border-white/15 text-white px-4 py-3 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                            PHONE NUMBER
                          </label>
                          <input
                            type="tel"
                            placeholder="+92 300 0000000"
                            id="booking-phone-input"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="w-full bg-[#112d11] border border-white/15 text-white px-4 py-3 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          placeholder="your.email@email.com"
                          id="booking-email-input"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          required
                          className="w-full bg-[#112d11] border border-white/15 text-white px-4 py-3 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                          ADDITIONAL NOTES (OPTIONAL)
                        </label>
                        <textarea
                          placeholder="Any special requirements or vision for your event..."
                          rows={3}
                          id="booking-notes-input"
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          className="w-full bg-[#112d11] border border-white/15 text-white px-4 py-3 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53] resize-none"
                        />
                      </div>

                      <div className="bg-[#0a2e0a] border border-[#c09f53]/15 p-5 rounded-sm space-y-2 mt-4 text-xs font-sans">
                        <h5 className="font-mono text-[10px] text-[#c09f53] tracking-wider uppercase border-b border-[#c09f53]/15 pb-1.5">
                          BOOKING SUMMARY
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-left">
                          <div>
                            <span className="text-[#e5d7af]/60 block">
                              Event Type
                            </span>
                            <span className="text-white font-medium">
                              {selectedEventType}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#e5d7af]/60 block">
                              Venue Preference
                            </span>
                            <span className="text-white font-medium">
                              {selectedVenue}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#e5d7af]/60 block">
                              Guest Count
                            </span>
                            <span className="text-white font-medium">
                              {selectedGuestCount}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#e5d7af]/60 block">
                              Preferred Date
                            </span>
                            <span className="text-[#c09f53] font-medium">
                              {preferredDate || "Not chosen"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center pt-6">
                        <button
                          type="submit"
                          id="cta-booking-submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto px-12 py-4 bg-[#c09f53] text-[#112d11] font-sans text-xs tracking-widest uppercase hover:bg-[#aa863e] transition-colors font-bold rounded-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "SUBMITTING..." : "SUBMIT ENQUIRY"}
                        </button>
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </form>
          )}
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
  );
}