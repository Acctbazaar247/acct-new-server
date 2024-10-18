import { BusinessKyc, singleBeneficialOwners } from '@prisma/client';
export type IBusinessKycFilters = {
  searchTerm?: string;
  email?: string;
};
export type FullBusinessKyc = {
  beneficialOwner: singleBeneficialOwners[];
} & BusinessKyc;
