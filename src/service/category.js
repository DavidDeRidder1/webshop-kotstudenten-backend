const { getLogger } = require("../core/logging");
const {PrismaClient} = require("@prisma/client");
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');

const prisma = new PrismaClient();

const getAll = async() => {
  const categories = await prisma.category.findMany();
  return {items: categories}
}

const getById = async(id) => {
  const category = await prisma.category.findUnique({
    where: {
      id: id
    }
  })

  if(!category) {
    throw ServiceError.notFound(`Category with id ${id} not found`);
  }

  return category;
}

const create = async(name) => {
  if(!name) {
    getLogger().error('Missing required parameters');
    throw ServiceError.validationFailed('Missing required parameters');
  }
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: name,
    },
  });

  if (existingCategory) {
    getLogger().error(`Category with name '${name}' already exists`);
    throw ServiceError.validationFailed(`Category with name '${name}' already exists`);
  }

  try {
  const newCategory = await prisma.category.create({
    data: {
      name: name
    }
  })
  return newCategory;
  } catch (error) {
    throw handleDBError(error)
  }
}

const getProductsPerCategory = async(id) => {
  
  const productsPerCategory = await prisma.product.findMany({
    where: {
      categoryId: id
    },
    include: {
      postedBy: {
        select: {
          id: true,
          firstName: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const items = productsPerCategory.map((product) => {
    return {
      id: product.id,
      title: product.title,
      picture: product.picture,
      description: product.description,
      price: product.price,
      bought: product.bought,
      user: {
        id: product.postedBy.id,
        name: product.postedBy.firstName,
      },
      category: {
        id: product.category.id,
        name: product.category.name,
      },
    };
  });

  return { items, count: items.length };
};


module.exports = {
  getAll,
  getById,
  create,
  getProductsPerCategory,
};