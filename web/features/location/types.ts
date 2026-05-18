export interface StateData {
  code: string;
  name: string;
  slug: string;
  kwhCents: number;
  gasDollar: number;
  hasTOU: boolean;
  evFee: number;
  touCents?: number;
  incentiveNote?: string;
}

export interface LocationState {
  stateCode: string | null;
  zip: string | null;
  data: StateData;
  isDetecting: boolean;
}
