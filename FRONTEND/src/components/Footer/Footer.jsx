import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", path: "/dashboard", isRoute: true },
      { label: "Job Tracker", path: "/jobs", isRoute: true },
      { label: "Resume Analyzer", targetId: "features", isScroll: true },
      { label: "Analytics", path: "/analytics", isRoute: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", targetId: "faq", isScroll: true },
      { label: "Privacy Policy", path: "#!", isPlaceholder: true },
      { label: "Terms & Conditions", path: "#!", isPlaceholder: true },
      { label: "FAQs", targetId: "faq", isScroll: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", targetId: "about", isScroll: true },
      { label: "Contact", targetId: "faq", isScroll: true },
      { label: "Careers", targetId: "features", isScroll: true },
      { label: "Blog", path: "#!", isPlaceholder: true },
    ],
  },
];

function Footer() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-zinc-950 text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"></div>
      <div className="mx-auto max-w-7xl px-6 py-20">
        
        {/* Top Section */}
        <div className="grid gap-14 lg:grid-cols-2">
          
          {/* Left */}
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Search
              <span className="text-violet-500">&</span>
              Track
            </h2>

            <p className="mt-5 max-w-md leading-7 text-zinc-400">
              Organize your job applications, analyze your resume with AI,
              and track every opportunity from one beautiful dashboard.
            </p>

            {/* Social Icons - Opens new tab, does NOT jump to top */}
            <div className="mt-8 flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-700 p-3 text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:bg-violet-600 hover:text-white"
                title="GitHub"
              >
                <FaGithub size={20} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-700 p-3 text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:bg-violet-600 hover:text-white"
                title="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-700 p-3 text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:bg-violet-600 hover:text-white"
                title="X / Twitter"
              >
                <FaXTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Right Links Grid */}
          <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-5 text-lg font-semibold text-white">
                  {section.title}
                </h3>

                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.isScroll ? (
                        <button
                          type="button"
                          onClick={() => scrollToSection(link.targetId)}
                          className="text-left text-zinc-400 transition-all duration-200 hover:translate-x-1 hover:text-violet-400 cursor-pointer"
                        >
                          {link.label}
                        </button>
                      ) : link.isRoute ? (
                        <Link
                          to={link.path}
                          className="inline-block text-zinc-400 transition-all duration-200 hover:translate-x-1 hover:text-violet-400"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => e.preventDefault()}
                          className="text-left text-zinc-400 transition-all duration-200 hover:text-zinc-200 cursor-default"
                        >
                          {link.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Divider */}
        <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-zinc-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} Search&Track. All rights reserved.
          </p>

          <p className="text-center">
            Crafted with ❤️ for modern job seekers.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;