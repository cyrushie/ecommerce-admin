import { Copy, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, BadgeProps } from "./badge";
import { Button } from "./button";
import toast from "react-hot-toast";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "admin" | "public";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  admin: "Admin",
  public: "Public",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  admin: "destructive",
  public: "secondary",
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = "public",
}) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("Copied to clipboard");
  };

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle>
        {title}
        <Badge
          className="ml-2"
          variant={variantMap[variant]}
        >
          {textMap[variant]}
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="bg-muted rounded text-sm font-mono font-semibold p-1 px-2">
          {description}
        </code>
        <Button
          variant="outline"
          size="icon"
          onClick={onCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
