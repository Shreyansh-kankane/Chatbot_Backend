const prisma = require('../utils/prisma');


type CreateWebModelInput = {
  namespace: string;
  URL: string;
  firstName: string;
  lastName: string;
  mobile?: string;
  city?: string;
  postalCode?: string;
  streetAddress?: string;
  country?: string;
  region?: string;
  about?: string;
};

/**
 * Create a new record in the WebModel table.
 * @param {Object} data - The data to insert into the WebModel table.
 * @returns {Promise<Object>} The created WebModel record.
 */

export const createWebModel = async (data: CreateWebModelInput): Promise<Object> => {
  return await prisma.webModel.create({ data });
};


/**
 * Find a WebModel record by namespace.
 * @param {String} namespace - The namespace to search for.
 * @returns {Promise<Object|null>} The WebModel record or null if not found.
 */
export const findWebModelByNamespace = async (namespace : String) => {
  return await prisma.webModel.findUnique({ where: { namespace } });
};

/**
 * Retrieve all records from the WebModel table.
 * @returns {Promise<Array>} An array of WebModel records.
 */
export const getAllWebModels = async () => {
  return await prisma.webModel.findMany();
};


