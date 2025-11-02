import { motion } from "framer-motion";
import { Twitter, Linkedin, LayoutGrid } from "lucide-react";

export default function Footer() {
  return (
    <>
      <motion.footer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="w-full fixed bottom-3 flex flex-col items-center"
      >
        <div className="flex justify-center items-center gap-4 text-[12px] text-zinc-500">
          {["About", "Privacy", "Terms", "Contact", "Pricing", "Help"].map(
            (link, index) => (
              <motion.a
                key={`footer-link-${index}`}
                href="#"
                className="hover:text-cyan-400 transition-colors relative group px-1 py-0.5"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all duration-200"></span>
              </motion.a>
            )
          )}
        </div>
      </motion.footer>

      {/* Social Media Icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-3 right-4 flex items-center gap-3 z-10"
      >
        <motion.a
          href="#"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="text-zinc-500 hover:text-cyan-400 transition-colors"
        >
          <Twitter className="h-[14px] w-[14px]" />
        </motion.a>
        <motion.a
          href="#"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="text-zinc-500 hover:text-cyan-400 transition-colors"
        >
          <Linkedin className="h-[14px] w-[14px]" />
        </motion.a>
        <motion.a
          href="#"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="text-zinc-500 hover:text-cyan-400 transition-colors"
        >
          <LayoutGrid className="h-[14px] w-[14px]" />
        </motion.a>
      </motion.div>
    </>
  );
}
