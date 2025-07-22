export interface RawBlockData {
  blockID: string;
  block_header: {
    raw_data: {
      number: number;
      timestamp: number;
      witness_address: string;
      size: number;
      version: number;
    };
  };
  transactions?: Array<{
    txID: string;
    raw_data: {
      contract: Array<{
        type: string;
        parameter: {
          value: {
            owner_address: string;
            to_address: string;
            amount: number;
          };
        };
      }>;
      timestamp: number;
    };
  }>;
  confirmed: number;
}