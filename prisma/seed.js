const { PrismaClient } = require('@prisma/client');
const Role = require("../src/core/roles");

const prisma = new PrismaClient();

async function main() {
  await prisma.wishlistedProduct.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const remainingCategories = await prisma.category.findMany();
  console.log("Remaining categories after deletion:", remainingCategories);

  
  
  

  await prisma.category.createMany({
    data: [
      { id: 1, name: 'School Materials' },
      { id: 2, name: 'Furniture' },
      { id: 3, name: 'Kitchen Appliances' },
    ],
  });

  await prisma.user.create({
    data: {
      id: 1,
      firstName: "David",
      lastName: "De Ridder",
      email: "david.deridder@student.hogent.be",
      password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
      roles: [Role.USER, Role.ADMIN],
      products: {
        createMany: {
          data: [
            {
              id: 1,
              title: "Desk lamp",
              picture: "https://img.ltwebstatic.com/images3_spmp/2023/09/08/16/1694162149bee51af18267b8c185e10fc4ecdf009d_thumbnail_720x.webp",
              description: "Cheap lamp",
              price: 20.00,
              categoryId: 1
            },
            {
              id: 2,
              title: "Folding chair",
              picture: "https://mobileimages.lowes.com/productimages/baa0cd22-49f5-48b6-8db5-e9a06b3bb8cc/11124219.jpg",
              description: "Sturdy chair",
              price: 15.00,
              categoryId: 2
            },
            {
              id: 3,
              title: "Mini fridge",
              picture: "https://www.uberappliance.com/cdn/shop/files/IMG_1911-min_50.jpg?v=1682798995&width=1080",
              description: "High quality fridge",
              price: 90.00,
              categoryId: 3
            }
          ]
        }
      }
    },
  });

  await prisma.user.create({
      data: {
      id: 2,  
      firstName: "John",
      lastName: "Doe",
      email: "john@gmail.com",
      password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
      roles: [Role.USER]
      }
  });

  await prisma.wishlistedProduct.createMany({
    data: [
      {
        userId: 2,
        productId: 1
      },
      {
        userId: 2,
        productId: 2
      }
    ]

  })

  
}

main().catch(e => {
  console.log(e);
  process.exit(1)
}).finally(() => {
  prisma.$disconnect();
})