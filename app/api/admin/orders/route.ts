import { getServerSession } from "@/lib/get-session";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession();
        const artistRole = session?.user.role;

        if (!artistRole?.includes("ADMIN")) {
            return NextResponse.json(
                { message: "Unauthorized Request" },
                { status: 400 }
            );
        }

        const orderId = request.url.split("?")[1].split("=")[1];

        if (!orderId) {
            return NextResponse.json(
                { message: "Order ID is required" },
                { status: 400 }
            );
        }


        const body = await request.json();


        const { fullName, email, phone, fullAddress, status, customRequirements } = body;

        const result = await db.order.update({
            where: {
                id: orderId
            },
            data: {
                fullName,
                email,
                phone,
                fullAddress,
                status,
                customRequirements,
            }
        })

        return NextResponse.json(
            { message: "Order Updated successful", data: result },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error updating Order /api/admin/orders_PATCH :", error },
            { status: 500 }
        );
    }
}
