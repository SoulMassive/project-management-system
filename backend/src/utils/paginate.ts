export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const paginate = async (model: any, query: any, options: PaginationOptions = {}) => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, options.limit || 10);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    model.countDocuments(query)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages
    }
  };
};
