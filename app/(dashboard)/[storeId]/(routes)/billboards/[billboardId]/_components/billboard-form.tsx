"use client";

import { AlertModal } from "@/components/modal/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Store } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  label: z.string().min(1, { message: "Name must be at least 1 character" }),
  imageUrl: z.string().min(1, { message: "Image URL is required" }),
});

interface BillboardFormProps {
  initialValue: Billboard | null;
}

const BillboardForm = ({ initialValue }: BillboardFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  const title = initialValue ? "Edit billboard" : "Create billboard";
  const description = initialValue
    ? "Edit your billboard"
    : "Create a new billboard";
  const action = initialValue ? "Save changes" : "Create";
  const toastMessage = initialValue ? "Changes saved" : "Billboard created";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValue || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialValue) {
        const response = await fetch(
          `/api/${params.storeId}/billboards/${initialValue.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          toast.error(`Error with status code: ${response.status}`);
          return;
        }
      } else {
        const response = await fetch(`/api/${params.storeId}/billboards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          toast.error(`Error with status code: ${response.status}`);
          return;
        }
      }

      toast.success(toastMessage);
      router.push(`/${params.storeId}/billboards`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/${params.storeId}/billboards/${initialValue?.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.log(response);
        toast.error(`Error with status code: ${response.status}`);
        return;
      }

      toast.success("Store deleted");
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
    } catch (error) {
      toast.error(
        "Make sure you deleted all categories related to this billboard"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        title="Delete billboard"
        description="Deleting the billboard will never get it back"
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        isOpen={open}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        {initialValue && (
          <Button
            disabled={loading}
            size="icon"
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={(url) => field.onChange("")}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8 ">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="billboard label"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            size="sm"
          >
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default BillboardForm;
