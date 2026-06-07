import { motion } from "framer-motion";
import Typewriter from "./animations/Typewriter";

export default function Hero() {
  return (
    <section id="home" className="relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-[#333333] opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
        <div className="text-center space-y-6">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold font-['Poppins'] text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Your <Typewriter text="NEXT STEP" className="text-[#0073b1]" /> in Career
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-['Poppins']"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Grow with us and discover opportunities that match your talent
          </motion.p>
          
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="#submit"
              className="inline-block px-8 py-3 text-lg font-medium rounded-md text-white bg-[#0073b1] hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Submit Your Resume
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
