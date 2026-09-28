import { motion } from "framer-motion";

function TrustedCompanies() {
  const companies = [
    {
      name: "Google",
      logo: "/logos/Google-Logo.Wine.png",
      className: "h-16",
      careerUrl: "https://careers.google.com",
    },
    {
      name: "Microsoft",
      logo: "/logos/microsoft.png",
      className: "h-10",
      careerUrl: "https://careers.microsoft.com",
    },
    {
      name: "Amazon",
      logo: "/logos/amazon.png",
      className: "h-9",
      careerUrl: "https://www.amazon.jobs",
    },
    {
      name: "Adobe",
      logo: "/logos/Adobe.jpeg",
      className: "h-8",
      careerUrl: "https://www.adobe.com/careers.html",
    },
    {
      name: "Paytm",
      logo: "/logos/paytm.png",
      className: "h-10",
      careerUrl: "https://paytm.com/careers",
    },
    {
      name: "Walmart",
      logo: "/logos/walmark.png",
      className: "h-12",
      careerUrl: "https://careers.walmart.com",
      isDarkBox: true,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FCFBFF] py-20">
      {/* Background Radial Glow */}
      <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-[1320px] px-6 sm:px-8">
        {/* Subtle Decorative Divider */}
        <div className="mb-6 flex justify-center">
          <div className="h-[2px] w-36 rounded-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
        </div>

        {/* Section Tagline */}
        <p className="text-center text-[12px] sm:text-[13px] font-semibold uppercase tracking-[5px] text-slate-500">
          Trusted By Job Seekers At Top Companies
        </p>

        {/* Responsive Logo Grid: Balanced 6 items across all viewports */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 items-center justify-items-center"
        >
          {companies.map((company) => (
            <motion.a
              key={company.name}
              href={company.careerUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Explore ${company.name} Careers`}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex h-24 w-full max-w-[170px] items-center justify-center rounded-2xl border border-slate-100/80 bg-white/70 px-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-violet-200 hover:bg-white hover:shadow-md cursor-pointer"
            >
              <img
                src={company.logo}
                alt={company.name}
                className={`${company.className} max-w-full object-contain transition duration-300 ${
                  company.isDarkBox
                    ? "mix-blend-darken rounded-lg opacity-85 hover:opacity-100"
                    : "grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
                }`}
              />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TrustedCompanies;