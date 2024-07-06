"use client";

import { useState } from "react";
import { SizeColumnProps } from "./column";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modal/alert-modal";

export const CellActions = ({ data }: { data: SizeColumnProps }) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID Copied to Clipboard");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/${params.storeId}/sizes/${data.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.log(response);
        toast.error(`Error with status code: ${response.status}`);
        return;
      }

      router.refresh();
      toast.success("Size deleted");
    } catch (error) {
      toast.error("Make sure you deleted all products related to this size");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        title="Delete size"
        description="Deleting the size will never get it back"
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        isOpen={open}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={loading}
          >
            <span className="sr-only">Open actions</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => onCopy(data.id)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
