export type OrgEvent = {
  id: number;
  name: string;
  location: string;
  date: string;
  time: string;
  total: number;
  sold: number;
  reserved: number;
  invited: number;
  revenue: number;
  status: "active" | "paused" | "past";
  expanded: boolean;
  image?: string;
};
