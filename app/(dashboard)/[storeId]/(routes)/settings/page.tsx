import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsForm from "./_components/settings-form";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage = async ({ params: { storeId } }: SettingsPageProps) => {
  const store = await db.store.findFirst({
    where: {
      id: storeId,
    },
  });

  if (!store) {
    return redirect("/");
  }

  return (
    <div className="flex-col justify-center flex gap-6 p-8 pt-6">
      <SettingsForm initialValue={store} />
    </div>
  );
};

export default SettingsPage;
