import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResumeFormData } from "@/lib/types";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  degree: z.string().min(2, { message: "Degree must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  notes: z.string().optional(),
  resume: z.any()
    .refine((file) => file && file.length > 0, {
      message: "Resume file is required",
    })
    .refine((file) => file && file[0]?.size <= 10 * 1024 * 1024, {
      message: "Resume file must be less than 10MB",
    })
    .refine(
      (file) => {
        if (!file || file.length === 0) return true;
        const fileType = file[0]?.name.split('.').pop().toLowerCase();
        return ['pdf', 'doc', 'docx'].includes(fileType);
      },
      {
        message: "Resume must be a PDF, DOC, or DOCX file",
      }
    )
});

export default function ResumeForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      degree: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const onSubmit = async (data: ResumeFormData) => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("degree", data.degree);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      
      if (data.notes) {
        formData.append("notes", data.notes);
      }
      
      if (data.resume && data.resume.length > 0) {
        formData.append("resume", data.resume[0]);
      }
      
      const response = await fetch("/api/submit-resume", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit resume");
      }
      
      // Reset form on success
      form.reset();
      setFileName(null);
      
      // Check if email was sent successfully
      if (responseData.emailStatus && responseData.emailStatus.sent) {
        toast({
          title: "Resume Submitted",
          description: "Thank you! Your resume has been submitted successfully and sent to nextstep.tup@gmail.com. Our team will contact you soon.",
          variant: "default",
        });
      } else {
        // Email failed but data was saved
        toast({
          title: "Resume Submitted",
          description: "Thank you! Your resume has been saved successfully. However, there was an issue sending the email notification. Don't worry, our team will still review your application.",
          variant: "default",
        });
        
        console.log("Email notification failed but resume was saved:", responseData.emailStatus?.error);
      }
    } catch (error) {
      console.error("Error submitting resume:", error);
      setSubmissionError(error instanceof Error ? error.message : "An unexpected error occurred");
      
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      form.setValue("resume", files);
      setFileName(files[0].name);
    } else {
      form.setValue("resume", undefined);
      setFileName(null);
    }
  };

  return (
    <section id="submit" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-black">Submit Your Resume</h2>
          <p className="mt-4 text-lg text-[#666666] max-w-2xl mx-auto">
            Let our AI-powered system match you with the perfect IT position
          </p>
          <div className="mt-4 flex justify-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-3 text-sm text-blue-700 max-w-2xl">
              <p className="font-medium">Your information will be sent directly to our recruitment team at <span className="font-bold">nextstep.tup@gmail.com</span> for personalized job matching.</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 rounded-xl p-6 md:p-10 shadow-lg">
            {submissionError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{submissionError}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field} 
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-[#0073b1] focus:ring-2 focus:ring-[#0073b1]/20 transition-all outline-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Degree Field */}
                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Degree/Qualification</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="B.Tech Computer Science" 
                            {...field} 
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-[#0073b1] focus:ring-2 focus:ring-[#0073b1]/20 transition-all outline-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="youremail@example.com" 
                            {...field} 
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-[#0073b1] focus:ring-2 focus:ring-[#0073b1]/20 transition-all outline-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Phone Field */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="+91 1234567890" 
                            {...field} 
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-[#0073b1] focus:ring-2 focus:ring-[#0073b1]/20 transition-all outline-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Resume Upload */}
                <div className="relative">
                  <FormLabel className="block text-sm font-medium text-[#333333] mb-1">Upload Resume</FormLabel>
                  <div 
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#0073b1]/60 transition-all cursor-pointer bg-white"
                    onClick={() => document.getElementById('resume')?.click()}
                  >
                    <div className="space-y-1 text-center">
                      <i className="fas fa-file-upload text-4xl text-gray-400"></i>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="resume" className="relative cursor-pointer rounded-md font-medium text-[#0073b1] hover:text-[#0073b1]/80 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input 
                            id="resume" 
                            name="resume" 
                            type="file" 
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                    </div>
                  </div>
                  {fileName && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected file: <span className="font-medium text-[#0073b1]">{fileName}</span>
                    </div>
                  )}
                  {form.formState.errors.resume && (
                    <p className="mt-1 text-sm text-red-500">{form.formState.errors.resume.message as string}</p>
                  )}
                </div>
                
                {/* Additional Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#333333]">Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your preferred roles, experience, or any other relevant information" 
                          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-[#0073b1] focus:ring-2 focus:ring-[#0073b1]/20 transition-all outline-none"
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Submit Button */}
                <div className="flex items-center justify-center pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#0073b1] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0073b1] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    {isSubmitting ? "Submitting..." : "Submit Resume"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="mt-10">
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-black mb-3">Sectors We Specialize In</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <i className="fas fa-tshirt text-[#0073b1] mr-2"></i>
                  <span>Textile</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-hard-hat text-[#0073b1] mr-2"></i>
                  <span>Construction</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-[#0073b1] mr-2"></i>
                  <span>Security</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-laptop-code text-[#0073b1] mr-2"></i>
                  <span>IT</span>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-[#666666]">
                <i className="fas fa-shield-alt text-[#0073b1] mr-2"></i>
                <span className="text-sm">Your data is secure and will only be used for job referrals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
