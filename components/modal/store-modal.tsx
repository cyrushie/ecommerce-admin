'use client'

import { useStoreModal } from "@/hooks/useStoreModal"
import { Modal } from "../ui/modal"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import toast from "react-hot-toast"

const formSchema = z.object({
    name: z.string().min(1, { message: 'Name must be at least 1 character' })
})

export const StoreModal = () => {
    const { isOpen, onClose } = useStoreModal()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)

            const response = await fetch('/api/stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })

            if (!response.ok) {
                toast.error(`Error with status code: ${response.status}`)
                return
            }


            const data = await response.json()
            window.location.assign(`/${data.id}`)

        } catch (error) {
            toast.error('Something went wrong!')
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    return <Modal title="Add Store" description="Add new store to manage your products" isOpen={isOpen} onClose={onClose}>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={isLoading} placeholder="E-commerce" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="pt-6 flex justify-end gap-2">
                    <Button disabled={isLoading} variant={'outline'} type="button" onClick={() => onClose()}>Cancel</Button>
                    <Button disabled={isLoading} type='submit'>Continue</Button>
                </div>
            </form>
        </Form>
    </Modal>
}