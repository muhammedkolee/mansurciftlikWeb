export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.18" };
  public: {
    Tables: {
      fields: {
        Row: {
          created_at: string;
          description: string | null;
          geometry: unknown;
          id: string;
          name: string | null;
          owner_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          geometry: unknown;
          id?: string;
          name?: string | null;
          owner_id?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          geometry?: unknown;
          id?: string;
          name?: string | null;
          owner_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      plantings: {
        Row: {
          amount_kg: number | null;
          created_at: string;
          crop_name: string | null;
          field_id: string;
          id: string;
          is_current: boolean;
          planted_at: string | null;
          season: string | null;
          updated_at: string;
        };
        Insert: {
          amount_kg?: number | null;
          created_at?: string;
          crop_name?: string | null;
          field_id: string;
          id?: string;
          is_current?: boolean;
          planted_at?: string | null;
          season?: string | null;
          updated_at?: string;
        };
        Update: {
          amount_kg?: number | null;
          created_at?: string;
          crop_name?: string | null;
          field_id?: string;
          id?: string;
          is_current?: boolean;
          planted_at?: string | null;
          season?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "plantings_field_id_fkey";
            columns: ["field_id"];
            isOneToOne: false;
            referencedRelation: "fields";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "plantings_field_id_fkey";
            columns: ["field_id"];
            isOneToOne: false;
            referencedRelation: "fields_with_current_planting";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      fields_with_current_planting: {
        Row: {
          amount_kg: number | null;
          area_sqm: number | null;
          created_at: string | null;
          crop_name: string | null;
          description: string | null;
          geometry: Json | null;
          id: string | null;
          name: string | null;
          owner_id: string | null;
          planted_at: string | null;
          planting_id: string | null;
          season: string | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      create_field_with_planting: {
        Args: {
          p_amount_kg?: number;
          p_crop_name?: string;
          p_description?: string;
          p_geometry: Json;
          p_name?: string;
          p_planted_at?: string;
        };
        Returns: string;
      };
      create_planting_record: {
        Args: {
          p_amount_kg: number | null;
          p_crop_name: string | null;
          p_field_id: string;
          p_planted_at: string | null;
          p_season: string | null;
        };
        Returns: string;
      };
      update_field_with_planting: {
        Args: {
          p_amount_kg?: number;
          p_crop_name?: string;
          p_description?: string;
          p_field_id: string;
          p_geometry: Json;
          p_name?: string;
          p_planted_at?: string;
        };
        Returns: undefined;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
