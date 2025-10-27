export interface Review 
{
  id?: bigint; //supabase will create this
  title: string;
  content: string;
  rating?: number;
  academics?: number;
  social?: number;
  food?: number;
  housing?: number;
  career?: number;
  tags: string[];
  major?: string;
  authorId: string;
  schoolId: string;

}


