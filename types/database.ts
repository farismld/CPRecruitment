export type NewsStatus = "draft" | "published";
export type JobStatus = "draft" | "active" | "closed";
export type EmploymentType = "Full-time" | "Part-time" | "Kontrak" | "Magang" | "Freelance";
export type ApplicantStatus =
  | "Baru"
  | "Seleksi Administrasi"
  | "Diproses"
  | "Interview"
  | "Lulus"
  | "Tidak Lulus";
export type Gender = "Laki-laki" | "Perempuan";

export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  category: string;
  author: string;
  status: NewsStatus;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employment_type: EmploymentType;
  description: string;
  requirements: string;
  deadline: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  applicant_count?: number;
}

export interface Applicant {
  id: string;
  application_number: string;
  job_id: string;
  full_name: string;
  nik: string;
  birth_place: string;
  birth_date: string;
  gender: Gender;
  address: string;
  city: string;
  phone: string;
  email: string;
  education: string;
  institution: string;
  major: string;
  graduation_year: number;
  work_experience: string | null;
  skills: string | null;
  certifications: string | null;
  source: string | null;
  cv_url: string;
  cover_letter_url: string | null;
  certificate_url: string | null;
  status: ApplicantStatus;
  created_at: string;
  updated_at: string;
  jobs?: Pick<Job, "id" | "title" | "slug">;
}

export interface AdminProfile {
  id: string;
  full_name: string;
  role: "admin" | "super_admin";
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      news: {
        Row: News;
        Insert: Partial<News> & { title: string; slug: string; content: string; excerpt: string };
        Update: Partial<News>;
      };
      jobs: {
        Row: Job;
        Insert: Partial<Job> & {
          title: string;
          slug: string;
          department: string;
          location: string;
          description: string;
          requirements: string;
          deadline: string;
        };
        Update: Partial<Job>;
      };
      applicants: {
        Row: Applicant;
        Insert: Partial<Applicant> & {
          job_id: string;
          full_name: string;
          nik: string;
          birth_place: string;
          birth_date: string;
          gender: Gender;
          address: string;
          city: string;
          phone: string;
          email: string;
          education: string;
          institution: string;
          major: string;
          graduation_year: number;
          cv_url: string;
        };
        Update: Partial<Applicant>;
      };
      admin_profiles: {
        Row: AdminProfile;
        Insert: Partial<AdminProfile> & { id: string; full_name: string };
        Update: Partial<AdminProfile>;
      };
    };
  };
}
