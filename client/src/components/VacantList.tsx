import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ChevronRight } from "lucide-react";

export interface Vacancy {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  skills: string[];
  postedDate: string;
}

const vacancies: Vacancy[] = [];

export default function VacantList() {
  return (
    <section id="vacancies" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-black">
            Current Openings
          </h2>
          <p className="mt-4 text-lg text-[#666666] max-w-2xl mx-auto">
            Explore the latest job opportunities curated by NEXT STEP across top
            IT companies
          </p>
        </div>

        {vacancies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#0073b1]/10 flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-[#0073b1]" />
            </div>
            <h3 className="text-2xl font-semibold font-['Poppins'] text-black mb-3">
              New Opportunities Coming Soon
            </h3>
            <p className="text-[#666666] max-w-md">
              We're actively sourcing roles across multiple sectors. Submit your resume now and
              we'll match you with openings as they become available.
            </p>
            <a
              href="#submit"
              className="mt-8 inline-flex items-center gap-2 bg-[#0073b1] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#005f91] transition-colors"
            >
              Submit Your Resume <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {vacancies.map((vacancy, index) => (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#0073b1]/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-['Poppins'] text-black">
                      {vacancy.title}
                    </h3>
                    <p className="text-[#0073b1] font-medium mt-1">
                      {vacancy.company}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#666666]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {vacancy.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" /> {vacancy.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {vacancy.experience}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {vacancy.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-100 text-[#333333] text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-3">
                    <span className="text-xs text-[#666666]">
                      Posted {vacancy.postedDate}
                    </span>
                    <a
                      href="#submit"
                      className="inline-flex items-center gap-2 bg-[#0073b1] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#005f91] transition-colors"
                    >
                      Apply Now <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
