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
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 character" }),
  value: z.string().min(1, { message: "Value is required" }),
});

interface ColorFormProps {
  initialValue: Color | null;
}

const ColorForm = ({ initialValue }: ColorFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  const title = initialValue ? "Edit color" : "Create color";
  const description = initialValue ? "Edit your color" : "Create a new color";
  const action = initialValue ? "Save" : "Create";
  const toastMessage = initialValue ? "Color updated" : "Color created";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValue || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialValue) {
        const response = await fetch(
          `/api/${params.storeId}/colors/${initialValue.id}`,
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
        const response = await fetch(`/api/${params.storeId}/colors`, {
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
      router.push(`/${params.storeId}/colors`);
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
        `/api/${params.storeId}/colors/${initialValue?.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.log(response);
        toast.error(`Error with status code: ${response.status}`);
        return;
      }

      toast.success("Colors deleted");
      router.push(`/${params.storeId}/colors`);
      router.refresh();
    } catch (error) {
      toast.error("Make sure you deleted all categories related to this color");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        title="Delete color"
        description="Deleting the color will never get it back"
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
                      placeholder="Color name"
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
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        disabled={loading}
                        placeholder="Color value"
                        type="text"
                        {...field}
                      />
                      <div
                        className="p-4 rounded-full border"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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

export default ColorForm;
