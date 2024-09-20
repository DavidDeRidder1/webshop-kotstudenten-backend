const { getLogger } = require("../core/logging");
const {main} = require("../data/index");
const {PrismaClient} = require("@prisma/client");
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');

const prisma = new PrismaClient();


const getAll = async () => {
  const productsWithUserAndCategory = await prisma.product.findMany({
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

  const items = productsWithUserAndCategory.map((product) => {
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

const getById = async (id) => {
  const productWithUserAndCategory = await prisma.product.findUnique({
    where: {
      id: id,
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

  
  if (!productWithUserAndCategory) {
    throw ServiceError.notFound(`No product with id ${id} exists`, {id}); 
  }

  const product = {
    id: productWithUserAndCategory.id,
    title: productWithUserAndCategory.title,
    picture: productWithUserAndCategory.picture,
    description: productWithUserAndCategory.description,
    price: productWithUserAndCategory.price,
    bought: productWithUserAndCategory.bought,
    user: {
      id: productWithUserAndCategory.postedBy.id,
      name: productWithUserAndCategory.postedBy.firstName,
      
    },
    category: {
      id: productWithUserAndCategory.category.id,
      name: productWithUserAndCategory.category.name,
      
    },
  };

  return product;
};

const create = async({ title, picture, description, price, userId, categoryId }) => {
  if (!title || !picture || !description || !price || !userId || !categoryId) {
    getLogger().error('Missing required parameters');
    throw new Error('Missing required parameters');
  }
  
  let existingCategory;
  if(categoryId) {
    existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId
      }
    })

    if (!existingCategory) {
      getLogger().error(`There is no category with id ${categoryId}`);
      throw ServiceError.notFound(`No category with id ${categoryId} exists`, {categoryId});
    }
    else {
      getLogger().info("Category found");
    }
  }

  let existingUser;
  if(userId) {
    existingUser = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if(!existingUser) {
      getLogger().error(`There is no user with id ${userId}`);
      throw ServiceError.notFound(`No user with id ${userId} exists`);
    }
    else {
      getLogger().info("User found");
    }
  }
  
  try {
  return await prisma.product.create({
    data: {
      title: title,
      picture: picture,
      description: description,
      price: price,
      postedById: userId,
      categoryId: categoryId
    }
  })
  } catch(error) {
      throw handleDBError(error)
}
};

const updateById = async (productId, { title, picture, description, price, userId, categoryId }) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      postedBy: true,
    }
  });

  if (!existingProduct) {
    getLogger().error(`Product with id ${productId} not found`);
    throw ServiceError.notFound(`No product with id ${productId} exists`, {productId});
  }

  //Enkel originele poster kan product wijzigen
  if (userId !== existingProduct.postedBy.id) {
    getLogger().error(`User with id ${userId} is not the original poster of the product`);
    throw ServiceError.validationFailed(`User with id ${userId} is not the original poster of the product`);
  }

  let existingCategory;
  if (categoryId) {
    existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      getLogger().error(`There is no category with id ${categoryId}`);
      throw ServiceError.notFound(`No category with id ${categoryId} exists`, {categoryId});
    } else {
      getLogger().info("Category found");
    }
  }

  let existingUser;
  if (userId) {
    existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      getLogger().error(`There is no user with id ${userId}`);
      throw ServiceError.notFound(`No user with id ${userId} exists`);
    } else {
      getLogger().info("User found");
    }
  }

  
  try {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      title: title || existingProduct.title,
      picture: picture || existingProduct.picture,
      description: description || existingProduct.description,
      price: price || existingProduct.price,
      categoryId: categoryId || existingProduct.categoryId,
    },
  });
  } catch(error) {
    throw handleDBError(error);
  }
};

const deleteById = async(id, userId) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingProduct) {
    getLogger().error(`Product with id ${id} not found`);
    throw ServiceError.notFound(`No product with id ${id} exists`, { id });
  }

  if (userId !== existingProduct.postedById) {
    getLogger().error(`User with id ${userId} is not the original poster of the product`);
    throw ServiceError.validationFailed(`User with id ${userId} is not the original poster of the product`);
  }

  if (existingProduct.bought) {
    getLogger().error(`Product with id ${id} has already been bought`);
    throw ServiceError.validationFailed(`Product with id ${id} has already been bought`, { id });
  }
  
  await prisma.product.delete({
    where: {
      id: id,
    },
  });

  getLogger().info(`Product with id ${id} deleted successfully`);
};


const buyProductById = async(id, buyerId) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: id
    },
  })

  if (!existingProduct) {
    getLogger().error(`Product with id ${id} not found`);
    throw ServiceError.notFound(`Product with id ${id} not found`, {id});
  }

  if (existingProduct.bought) {
    getLogger().error(`Product with id ${id} has already been bought`);
    throw ServiceError.validationFailed(`Product with id ${id} has already been bought`, {id});
  }

  if (buyerId === existingProduct.postedById) {
    getLogger().error("It is not possible to buy your own product");
    throw ServiceError.validationFailed("It is not possible to buy your own product");
  }
  
  try {
  const updatedProduct = await prisma.product.update({
    where: {
      id: id
    },
    data: {
      bought: true
    }
  });
  


  const wishlistsContainingProduct = await prisma.wishlistedProduct.findMany({
    where: {
      productId: id,
    },
  });

 
  await Promise.all(
    wishlistsContainingProduct.map(async (wishlist) => {
      await prisma.wishlistedProduct.delete({
        where: {
          userId_productId: {
            userId: wishlist.userId,
            productId: id,
          },
        },
      });
    })
  );

  return updatedProduct;
  } catch(error) {
    throw handleDBError(error)
  }
  
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  buyProductById
};
