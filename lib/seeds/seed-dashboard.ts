import { PrismaClient, OrderStatus } from '@prisma/client'
import { generateProductsForSeed } from './seed-products'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed for dashboard data...')

  const user = await prisma.user.findFirst()
  if (!user) {
    console.error('No user found! Please create a user first.')
    return
  }

  const category = await prisma.category.findFirst()
  if (!category) {
    console.error('No category found! Please create a category first.')
    return
  }

  console.log('Creating dummy customers...')
  const customers = []
  for (let i = 1; i <= 20; i++) {
    const customer = await prisma.customer.create({
      data: {
        fullName: `Dummy Customer ${i}`,
        phone: `123456789${i}`,
        fullAddress: `${i} Main St, City, Country`,
        email: `customer${i}@example.com`,
      }
    })
    customers.push(customer)
  }

  console.log('Creating dummy products using seed-products.ts...')
  const seededProducts = await generateProductsForSeed({
    categoryId: category.id,
    userId: user.id,
    count: 6,
  })
  const products = seededProducts.map((product) => ({
    id: product.id,
    productName: product.productName,
    thumbnail: product.thumbnail,
    price: Number(product.variants[0]?.price ?? 100),
  }))

  console.log('Creating dummy orders...')
  const statuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED]
  
  for (let i = 0; i < 50; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 180))

    const customer = customers[Math.floor(Math.random() * customers.length)]

    const product = products[Math.floor(Math.random() * products.length)]
    const quantity = Math.floor(Math.random() * 3) + 1
    const subTotal = product.price * quantity

    const order = await prisma.order.create({
      data: {
        totalPrice: subTotal,
        orderNumber: `ORD-${Date.now()}-${i}`,
        customerId: customer.id,
        userId: user.id,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: date,
        updatedAt: date,
      }
    })

    await prisma.cartItem.create({
      data: {
        title: product.productName,
        thumbnail: product.thumbnail || '',
        size: 'Default',
        price: product.price,
        subTotal: subTotal,
        quantity: quantity,
        userId: user.id,
        orderId: order.id,
        productId: product.id,
        createdAt: date,
        updatedAt: date,
      }
    })
  }

  console.log('Creating dummy orders for today...')
  for (let i = 0; i < 5; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const product = products[Math.floor(Math.random() * products.length)]
    const quantity = 1
    const subTotal = product.price * quantity

    const order = await prisma.order.create({
      data: {
        totalPrice: subTotal,
        orderNumber: `ORD-TODAY-${Date.now()}-${i}`,
        customerId: customer.id,
        userId: user.id,
        status: OrderStatus.PENDING,
      }
    })

    await prisma.cartItem.create({
      data: {
        title: product.productName,
        thumbnail: product.thumbnail || '',
        size: 'Default',
        price: product.price,
        subTotal: subTotal,
        quantity: quantity,
        userId: user.id,
        orderId: order.id,
        productId: product.id,
      }
    })
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
