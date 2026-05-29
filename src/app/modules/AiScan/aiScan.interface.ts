import { Types } from 'mongoose';

export type TAiScanKind = 'identify' | 'diagnose';

export type TAiScan = {
  user: Types.ObjectId;
  kind: TAiScanKind;
  imageUrl?: string;
  hint?: string;
  // result is the raw JSON returned by the AI service — flexible by design.
  // We deliberately don't constrain its shape so the model can evolve
  // without a migration.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
  createdAt?: Date;
  updatedAt?: Date;
};
