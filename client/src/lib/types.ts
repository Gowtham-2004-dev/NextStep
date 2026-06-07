export interface Leader {
  name: string;
  role: string;
  description: string;
  image: string;
  contacts: {
    email: string;
    linkedin: string;
    phone: string;
  };
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
}

export interface ResumeFormData {
  name: string;
  degree: string;
  email: string;
  phone: string;
  resume?: File;
  notes?: string;
}
