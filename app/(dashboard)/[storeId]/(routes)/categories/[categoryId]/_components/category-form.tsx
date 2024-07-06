"use client";

import { AlertModal } from "@/components/modal/alert-modal";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  billboardId: z.string().min(1, { message: "Billboard is required" }),
});

interface CategoryFormProps {
  initialValue: ({ billboard: Billboard } & Category) | null;
  billboards: Billboard[];
}

const CategoryForm = ({ initialValue, billboards }: CategoryFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  const title = initialValue ? "Edit category" : "Create category";
  const description = initialValue
    ? "Edit your category"
    : "Create a new category";
  const action = initialValue ? "Save changes" : "Create";
  const toastMessage = initialValue ? "Changes saved" : "category created";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValue || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialValue) {
        const response = await fetch(
          `/api/${params.storeId}/categories/${initialValue.id}`,
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
        const response = await fetch(`/api/${params.storeId}/categories`, {
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
      router.push(`/${params.storeId}/categories`);
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
        `/api/${params.storeId}/categories/${initialValue?.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.log(response);
        toast.error(`Error with status code: ${response.status}`);
        return;
      }

      toast.success("Category deleted");
      router.push(`/${params.storeId}/categories`);
      router.refresh();
    } catch (error) {
      toast.error(
        "Make sure you deleted all categories related to this category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        title="Delete category"
        description="Deleting the category will never get it back"
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
          <div className="grid grid-cols-3 gap-8 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="category name"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <FormControl>
                        <SelectValue
                          placeholder={
                            initialValue
                              ? initialValue.billboard?.label
                              : "Select a billboard"
                          }
                          defaultValue={field.value}
                        />
                      </FormControl>
                    </SelectTrigger>
                    <SelectContent>
                      {billboards.map((billboard) => {
                        return (
                          <SelectItem
                            key={billboard.id}
                            value={billboard.id}
                          >
                            {billboard.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
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
    </>
  );
};

export default CategoryForm;
