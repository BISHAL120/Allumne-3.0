import { headers } from "next/headers"
import { auth } from "./auth"
import { cache } from "react"

export const getServerSession = cache(async () => {

    return await auth.api.getSession({ headers: await headers() })
})

export const getUserId = cache(async () => {
    const session = await getServerSession();
    return session?.user?.id;
})
