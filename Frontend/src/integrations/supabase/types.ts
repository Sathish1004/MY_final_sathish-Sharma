export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          excerpt: string | null
          id: string
          published_at: string
          thumbnail_url: string | null
          title: string
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string
          thumbnail_url?: string | null
          title: string
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string
          thumbnail_url?: string | null
          title?: string
          views_count?: number | null
        }
        Relationships: []
      }
      course_progress: {
        Row: {
          completed: boolean | null
          course_id: string
          id: string
          last_accessed: string | null
          progress_percentage: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          course_id: string
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          course_id?: string
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: string | null
          duration_hours: number | null
          id: string
          lessons_count: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          duration_hours?: number | null
          id?: string
          lessons_count?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          duration_hours?: number | null
          id?: string
          lessons_count?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          event_type: string
          id: string
          location: string | null
          max_participants: number | null
          registration_link: string | null
          start_date: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type: string
          id?: string
          location?: string | null
          max_participants?: number | null
          registration_link?: string | null
          start_date: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          location?: string | null
          max_participants?: number | null
          registration_link?: string | null
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          description: string | null
          feedback_type: string
          id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          feedback_type: string
          id?: string
          rating?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          feedback_type?: string
          id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company: string
          created_by: string | null
          deadline: string | null
          description: string | null
          id: string
          is_internship: boolean | null
          job_type: string
          location: string | null
          posted_at: string
          requirements: string[] | null
          stipend: string | null
          title: string
          work_mode: string | null
        }
        Insert: {
          company: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          is_internship?: boolean | null
          job_type: string
          location?: string | null
          posted_at?: string
          requirements?: string[] | null
          stipend?: string | null
          title: string
          work_mode?: string | null
        }
        Update: {
          company?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          is_internship?: boolean | null
          job_type?: string
          location?: string | null
          posted_at?: string
          requirements?: string[] | null
          stipend?: string | null
          title?: string
          work_mode?: string | null
        }
        Relationships: []
      }
      mentor_bookings: {
        Row: {
          created_at: string
          id: string
          mentor_id: string
          notes: string | null
          slot_time: string
          status: string | null
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentor_id: string
          notes?: string | null
          slot_time: string
          status?: string | null
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mentor_id?: string
          notes?: string | null
          slot_time?: string
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_bookings_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          available_slots: Json | null
          bio: string | null
          experience_years: number | null
          id: string
          rating: number | null
          specialization: string[] | null
          total_sessions: number | null
          user_id: string
        }
        Insert: {
          available_slots?: Json | null
          bio?: string | null
          experience_years?: number | null
          id?: string
          rating?: number | null
          specialization?: string[] | null
          total_sessions?: number | null
          user_id: string
        }
        Update: {
          available_slots?: Json | null
          bio?: string | null
          experience_years?: number | null
          id?: string
          rating?: number | null
          specialization?: string[] | null
          total_sessions?: number | null
          user_id?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string
          content: string | null
          created_by: string | null
          id: string
          image_url: string | null
          published_at: string
          source_url: string | null
          title: string
        }
        Insert: {
          category: string
          content?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          source_url?: string | null
          title: string
        }
        Update: {
          category?: string
          content?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          has_internship: boolean | null
          id: string
          participants_count: number | null
          submission_link: string | null
          team_members: string[] | null
          tech_stack: string[] | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          has_internship?: boolean | null
          id?: string
          participants_count?: number | null
          submission_link?: string | null
          team_members?: string[] | null
          tech_stack?: string[] | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          has_internship?: boolean | null
          id?: string
          participants_count?: number | null
          submission_link?: string | null
          team_members?: string[] | null
          tech_stack?: string[] | null
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "trainer" | "mentor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "trainer", "mentor", "admin"],
    },
  },
} as const
