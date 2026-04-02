import { z } from "zod";


export const cartItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, "Product ID is required"),
  title: z.string().min(1, "Title is required"),
  size: z.string().min(1, "Size is required"),
  price: z.string().min(1, "Price is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  thumbnail: z.string().optional().or(z.literal("")),
  subTotal: z.string().optional(),
  user: z.object({
    name: z.string().optional().or(z.literal("")),
    phoneNumber: z.string().optional().or(z.literal("")),
    email: z.string().email("Invalid email"),
  }),
});

export const customerSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  fullAddress: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  paymentScreenshot: z.string().optional().nullable(),
  customRequirements: z.string().optional().or(z.literal("")),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
  totalPrice: z.string().optional(),
  customRequirements: z.string().optional().or(z.literal("")),
});

export type CartItemFormValues = z.infer<typeof cartItemSchema>;
export type CustomerFormValues = z.infer<typeof customerSchema>;
export type OrderStatusFormValues = z.infer<typeof orderStatusSchema>;




/* 

Order details : {
  id: '69cd242fb39d58156d035fb5',
  orderNumber: 'ORD-000006',
  status: 'PENDING',
  customer: {
    id: '69cd1b4db39d58156d035f9f',
    fullName: 'Md Bishal',
    phone: '01312604691',
    fullAddress: 'jessore sadar, khulna bangladesh',
    email: 'monerulmd5@gmail.com',
    paymentScreenshot: null,
    customRequirements: 'aaaaa aaaaaa aaaaaa',
    createdAt: 2026-04-01T13:19:09.491Z,
    updatedAt: 2026-04-01T13:19:09.491Z
  },
  cartItems: [
    {
      id: '69cd242fb39d58156d035fb6',
      productId: '69cbd92ba63b3813806a544f',
      title: 'Product 1 (Draft)',
      size: 'Small',
      price: '37',
      quantity: 1,
      user: {
        name: 'ADMIN',
        phoneNumber: '',
        email: '',
      },
      thumbnail: 'https://picsum.photos/200/200',
      subTotal: '37',
      orderId: '69cd242fb39d58156d035fb5'
    },
    {
      id: '69cd2430b39d58156d035fb7',
      productId: '69cbd92ba63b3813806a544f',
      title: 'Product 1 (Draft)',
      size: 'Large',
      price: '147',
      quantity: 1,
      user: {
        name: 'ADMIN',
        phoneNumber: '',
        email: '',
      },
      thumbnail: 'https://picsum.photos/200/200',
      subTotal: '147',
      orderId: '69cd242fb39d58156d035fb5'
    }
  ]
}
 GET /admin/orders/edit/69cd242fb39d58156d035fb5 200 in 633ms (next.js: 2ms, proxy.ts: 184ms, application-code: 447ms)


*/