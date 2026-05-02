export interface Restaurant {
  id: string;
  name: string;
  city: string;
  link: string;
  expectedOpen: boolean;
  isOpen: boolean;
  mismatch: boolean;
}

export interface Trend {
  timestamp: string;
  expected_open: number;
  actual_open: number;
  mismatch: number;
}