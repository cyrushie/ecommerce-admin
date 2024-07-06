"use client";

import { AlertModal } from "@/components/modal/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
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
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const addSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  isArchived: z.boolean().default(false).optional(),
  isFeatured: z.boolean().default(false).optional(),
  images: z
    .object({ imageUrl: z.string().min(1) })
    .array()
    .nonempty({ message: "At least 1 image is required" }),
});

const editSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  isArchived: z.boolean().default(false).optional(),
  isFeatured: z.boolean().default(false).optional(),
  images: z.object({ imageUrl: z.string().min(1) }).array(),
});

interface ProductFormProps {
  initialValue:
    | ({
        images: Image[];
      } & Product)
    | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

const ProductForm = ({
  initialValue,
  categories,
  sizes,
  colors,
}: ProductFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  const title = initialValue ? "Edit product" : "Create product";
  const description = initialValue
    ? "Edit your product"
    : "Create a new product";
  const action = initialValue ? "Save changes" : "Create";
  const toastMessage = initialValue ? "Product updated" : "Product created";
  const formSchema = initialValue ? editSchema : addSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValue
      ? { ...initialValue, price: initialValue.price as unknown as number }
      : {
          name: "",
          price: 0,
          categoryId: "",
          sizeId: "",
          colorId: "",
          images: [],
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (initialValue && !values?.images.length && initialValue.images.length) {
      values = {
        ...values,
        images: [
          ...initialValue.images.map((image) => ({
            imageUrl: image.imageUrl,
          })),
        ],
      };
    }

    try {
      setLoading(true);
      if (initialValue) {
        const response = await fetch(
          `/api/${params.storeId}/products/${initialValue.id}`,
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
        const response = await fetch(`/api/${params.storeId}/products`, {
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
      router.push(`/${params.storeId}/products`);
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
        `/api/${params.storeId}/products/${initialValue?.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.log(response);
        toast.error(`Error with status code: ${response.status}`);
        return;
      }

      toast.success("Products deleted");
      router.push(`/${params.storeId}/products`);
      router.refresh();
    } catch (error) {
      toast.error("Make sure you are sure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        title="Delete product"
        description="Deleting the product will never get it back"
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={[...field?.value.map((image) => image.imageUrl)]}
                    onChange={(url) => {
                      field.onChange([...field?.value, { imageUrl: url }]);
                    }}
                    onRemove={(url) =>
                      field.onChange([
                        ...field?.value.filter(
                          (image) => image.imageUrl !== url
                        ),
                      ])
                    }
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="product name"
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="9.99"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <FormControl>
                        <SelectValue
                          placeholder={"Select a category"}
                          defaultValue={field.value}
                        />
                      </FormControl>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => {
                        return (
                          <SelectItem value={category.id}>
                            {category.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <FormControl>
                        <SelectValue
                          placeholder={"Select a size"}
                          defaultValue={field.value}
                        />
                      </FormControl>
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => {
                        return (
                          <SelectItem value={size.id}>{size.name}</SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <FormControl>
                        <SelectValue
                          placeholder={"Select a color"}
                          defaultValue={field.value}
                        />
                      </FormControl>
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => {
                        return (
                          <SelectItem value={color.id}>{color.name}</SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-start flex-row space-x-3 rounded-md shadow p-4 border space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-2 leading-none">
                    <FormLabel>isFeatured</FormLabel>
                    <FormDescription>
                      This product will appear in the home page
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex items-start flex-row space-x-3 rounded-md shadow p-4 border space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-2 leading-none">
                    <FormLabel>isArchived</FormLabel>
                    <FormDescription>
                      This product will not appear in the store
                    </FormDescription>
                  </div>
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

export default ProductForm;
