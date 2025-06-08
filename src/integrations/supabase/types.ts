export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          amount: number | null
          client_notification_id: string | null
          created_at: string
          customer_name: string | null
          date: string
          email: string | null
          end_time: string
          id: string
          is_priority: boolean | null
          message: string | null
          notification_id: string | null
          payment_link: string | null
          payment_method: string | null
          payment_status: string
          start_time: string
          stripe_session_id: string | null
          team_notification_id: string | null
          topic: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          client_notification_id?: string | null
          created_at?: string
          customer_name?: string | null
          date: string
          email?: string | null
          end_time: string
          id?: string
          is_priority?: boolean | null
          message?: string | null
          notification_id?: string | null
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string
          start_time: string
          stripe_session_id?: string | null
          team_notification_id?: string | null
          topic: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          client_notification_id?: string | null
          created_at?: string
          customer_name?: string | null
          date?: string
          email?: string | null
          end_time?: string
          id?: string
          is_priority?: boolean | null
          message?: string | null
          notification_id?: string | null
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string
          start_time?: string
          stripe_session_id?: string | null
          team_notification_id?: string | null
          topic?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_notification_id_fkey"
            columns: ["client_notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_team_notification_id_fkey"
            columns: ["team_notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      failed_emails: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          recipient: string
          subject: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          recipient: string
          subject: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          recipient?: string
          subject?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          read: boolean | null
          recipient_email: string
          sender_email: string
          sent: boolean | null
          subject: string
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read?: boolean | null
          recipient_email: string
          sender_email: string
          sent?: boolean | null
          subject: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read?: boolean | null
          recipient_email?: string
          sender_email?: string
          sent?: boolean | null
          subject?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          price: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          price: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          price?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      paiement: {
        Row: {
          attrs: Json | null
          business_type: string | null
          country: string | null
          created: string | null
          email: string | null
          id: string | null
          type: string | null
        }
        Insert: {
          attrs?: Json | null
          business_type?: string | null
          country?: string | null
          created?: string | null
          email?: string | null
          id?: string | null
          type?: string | null
        }
        Update: {
          attrs?: Json | null
          business_type?: string | null
          country?: string | null
          created?: string | null
          email?: string | null
          id?: string | null
          type?: string | null
        }
        Relationships: []
      }
      political_launch_applications: {
        Row: {
          admin_response: string | null
          age_group: string
          city_country: string
          coaching_experience: string
          comfort_options: string[] | null
          contact_preference: string
          created_at: string
          desired_transformation: string
          discovery_channel: string
          email: string
          format_preference: string
          full_name: string
          gender: string
          id: string
          leadership_qualities: string
          obstacles: string[] | null
          other_discovery_channel: string | null
          other_obstacles: string | null
          other_personal_situation: string | null
          other_political_situation: string | null
          other_profile: string | null
          payment_link: string | null
          payment_method: string
          payment_option: string
          personal_situation: string[]
          phone: string
          political_situation: string[]
          preferred_start_date: string | null
          preferred_topic: string
          professional_profile: string
          proposed_schedule: Json | null
          schedule_validated: boolean | null
          social_media: string
          start_period: string
          status: string
          updated_at: string
          why_collaboration: string
        }
        Insert: {
          admin_response?: string | null
          age_group: string
          city_country: string
          coaching_experience: string
          comfort_options?: string[] | null
          contact_preference: string
          created_at?: string
          desired_transformation: string
          discovery_channel: string
          email: string
          format_preference: string
          full_name: string
          gender: string
          id?: string
          leadership_qualities: string
          obstacles?: string[] | null
          other_discovery_channel?: string | null
          other_obstacles?: string | null
          other_personal_situation?: string | null
          other_political_situation?: string | null
          other_profile?: string | null
          payment_link?: string | null
          payment_method: string
          payment_option: string
          personal_situation: string[]
          phone: string
          political_situation: string[]
          preferred_start_date?: string | null
          preferred_topic: string
          professional_profile: string
          proposed_schedule?: Json | null
          schedule_validated?: boolean | null
          social_media: string
          start_period: string
          status?: string
          updated_at?: string
          why_collaboration: string
        }
        Update: {
          admin_response?: string | null
          age_group?: string
          city_country?: string
          coaching_experience?: string
          comfort_options?: string[] | null
          contact_preference?: string
          created_at?: string
          desired_transformation?: string
          discovery_channel?: string
          email?: string
          format_preference?: string
          full_name?: string
          gender?: string
          id?: string
          leadership_qualities?: string
          obstacles?: string[] | null
          other_discovery_channel?: string | null
          other_obstacles?: string | null
          other_personal_situation?: string | null
          other_political_situation?: string | null
          other_profile?: string | null
          payment_link?: string | null
          payment_method?: string
          payment_option?: string
          personal_situation?: string[]
          phone?: string
          political_situation?: string[]
          preferred_start_date?: string | null
          preferred_topic?: string
          professional_profile?: string
          proposed_schedule?: Json | null
          schedule_validated?: boolean | null
          social_media?: string
          start_period?: string
          status?: string
          updated_at?: string
          why_collaboration?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          content_url: string | null
          created_at: string
          description: string | null
          duration: string | null
          id: string
          pages: number | null
          price: number
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content_url?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          pages?: number | null
          price: number
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content_url?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          pages?: number | null
          price?: number
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          created_at: string
          id: string
          payment_method: string | null
          payment_status: string
          product_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          payment_method?: string | null
          payment_status?: string
          product_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          payment_method?: string | null
          payment_status?: string
          product_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          monthly_price: number
          start_date: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          monthly_price: number
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          monthly_price?: number
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_emails: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      temp_bookings_data: {
        Row: {
          booking_data: Json
          created_at: string
          id: string
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          booking_data: Json
          created_at?: string
          id?: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          booking_data?: Json
          created_at?: string
          id?: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      temp_subscriptions: {
        Row: {
          created_at: string
          id: string
          stripe_session_id: string | null
          subscription_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          stripe_session_id?: string | null
          subscription_data: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          stripe_session_id?: string | null
          subscription_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean | null
          created_at: string | null
          email: string | null
          id: string
          message: string
          name: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          message: string
          name: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string
          name?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          available: boolean | null
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_recurring: boolean | null
          specific_date: string | null
          start_time: string
          updated_at: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_recurring?: boolean | null
          specific_date?: string | null
          start_time: string
          updated_at?: string
        }
        Update: {
          available?: boolean | null
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_recurring?: boolean | null
          specific_date?: string | null
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      pending_testimonials: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          message: string | null
          name: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          message?: string | null
          name?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          message?: string | null
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      priority_bookings: {
        Row: {
          amount: number | null
          created_at: string | null
          date: string | null
          end_time: string | null
          id: string | null
          is_priority: boolean | null
          message: string | null
          payment_link: string | null
          payment_method: string | null
          payment_status: string | null
          start_time: string | null
          stripe_session_id: string | null
          topic: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          end_time?: string | null
          id?: string | null
          is_priority?: boolean | null
          message?: string | null
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string | null
          start_time?: string | null
          stripe_session_id?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          end_time?: string | null
          id?: string | null
          is_priority?: boolean | null
          message?: string | null
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string | null
          start_time?: string | null
          stripe_session_id?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      create_bookings_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_helper_functions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_temp_bookings_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
