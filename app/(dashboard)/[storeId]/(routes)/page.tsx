import { db } from "@/lib/db"

interface DashboardPageProps {
    params: { storeId: string }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
    const store = await db.store.findUnique({
        where: {
            id: params.storeId,
        }
    })

    return (
        <div>Active Store: {store?.name}</div>
    )
}

export default DashboardPage