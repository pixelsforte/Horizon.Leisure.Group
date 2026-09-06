import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, MessageSquare, CheckCircle, Shield } from "lucide-react";

// Configurable constants for easy editing
const WHATSAPP_NUMBER = "+92 303 2789312";
const WHATSAPP_DISPLAY = "+92 303 2789312";
const PHONE_NUMBER = "+92 303 2789312";
const EMAIL_ADDRESS = "info@horizonleisuregroup.com";
const OFFICE_LOCATION = "Karachi, Pakistan";

interface ContactProps {
  selectedModel: string;
}

export default function Contact({ selectedModel }: ContactProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    city: "",
    clubName: "",
    partnershipModel: "",
    message: ""
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync selected model from partnership clicks
  useEffect(() => {
    if (selectedModel) {
      setFormData((prev) => ({
        ...prev,
        partnershipModel: selectedModel === "complimentary-consultation" ? "Free General Consultation" : `${selectedModel} Model`
      }));
    }
  }, [selectedModel]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Quick validation
    if (!formData.fullName.trim()) {
      setValidationError("Full Name is required.");
      return;
    }
    if (!formData.whatsappNumber.trim()) {
      setValidationError("WhatsApp Number is required.");
      return;
    }
    if (!formData.city.trim()) {
      setValidationError("City is required.");
      return;
    }
    if (!formData.clubName.trim()) {
      setValidationError("Club / Facility name is required.");
      return;
    }
    if (!formData.partnershipModel) {
      setValidationError("Please select your preferred partnership model.");
      return;
    }

    setValidationError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/partnerships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          whatsappNumber: formData.whatsappNumber.trim(),
          city: formData.city.trim(),
          clubName: formData.clubName.trim(),
          partnershipModel: formData.partnershipModel,
          message: formData.message.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit partnership request.");
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Partnership submission error:", err);
      setValidationError((err as Error).message || "A connection error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsapp = () => {
    const text = encodeURIComponent("Hello Horizon Leisure Group, I am interested in exploring a partnership model with your team. Please guide me on the next steps.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}?text=${text}`, "_blank");
  };

  return (
    <section id="contact" className="py-24 bg-[#0D3B0D] text-white relative overflow-hidden">
      
      {/* Decorative Glow elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c09f53]/5 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-1.5 h-1.5 bg-[#c09f53] rounded-full"></span>
            <span className="font-mono text-xs tracking-[0.3em] text-[#c09f53] uppercase font-bold">
              Begin Your Partnership
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
            Begin Your Partnership
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-sans text-sm md:text-base text-[#e5d7af]/80 font-light leading-relaxed"
          >
            Request a complimentary 30-minute consultation with our leadership team. No
            obligations. No pressure. Just an honest conversation about your club's potential.
          </motion.p>
        </div>

        {/* Form and Contact Detail grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Form Card */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0a2e0a] border border-[#c09f53]/35 p-8 md:p-12 text-center rounded-sm"
                id="contact-success-card"
              >
                <div className="w-16 h-16 bg-[#c09f53]/20 text-[#c09f53] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={36} />
                </div>
                <h3 className="font-serif text-2xl text-[#f4edd9] mb-3">Consultation Request Received</h3>
                <p className="font-sans text-sm text-[#e5d7af]/80 max-w-md mx-auto mb-8 leading-relaxed">
                  Thank you, <strong className="text-white">{formData.fullName}</strong>. Your request for a complimentary <strong className="text-[#c09f53]">{formData.partnershipModel}</strong> audit has been received. Our executive director will connect with you on WhatsApp shortly.
                </p>

                <button
                  type="button"
                  id="cta-reset-contact"
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({
                      fullName: "",
                      whatsappNumber: "",
                      city: "",
                      clubName: "",
                      partnershipModel: "",
                      message: ""
                    });
                  }}
                  className="px-6 py-2.5 border border-[#c09f53]/50 text-[#e5d7af] hover:text-[#0D3B0D] hover:bg-[#c09f53] text-xs tracking-widest uppercase transition-colors rounded-sm cursor-pointer"
                >
                  Submit another inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6" id="contact-form">
                {validationError && (
                  <div className="p-4 bg-red-950/45 border border-red-800 text-red-200 text-xs font-sans rounded-sm text-center">
                    {validationError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Your full name"
                      id="contact-name-input"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#0a2e0a] border border-white/10 text-white px-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      placeholder="+92 300 0000000"
                      id="contact-phone-input"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#0a2e0a] border border-white/10 text-white px-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Your city (e.g., Karachi)"
                      id="contact-city-input"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#0a2e0a] border border-white/10 text-white px-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">
                      Club / Facility Name
                    </label>
                    <input
                      type="text"
                      name="clubName"
                      placeholder="Name of your club"
                      id="contact-club-input"
                      value={formData.clubName}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#0a2e0a] border border-white/10 text-white px-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">
                    Preferred Partnership Model
                  </label>
                  <select
                    name="partnershipModel"
                    id="contact-model-select"
                    value={formData.partnershipModel}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0a2e0a] border border-white/10 text-white px-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53] appearance-none"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c09f53' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1em"
                    }}
                  >
                    <option value="" className="bg-[#0D3B0D] text-[#e5d7af]/50">Select a model...</option>
                    <option value="Sales Sharing Model" className="bg-[#0D3B0D]">Sales Sharing Model (25% Share)</option>
                    <option value="Lease Model" className="bg-[#0D3B0D]">Lease Model (Fixed Monthly Lease)</option>
                    <option value="Profit Share Model" className="bg-[#0D3B0D]">Profit Share Model (35% Profit Share)</option>
                    <option value="Free General Consultation" className="bg-[#0D3B0D]">Free General Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">
                    Brief Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us about your facility, goals, and any current challenges..."
                    id="contact-message-input"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[#0a2e0a] border border-white/10 text-white px-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53] resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                  <button
                    type="submit"
                    id="cta-contact-submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 bg-[#c09f53] text-[#0D3B0D] font-sans text-xs tracking-widest uppercase hover:bg-[#aa863e] transition-colors font-bold rounded-sm shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Request Consultation"}
                  </button>
                  <div className="flex items-center gap-2 text-[10px] text-[#e5d7af]/50 uppercase tracking-widest">
                    <Shield size={12} className="text-[#c09f53]" />
                    <span>Your information is 100% private & secure</span>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Contact info & Whatsapp preferred card */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* WhatsApp Preferred Card */}
            <div className="bg-[#0a2e0a] border border-emerald-600/35 p-6 md:p-8 rounded-sm shadow-2xl relative overflow-hidden" id="whatsapp-preferred-card">
              {/* WhatsApp background brand logo hint */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/5 rounded-full pointer-events-none"></div>

              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="font-mono text-[9px] text-emerald-400 tracking-[0.25em] uppercase font-bold">
                  WhatsApp - Preferred
                </span>
              </div>

              <h4 className="font-serif text-2xl text-white mb-2">{WHATSAPP_DISPLAY}</h4>
              <p className="font-sans text-xs text-[#e5d7af]/70 mb-6 leading-relaxed">
                Send us a direct message on WhatsApp. Our customer onboarding team is active and
                responds within minutes.
              </p>

              <button
                type="button"
                id="cta-whatsapp-chat"
                onClick={handleOpenWhatsapp}
                className="w-full py-4 bg-[#0d3b0d] text-white hover:bg-[] font-sans text-xs tracking-widest uppercase font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageSquare size={14} className="fill-current" /> Open WhatsApp Chat →
              </button>
            </div>

            {/* Direct Lines */}
            <div className="space-y-6" id="direct-contact-lines">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-[#c09f53]/30 rounded-full flex items-center justify-center text-[#c09f53] flex-shrink-0 mt-1">
                  <Phone size={14} />
                </div>
                <div>
                  <span className="font-mono text-[8px] text-[#c09f53] tracking-[0.25em] uppercase font-bold block mb-1">
                    Direct Phone Line
                  </span>
                  <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="font-sans text-sm md:text-base text-[#f4edd9] hover:text-[#c09f53] transition-colors font-medium">
                    {PHONE_NUMBER}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-[#c09f53]/30 rounded-full flex items-center justify-center text-[#c09f53] flex-shrink-0 mt-1">
                  <Mail size={14} />
                </div>
                <div>
                  <span className="font-mono text-[8px] text-[#c09f53] tracking-[0.25em] uppercase font-bold block mb-1">
                    Official Email
                  </span>
                  <a href={`mailto:${EMAIL_ADDRESS}`} className="font-sans text-sm md:text-base text-[#f4edd9] hover:text-[#c09f53] transition-colors font-medium">
                    {EMAIL_ADDRESS}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-[#c09f53]/30 rounded-full flex items-center justify-center text-[#c09f53] flex-shrink-0 mt-1">
                  <MapPin size={14} />
                </div>
                <div>
                  <span className="font-mono text-[8px] text-[#c09f53] tracking-[0.25em] uppercase font-bold block mb-1">
                    Physical Office
                  </span>
                  <span className="font-sans text-sm md:text-base text-[#f4edd9] font-medium block">
                    {OFFICE_LOCATION}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
