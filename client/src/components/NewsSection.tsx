import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NewsItem } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsSection() {
  const { data: newsItems, isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="news" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-black">Latest IT Industry News</h2>
          <p className="mt-4 text-lg text-[#666666] max-w-2xl mx-auto">
            Stay updated with the latest trends and opportunities in the IT industry for 2025
          </p>
          <div className="mt-4 inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-blue-700 text-sm font-medium">Updated March 2025 - Latest industry trends and hiring patterns</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-white rounded-xl shadow">
            <p className="text-red-500">Failed to load news items. Please try again later.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {newsItems?.map((item) => (
              <NewsCard key={item.id} item={item} variants={itemVariants} />
            ))}
          </motion.div>
        )}
        
        <div className="mt-12 text-center">
          <a href="#" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#0073b1] bg-white shadow-sm hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0073b1] transition-all duration-300">
            View All News
            <i className="fas fa-chevron-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
}

function NewsCard({ item, variants }: { item: NewsItem; variants: any }) {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    console.log("Image failed to load:", item.imageUrl);
    setImageError(true);
  };
  
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
      variants={variants}
    >
      <div className="relative">
        {!imageError ? (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-52 object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Image unavailable</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold uppercase rounded-full px-3 py-1 shadow-md">
          Latest
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-[#0073b1] text-sm mb-3">
          <i className="far fa-calendar-alt mr-2"></i>
          <span className="font-medium">{item.date}</span>
        </div>
        <h3 className="text-xl font-bold font-['Poppins'] text-black mb-3 line-clamp-2">{item.title}</h3>
        <p className="text-[#666666] mb-4 flex-1">{item.content}</p>
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button 
            className="inline-flex items-center text-[#0073b1] font-medium hover:text-blue-700 transition-colors group"
            onClick={(e) => {
              e.preventDefault();
              alert(`Full article: ${item.title}`);
            }}
          >
            Read full article
            <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col h-full">
      <div className="relative">
        <Skeleton className="w-full h-52" />
        <div className="absolute top-4 right-4 w-16 h-6">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center mb-3">
          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-full mt-2 mb-3" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-full mt-1" />
        <Skeleton className="h-4 w-3/4 mt-1 mb-4" />
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Skeleton className="h-5 w-36 mt-2" />
        </div>
      </div>
    </div>
  );
}
