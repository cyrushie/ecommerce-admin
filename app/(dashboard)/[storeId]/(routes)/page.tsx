import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSales } from "@/actions/get-sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";
import { getTotalStock } from "@/actions/get-total-stock";
import { Overview } from "@/components/overview";
import { getGraphRevenue } from "@/actions/get-graph-revenue";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSales(params.storeId);
  const totalStock = await getTotalStock(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex flex-col space-y-4 p-8 pt-6 ">
        <Heading
          title="Dashboard"
          description="Overview of your store"
        />
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center gap-4">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>

              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(totalRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center gap-4">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>

              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center gap-4">
              <CardTitle className="text-sm font-medium">
                Package In Stock
              </CardTitle>

              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader className="flex flex-row justify-between items-center gap-4">
              <CardTitle className="text-sm font-medium">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Overview data={graphRevenue} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
