import {
  BusinessKyc,
  EBadge,
  EStatusOfKyc,
  Prisma,
  UserRole,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import genericEmailTemplate from '../../../shared/GenericEmailTemplates';
import prisma from '../../../shared/prisma';
import { businessKycSearchableFields } from './businessKyc.constant';
import { FullBusinessKyc, IBusinessKycFilters } from './businessKyc.interface';

const getAllBusinessKyc = async (
  filters: IBusinessKycFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<BusinessKyc[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, email, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = businessKycSearchableFields.map(single => {
      const query = {
        [single]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      };
      return query;
    });
    andCondition.push({
      OR: searchAbleFields,
    });
  }
  if (email) {
    const emailQuery: Prisma.BusinessKycWhereInput = {
      AND: {
        ownBy: {
          email,
        },
      },
    };
    andCondition.push(emailQuery);
  }
  if (Object.keys(filters).length) {
    andCondition.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.BusinessKycWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.businessKyc.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    include: {
      ownBy: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImg: true,
          phoneNumber: true,
        },
      },
      beneficialOwner: true,
    },
  });
  const total = await prisma.businessKyc.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createBusinessKyc = async (
  payload: FullBusinessKyc
): Promise<BusinessKyc | null> => {
  const isExits = await prisma.businessKyc.findUnique({
    where: { ownById: payload.ownById },
    select: { id: true },
  });
  if (isExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Business Kyc Already exits');
  }
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  // const {beneficialOwner,...rest}=payload
  // const result= await prisma.$transaction(async (tx)=>{
  //   const businessKyc= await tx.businessKyc.create({data:{}})
  // })
  // payload.beneficialOwner>>
  const beneficialOwner = payload.beneficialOwner;
  const data = {
    ...payload,
    beneficialOwner: {
      create: beneficialOwner,
    },
  };

  const newKyc = await prisma.businessKyc.create({
    data,
    include: {
      beneficialOwner: true,
    },
  });
  return newKyc;
};

const getSingleBusinessKyc = async (
  id: string
): Promise<BusinessKyc | null> => {
  const result = await prisma.businessKyc.findUnique({
    where: {
      id,
    },
    include: {
      beneficialOwner: true,
    },
  });
  return result;
};
const getSingleBusinessKycOfUser = async (
  id: string
): Promise<BusinessKyc | null> => {
  const result = await prisma.businessKyc.findUnique({
    where: {
      ownById: id,
    },
    include: {
      beneficialOwner: true,
    },
  });
  return result;
};

const updateBusinessKyc = async (
  id: string,
  payload: Partial<FullBusinessKyc>,
  requestedUserId: string
): Promise<BusinessKyc | null> => {
  const requestedUser = await prisma.user.findUnique({
    where: { id: requestedUserId },
    select: {
      role: true,
      id: true,
    },
  });
  if (!requestedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const isKycExits = await prisma.businessKyc.findUnique({
    where: { id },
    select: {
      id: true,
      ownById: true,
      businessName: true,
      ownBy: { select: { name: true, email: true } },
    },
  });
  if (!isKycExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Kyc not found!');
  }
  const isSeller = requestedUser.role === UserRole.seller;
  const isWantToUpdateStatus = payload.status === EStatusOfKyc.approved;
  if (isSeller && isWantToUpdateStatus) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You can not able to update this businessKyc!'
    );
  }
  // check is own by this seller
  if (isSeller) {
    if (isKycExits.ownById !== requestedUser.id) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You can not able to update this businessKyc!'
      );
    }
  }
  const byAdmin = requestedUser.role === UserRole.superAdmin;
  const statusIsApprove = payload.status === EStatusOfKyc.approved;
  if (byAdmin && statusIsApprove) {
    const result = await prisma.$transaction(async tx => {
      await tx.user.update({
        where: { id: isKycExits.ownById },
        data: {
          isVerifiedByAdmin: true,
          isBusinessVerified: true,
          badge: EBadge.blue,
          userName: isKycExits.businessName,
        },
      });
      const updatedKyc = await tx.businessKyc.update({
        where: { id },
        data: payload as BusinessKyc,
      });
      return updatedKyc;
    });
    genericEmailTemplate({
      subject: `KYC Verification Approved`,
      title: `Hey ${isKycExits.ownBy.name}`,
      email: isKycExits.ownBy.email,
      description: `
       Congratulations! Your Business KYC verification has been approved.
        `,
    });
    return result;
  }
  if (byAdmin && payload.status === EStatusOfKyc.denied) {
    genericEmailTemplate({
      subject: `KYC Verification Denied`,
      title: `Hey ${isKycExits.ownBy.name}`,
      email: isKycExits.ownBy.email,
      description: `
       We regret to inform you that your KYC verification has been denied. Please review the submission requirements and try again.
        `,
    });
  }
  // if (statusIsApprove) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot update status');
  // }
  if (payload.beneficialOwner) {
    const result = prisma.$transaction(async tx => {
      // delete previous all <br />
      await tx.singleBeneficialOwners.deleteMany({
        where: { businessKycId: payload.id },
      });

      return await tx.businessKyc.update({
        where: {
          id,
        },
        data: {
          ...payload,
          beneficialOwner: {
            create: payload.beneficialOwner,
          },
        },
      });
    });
    return result;
  }
  const result = await prisma.businessKyc.update({
    where: {
      id,
    },
    data: payload as BusinessKyc,
  });
  return result;
};

const deleteBusinessKyc = async (id: string): Promise<BusinessKyc | null> => {
  const isKycExits = await prisma.businessKyc.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (isKycExits && isKycExits.status === 'approved') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'you cannot delete approved businessKyc'
    );
  }
  const result = await prisma.businessKyc.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kyc not found!');
  }
  return result;
};

export const BusinessKycService = {
  getAllBusinessKyc,
  createBusinessKyc,
  updateBusinessKyc,
  getSingleBusinessKyc,
  deleteBusinessKyc,
  getSingleBusinessKycOfUser,
};
