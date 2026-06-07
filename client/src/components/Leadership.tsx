import { motion } from "framer-motion";
import gowthamPhoto from "@/assets/GowthamMD.jpg";
import bharathPhoto from "@/assets/BharathCEO.jpg";

const leaders = [
  {
    name: "Bharath Kumar.G",
    role: "CEO & Founder",
    description:
      "Young entrepreneur with a vision to transform the IT recruitment landscape through innovation and personalized career paths. Extensive network across major tech companies and startups in India and abroad.",
    image: bharathPhoto,
    bgSize: "80%",
    bgPosition: "center 10%",
    blend: true,
    contacts: {
      email: "nextstep.tup@gmail.com",
      linkedin: "https://linkedin.com/in/bharathkumar",
      phone: "+911234567890",
    },
  },
  {
    name: "GOWTHAM.P",
    role: "Managing Director",
    description:
      "Tech enthusiast with expertise in connecting talented professionals with the right opportunities across the IT industry. Specializes in AI, cloud computing, and enterprise software placement.",
    image: gowthamPhoto,
    bgSize: "cover",
    bgPosition: "center top",
    contacts: {
      email: "nextstep.tup@gmail.com",
      linkedin: "https://linkedin.com/in/gowtham",
      phone: "+911234567891",
    },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Leadership() {
  return (
    <section id="leadership" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-black">
            Our Leadership
          </h2>
          <p className="mt-4 text-lg text-[#666666] max-w-2xl mx-auto">
            Meet the team driving innovation and growth at NEXT STEP
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {leaders.map((leader, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              variants={itemVariants}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center">
                  <div
                    className="flex-shrink-0 h-48 w-48 mb-4 md:mb-0 md:mr-6 rounded-lg shadow-md bg-white"
                    style={{
                      backgroundImage: leader.blend
                        ? `radial-gradient(ellipse at center, transparent 40%, white 100%), url(${leader.image})`
                        : `url(${leader.image})`,
                      backgroundSize: leader.blend
                        ? `100%, ${leader.bgSize}`
                        : leader.bgSize,
                      backgroundPosition: leader.blend
                        ? `center, ${leader.bgPosition}`
                        : leader.bgPosition,
                      backgroundRepeat: "no-repeat",
                    }}
                    aria-label={`${leader.name} profile`}
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold font-['Poppins'] text-black">
                      {leader.name}
                    </h3>
                    <p className="text-[#0073b1] font-medium my-1">
                      {leader.role}
                    </p>
                    <p className="text-[#666666] mt-3">{leader.description}</p>
                    <div className="mt-4 flex items-center space-x-4">
                      <a
                        href={`mailto:${leader.contacts.email}`}
                        className="text-[#333333] hover:text-[#0073b1] transition-colors"
                      >
                        <i className="fas fa-envelope text-lg"></i>
                      </a>
                      <a
                        href={leader.contacts.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#333333] hover:text-[#0073b1] transition-colors"
                      >
                        <i className="fab fa-linkedin text-lg"></i>
                      </a>
                      <a
                        href={`tel:${leader.contacts.phone}`}
                        className="text-[#333333] hover:text-[#0073b1] transition-colors"
                      >
                        <i className="fas fa-phone text-lg"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
