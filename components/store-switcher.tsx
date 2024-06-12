"use client";

import { useStoreModal } from "@/hooks/useStoreModal";
import { Store } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { cn } from "@/lib/utils";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

const StoreSwitcher: React.FC<StoreSwitcherProps> = ({
  className,
  items = [],
}) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();
  const storeModal = useStoreModal();
  const [open, setOpen] = useState(false);

  const stores = items?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const onStoreSelect = (store: { label: string; value: string }) => {
    router.push(`/${store.value}`);
  };

  const currentStore = stores?.find((store) => store.value === params.storeId);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          size="sm"
          role="combobox"
          aria-label="Select Store"
          className={cn("w-[200px] flex justify-between", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] ">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store" />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {stores?.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm flex justify-between"
                >
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      store.value === currentStore?.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
