"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "./api-alert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

export const ApiList: React.FC<ApiListProps> = ({
  entityName,
  entityIdName,
}) => {
  const params = useParams<{ storeId: string }>();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}/${entityName}`;

  return (
    <div className="space-y-4">
      <ApiAlert
        title="GET"
        description={baseUrl}
        variant="public"
      />
      <ApiAlert
        title="GET"
        description={`${baseUrl}/{${entityIdName}}`}
        variant="public"
      />
      <ApiAlert
        title="POST"
        description={baseUrl}
        variant="admin"
      />
      <ApiAlert
        title="PATCH"
        description={`${baseUrl}/{${entityIdName}}`}
        variant="admin"
      />
      <ApiAlert
        title="DELETE"
        description={`${baseUrl}/{${entityIdName}}`}
        variant="admin"
      />
    </div>
  );
};
