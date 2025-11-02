export interface SchoolData {
  id: string;
  school: {
    name: string;
    alias?: string;
    city: string;
    state: string;
    school_url?: string;
  };
}
