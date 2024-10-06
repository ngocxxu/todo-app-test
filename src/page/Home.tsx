import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Plus, Trash } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

type CardProps = React.ComponentProps<typeof Card>

type TFormInput = {
  note: string
}

const formSchema = z.object({
  note: z.string().min(2, {
    message: 'Note must be at least 2 characters.'
  })
})

const Home = ({ className, ...props }: CardProps) => {
  const [isOpen, setOpen] = useState(false)
  const [isEdit, setEdit] = useState(false)

  const form = useForm<TFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: ''
    }
  })

  const onSubmit: SubmitHandler<TFormInput> = (data) => {
    console.log(data)
    setOpen(false)
  }

  useEffect(() => {
    if (isEdit) {
      form.reset((prev) => ({ ...prev }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={cn(className)} {...props}>
          <CardHeader>
            <CardTitle>Todo List</CardTitle>
            <CardDescription>You have 3 unread messages.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
              <p className="font-medium leading-none">Push Notifications</p>
              <div className="flex gap-2">
                <Edit
                  className="cursor-pointer"
                  onClick={() => {
                    setEdit(true)
                    setOpen(true)
                  }}
                />

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash color="red" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Do you want to delete?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your todo task.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              onClick={() => {
                setEdit(false)
                setOpen(true)
              }}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </CardFooter>
        </Card>

        <Dialog onOpenChange={setOpen} open={isOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Update' : 'Create'}</DialogTitle>
              <DialogDescription>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Input your task..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button type="submit">{isEdit ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}

export default Home
