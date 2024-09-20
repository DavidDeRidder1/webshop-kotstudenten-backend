const { getLogger } = require("../core/logging");
const {PrismaClient} = require("@prisma/client");
const { hashPassword, verifyPassword } = require('../core/password');
const handleDBError = require("./_handleDBError");
const Roles = require("../core/roles");
const { generateJWT, verifyJWT } = require('../core/jwt');  
const ServiceError = require("../core/serviceError");

const prisma = new PrismaClient();

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized("You need to be signed in");
  }

  if (!authHeader.startsWith("Bearer")) {
    throw ServiceError.unauthorized("Invalid authentication token");
  }

  const authToken = authHeader.substring(7);

  try {
    const {roles, userId} = await verifyJWT(authToken);
    return {
      userId,
      roles,
      authToken
    }
  } catch(error) {
    getLogger().error(error.message, {error});
    throw new Error(error.message);
  }
};

const checkRole = (role, roles) => {
  //bevat roles van gebruiker de rol die nodig is?
  const hasPermission = roles.includes(role);

  if(!hasPermission) {
    throw ServiceError.forbidden("You are not allowed to use this part of the application");
  }
}

const findByEmail = async(email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
}

const makeExposedUser = ({id, firstName, lastName, email, roles}) => ({
  id,
  firstName,
  lastName,
  email,
  roles
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token
  }
};

const login = async(email, password) => {
  const user = await findByEmail(email);

  if(!user) {
    throw ServiceError.unauthorized("The given email and password do not match");
  };

  const passwordValid = await verifyPassword(password, user.password_hash);

  if(!passwordValid) {
    throw ServiceError.unauthorized("The given email and password do not match");
  }

  return await makeLoginData(user);
}

const getAll = async() => {
  const users = await prisma.user.findMany(); 
  const exposedUsers = users.map(makeExposedUser);
  return {
    items: exposedUsers,
    count: exposedUsers.length
  }
}

const getById = async(id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })
  return makeExposedUser(user);
}

const register = async({firstName, lastName, email, password}) => {
  try {
    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password_hash: passwordHash, 
        roles: [Roles.USER] 
      },
    });

    return await makeLoginData(newUser); //gebruiker is bij registreren ook aangemeld 
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async(id) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!existingUser) {
    getLogger().error(`User with id ${id} not found`);
    throw ServiceError.notFound(`No user with id ${id} exists`, { id });
  }

  await prisma.user.delete({
    where: {
      id: id,
    },
  });
}


const getSavedProducts = async(id) => {
  
  const wishlistedProducts = await prisma.wishlistedProduct.findMany({
    where: {
      userId: id
    },
    include: {
      product: {
        include: {
          postedBy: true, 
          category: true 
        }
      }
    }
  });
  const items = wishlistedProducts.map((wp) => {
    const product = wp.product;
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
        id: product.categoryId,
        name: product.category.name,
      },
    };
  });

  return { items, count: items.length };
};


const addProductToWishlist = async(userId, productId) => {

  const product = await prisma.product.findUnique({
    where: {
      id: productId
    }
  })

  if(!product) {
    getLogger().error(`Product with id ${productId} does not exist`);
    throw ServiceError.notFound(`Product with id ${productId} does not exist`);
  }

  if(userId === product.postedById) {
    getLogger().error("Cannot wishlist your own product");
    throw ServiceError.validationFailed("Cannot wishlist your own product");
  }

  if(product.bought === true) {
    getLogger().error("Cannot wishlist a product that has already been bought");
    throw ServiceError.validationFailed("Cannot wishlist a product that has already been bought");
  }


  const existingWishlistedProduct = await prisma.wishlistedProduct.findUnique({
    where: {
      userId_productId: {
        userId: userId,
        productId: productId,
      },
    },
  });

  if (existingWishlistedProduct) {
    getLogger().info(`Product with id ${productId} is already wishlisted for user with id ${userId}`);
    throw ServiceError.validationFailed(`Product with id ${productId} is already wishlisted for user with id ${userId}`);
   
  };
  
  try {
  return await prisma.wishlistedProduct.create({
    data: {
      userId: userId,
      productId: productId
    }
  })
  } catch(error) {
    throw handleDBError(error)
  }

}

const removeProductFromWishlist = async(userId, productId) => {

  const wishedProduct = await prisma.wishlistedProduct.findUnique({
    where: {
      userId_productId: {
        userId: userId,
        productId: productId,
      },
    },
  });

  if (!wishedProduct) {
    throw ServiceError.notFound("Product not found in the wishlist");
  }

  try {
  await prisma.wishlistedProduct.delete({
    where: {
      userId_productId: {
        userId: userId,
        productId: productId,
      },
    },
  });
  } catch(error) {
    throw handleDBError(error)
  }

}

module.exports = {
  getAll,
  getById,
  deleteById,
  register,
  login,
  getSavedProducts,
  addProductToWishlist,
  removeProductFromWishlist,
  checkAndParseSession,
  checkRole
}