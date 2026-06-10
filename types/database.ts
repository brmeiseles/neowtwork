export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          sort_order: number;
          category: string | null;
          icon_path: string | null;
        };
        Insert: {
          id: string;
          slug: string;
          title: string;
          description: string;
          sort_order: number;
          category?: string | null;
          icon_path?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          sort_order?: number;
          category?: string | null;
          icon_path?: string | null;
        };
        Relationships: [];
      };
      completions: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          proof_image_url: string | null;
          seed: string | null;
          ascension: number;
          notes: string | null;
          completed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          proof_image_url?: string | null;
          seed?: string | null;
          ascension: number;
          notes?: string | null;
          completed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          proof_image_url?: string | null;
          seed?: string | null;
          ascension?: number;
          notes?: string | null;
          completed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "completions_achievement_id_fkey";
            columns: ["achievement_id"];
            isOneToOne: false;
            referencedRelation: "achievements";
            referencedColumns: ["id"];
          },
        ];
      };
      friends: {
        Row: {
          id: string;
          user_id: string;
          friend_user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          friend_user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
