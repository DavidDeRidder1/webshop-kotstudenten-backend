const supertest = require("supertest");
const createServer = require("../../src/createServer");
const {PrismaClient} = require("@prisma/client");
const { withServer, login, loginAdmin } = require('../supertest.setup'); 
const { testAuthHeader } = require('../common/auth'); 

describe("Products", () => {
  //let server;
  let request;
  let prisma;
  let authHeader;

  withServer(({
    supertest,
    
  }) => {
    request = supertest;
    
  });

  beforeAll(async () => {
    /*server = await createServer();
    request = supertest(server.getApp().callback());
    prisma = new PrismaClient();*/
    authHeader = await login(request);
  });

  /*afterAll(async () => {
    await server.stop();
  });*/

  const url = "/api/products";

  describe('GET /api/products', () => { 

    it('should 200 and return all products', async () => { 
      const response = await request.get(url).set("Authorization", authHeader); 
      expect(response.status).toBe(200); 
      expect(response.body.items.length).toBe(3);

      expect(response.body.items[0]).toEqual({
        id: 1,
        title: "Desk lamp",
        picture: "https://img.ltwebstatic.com/images3_spmp/2023/09/08/16/1694162149bee51af18267b8c185e10fc4ecdf009d_thumbnail_720x.webp",
        description: "Cheap lamp",
        price: 20,
        bought: false,
        user: {
            id: 1,
            name: "David"
        },
        category: {
            id: 1,
            name: "School Materials"
        }
      })
      expect(response.body.items[1]).toEqual({
        id: 2,
        title: "Folding chair",
        picture: "https://mobileimages.lowes.com/productimages/baa0cd22-49f5-48b6-8db5-e9a06b3bb8cc/11124219.jpg",
        description: "Sturdy chair",
        price: 15,
        bought: false,
        user: {
            id: 1,
            name: "David"
        },
        category: {
            id: 2,
            name: "Furniture"
        }
      })
      expect(response.body.items[2]).toEqual({
        id: 3,
        title: "Mini fridge",
        picture: "https://www.uberappliance.com/cdn/shop/files/IMG_1911-min_50.jpg?v=1682798995&width=1080",
        description: "High quality fridge",
        price: 90,
        bought: false,
        user: {
            id: 1,
            name: "David"
        },
        category: {
            id: 3,
            name: "Kitchen Appliances"
        }
      }) 
    });
    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  testAuthHeader(() => request.get(url));

  describe("GET /api/products/:id", () => {

    it("should return 200 and return the product", async () => {
      const response = await request.get(`${url}/1`).set("Authorization", authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        title: "Desk lamp",
        picture: "https://img.ltwebstatic.com/images3_spmp/2023/09/08/16/1694162149bee51af18267b8c185e10fc4ecdf009d_thumbnail_720x.webp",
        description: "Cheap lamp",
        price: 20,
        bought: false,
        user: {
            id: 1,
            name: "David"
        },
        category: {
            id: 1,
            name: "School Materials"
        }
      })
    })

    it('should 404 when requesting not existing product', async () => {
      const response = await request.get(`${url}/4`).set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No product with id 4 exists',
        details: {
          id: 4,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid product id', async () => {
      const response = await request.get(`${url}/invalid`).set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  testAuthHeader(() => request.get(`${url}/1`));

  describe("POST /api/products", () => {
    it("should 201 and return the created product", async () => {
      const response = await request.post(url).send({
        title: "Couch",
        picture: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSGBtfvVrUEJXdGW4cxnCoQDfGPEZdMZ_MNU793X749Koj4PRe8SViwOcMPd5jCDve_vUcmmogLm3eqg8UMcDM",
        description: "This is a couch",
        price: 25,
        
        categoryId: 2
      }).set("Authorization", authHeader);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe("Couch");
      expect(response.body.picture).toBe("https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSGBtfvVrUEJXdGW4cxnCoQDfGPEZdMZ_MNU793X749Koj4PRe8SViwOcMPd5jCDve_vUcmmogLm3eqg8UMcDM");
      expect(response.body.description).toBe("This is a couch");
      expect(response.body.price).toBe(25);
      expect(response.body.postedById).toBe(2);
      expect(response.body.categoryId).toBe(2);
      expect(response.body.bought).toBe(false);
    });

    it("should 404 when category does not exist", async () => {
      const response = await request.post(url).send({
        title: "Couch2",
        picture: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSGBtfvVrUEJXdGW4cxnCoQDfGPEZdMZ_MNU793X749Koj4PRe8SViwOcMPd5jCDve_vUcmmogLm3eqg8UMcDM",
        description: "This is a couch",
        price: 30,
        
        categoryId: 139
      }).set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No category with id 139 exists',
        details: {
          categoryId: 139,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 400 when missing title", async () => {
      const response = await request.post(url).send({
        picture: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSGBtfvVrUEJXdGW4cxnCoQDfGPEZdMZ_MNU793X749Koj4PRe8SViwOcMPd5jCDve_vUcmmogLm3eqg8UMcDM",
        description: "This is a couch",
        price: 30,
        
        categoryId: 2
      }).set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('title');
    });

    it("should 400 when missing picture", async () => {
      const response = await request.post(url).send({
        title: "Couch",
        description: "This is a couch",
        price: 30,
        userId: 1,
        categoryId: 2
      }).set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('picture');
    });

    it("should 400 when missing description", async () => {
      const response = await request.post(url).send({
        title: "Couch",
        picture: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSGBtfvVrUEJXdGW4cxnCoQDfGPEZdMZ_MNU793X749Koj4PRe8SViwOcMPd5jCDve_vUcmmogLm3eqg8UMcDM",
        price: 30,
        
        categoryId: 2
      }).set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('description');
    });

    it("should 400 when missing price", async () => {
      const response = await request.post(url).send({
        title: "Couch",
        picture: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSGBtfvVrUEJXdGW4cxnCoQDfGPEZdMZ_MNU793X749Koj4PRe8SViwOcMPd5jCDve_vUcmmogLm3eqg8UMcDM",
        description: "This is a couch",
        
        categoryId: 2
      }).set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('price');
    });

    it("should 400 when missing categoryId", async () => {
      const response = await request.post(url).send({
        title: "Couch",
        picture: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSGBtfvVrUEJXdGW4cxnCoQDfGPEZdMZ_MNU793X749Koj4PRe8SViwOcMPd5jCDve_vUcmmogLm3eqg8UMcDM",
        description: "This is a couch",
        price: 30,
       
      }).set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('categoryId');
    })
  });

  testAuthHeader(() => request.post(url));

  describe("PUT /api/products/:id", () => {
    it("should 200 and return the updated product", async () => {
      authHeader = await loginAdmin(request); 
      const response = await request.put(`${url}/1`).send({
        title: "Beautiful couch",
        picture: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1695223040-178463-lsj-650b0cf24be35.jpg?crop=1xw:1xh;center,top&resize=980:*",
        description: "This is a very unique couch",
        price: 3000,
        categoryId: 2
      }).set("Authorization", authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe("Beautiful couch");
      expect(response.body.picture).toBe("https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1695223040-178463-lsj-650b0cf24be35.jpg?crop=1xw:1xh;center,top&resize=980:*");
      expect(response.body.description).toBe("This is a very unique couch");
      expect(response.body.price).toBe(3000);
      expect(response.body.postedById).toBe(1);
      expect(response.body.categoryId).toBe(2);
      expect(response.body.bought).toBe(false);
    });

    it('should 404 when updating not existing product', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          title: "Couch2",
          picture: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSGBtfvVrUEJXdGW4cxnCoQDfGPEZdMZ_MNU793X749Koj4PRe8SViwOcMPd5jCDve_vUcmmogLm3eqg8UMcDM",
          description: "This is a couch",
          price: 30,
          
          categoryId: 2
        }).set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No product with id 4 exists',
        details: {
          productId: 4,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 404 when category does not exist', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          title: "Test title",
          categoryId: 139
        }).set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No category with id 139 exists',
        details: {
          categoryId: 139,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
  });

  testAuthHeader(() => request.put(`${url}/1`));

  describe("DELETE /api/products/:id", () => {
    it("should 204 and return nothing", async () => {
      const response = await request.delete(`${url}/1`).send({

      }).set("Authorization", authHeader);
      
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing product', async () => {
      const response = await request.delete(`${url}/4`).set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No product with id 4 exists',
        details: {
          id: 4,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid product id', async () => {
      const response = await request.delete(`${url}/invalid`).set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  testAuthHeader(() => request.delete(`${url}/1`));

  describe("PUT /api/products/buy/:id", () => {
    it("should 200 and return the bought product", async () => {
      authHeader = await login(request);
      const response = await request.put(`${url}/buy/3`).set("Authorization", authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe("Mini fridge");
      expect(response.body.picture).toBe("https://www.uberappliance.com/cdn/shop/files/IMG_1911-min_50.jpg?v=1682798995&width=1080");
      expect(response.body.description).toBe("High quality fridge");
      expect(response.body.price).toBe(90);
      expect(response.body.postedById).toBe(1);
      expect(response.body.categoryId).toBe(3);
      expect(response.body.bought).toBe(true);
    });

    it('should 404 with not existing product', async () => {
      const response = await request.put(`${url}/buy/4`).set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Product with id 4 not found',
        details: {
          id: 4,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 404 when product already bought", async () => {
      await request.put(`${url}/buy/3`).set("Authorization", authHeader);
      const response = await request.put(`${url}/buy/3`).set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: "Product with id 3 has already been bought",
        details: {
          id: 3,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should remove bought product from all user's wishlists", async() => {
      await request.put(`${url}/buy/2`).set("Authorization", authHeader);
      const response = await request.get(`/api/users/me/products`).set("Authorization", authHeader);
      expect(response.body.items.length).toBe(0)
    })
  });

  testAuthHeader(() => request.put(`${url}/buy/1`));

  
})