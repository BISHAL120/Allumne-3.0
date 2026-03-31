import db from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const roleSchema = z.enum(["ADMIN", "MANAGER", "EDITOR", "USER"]);

const updatePermissionsSchema = z.object({
    id: z.string().min(1, "User ID is required"),
    role: z.array(roleSchema).min(1, "At least one role is required"),
});

export async function PATCH(req: Request) {
    try {
        const body = await req.json();

        // Validate the request body
        const validationResult = updatePermissionsSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    message: "Invalid input",
                    errors: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { id, role } = validationResult.data;


        const result = await db.user.update({   
            where: { id },
            data: { role },
        })

        return NextResponse.json(
            {
                message: "Permissions updated successfully",
                data: result.id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating permissions:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
