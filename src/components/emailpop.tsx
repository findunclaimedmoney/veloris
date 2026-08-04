import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

// Changed all "glimr" keys to "lensflow"
const STORAGE_KEY_DISMISSED = "lensflow_email_dismissed";
const STORAGE_KEY_SUBMITTED = "lensflow_email_submitted";
const STORAGE_KEY_EMAILS = "lensflow_emails";

export default function EmailPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const user = useQuery(api.auth.getMe);
  const isAuthenticated = Boolean(user);

  const shouldShow = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (isAuthenticated) return false; // Don't show to signed-in users
    const dismissed = localStorage.getItem(STORAGE_KEY_DISMISSED);
    const submitted = localStorage.getItem(STORAGE_KEY_SUBMITTED);
    return !dismissed && !submitted;
  }, [isAuthenticated]);

  useEffect(() => {
    if (!shouldShow()) return;

    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setIsOpen(true);
    };

    // Timer: show after 15 seconds
    const timer = setTimeout(trigger, 15000);

    // Scroll: show when user scrolls past 40%
    const handleScroll = () => {
      const scrollPercent =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.4) {
        trigger();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [shouldShow]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY_DISMISSED, "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Store email in localStorage array
    const existing = localStorage.getItem(STORAGE_KEY_EMAILS);
    const emails: string[] = existing ? JSON.parse(existing) : [];
    emails.push(email.trim());
    localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(emails));
    localStorage.setItem(STORAGE_KEY_SUBMITTED, "true");

    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-2xl backdrop-blur-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 z-20 cursor-pointer rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              aria-label="Close popup"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left: Image */}
              <div className="relative h-48 w-full shrink-0 md:h-auto md:w-[40%] overflow-hidden bg-black">
                <anam-agent agent-id="edf6fdcb-acab-44b8-b974-ded72665ee26"></anam-agent>
                {/* Gradient fade to right on desktop, to bottom on mobile */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900/95 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-zinc-900/95" />
              </div>

              {/* Right: Content */}
              <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-8">
                {!isSubmitted ? (
                  <>
                    <h2 className="mb-3 text-2xl font-semibold italic tracking-tight text-white md:text-3xl">
                      She&apos;s waiting for you.
                    </h2>
                    <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                      Get early access. Plus: exclusive content, new features
                      first, and a free intimate session.
                    </p>

                    <form onSubmit={handleSubmit} className="mb-4 space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30"
                      />
                      <button
                        type="submit"
                        className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-all hover:from-pink-500 hover:to-rose-400 hover:shadow-pink-500/30"
                      >
                        Get Early Access →
                      </button>
                    </form>

                    <p className="mb-5 text-center text-xs text-zinc-500">
                      No spam. She hates spam too.
                    </p>

                    <div className="border-t border-zinc-800 pt-4">
                      <p className="mb-3 text-center text-xs text-zinc-500">
                        Or start now:
                      </p>
                      <Link
                        to="/chat"
                        onClick={handleClose}
                        className="block w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-center text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
                      >
                        Chat with Mia Free
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <h2 className="mb-4 text-2xl font-semibold italic text-white">
                      You&apos;re in.
                    </h2>
                    <p className="mb-6 text-sm text-zinc-400">
                      We&apos;ll send you something special soon.
                    </p>
                    <Link
                      to="/chat"
                      onClick={handleClose}
                      className="cursor-pointer rounded-lg bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-all hover:from-pink-500 hover:to-rose-400 hover:shadow-pink-500/30"
                    >
                      Chat with Mia Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}