import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Plus, Trash } from 'lucide-react'

import instance from '@/api/axiosConfig'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

type CardProps = React.ComponentProps<typeof Card>

type TFormInput = {
  note: string
}

type TData = {
  id: string
  note: string
  createdAt: string
  status: string
}

const tabs = [
  {
    value: 'all',
    label: 'All'
  },
  {
    value: 'completed',
    label: 'Completed'
  },
  {
    value: 'incomplete',
    label: 'Incomplete'
  }
]

const formSchema = z.object({
  note: z.string().min(2, {
    message: 'Note must be at least 2 characters.'
  })
})

const Home = ({ className, ...props }: CardProps) => {
  const [isOpen, setOpen] = useState(false)
  const [isEdit, setEdit] = useState(false)
  const [dataAPI, setDataAPI] = useState<TData[]>([])

  const form = useForm<TFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: ''
    }
  })

  const onSubmit: SubmitHandler<TFormInput> = async (data) => {
    try {
      await instance.post('/todos', {
        note: data.note,
        createdAt: new Date()
      })
      fetchTodos()
      toast({
        title: 'Success',
        description: 'Successfully created todo'
      })
    } catch (error) {
      console.error('Error creating user:', error)
      toast({
        title: 'Error',
        description: 'Something wrong when created todo'
      })
    }

    setOpen(false)
  }

  const fetchTodos = useCallback(async () => {
    try {
      const { data } = await instance.get<TData[]>('/todos')

      const sortedTodos = data
        .map((item) => ({
          ...item,
          status: item.status === 'male' ? 'completed' : 'incomplete'
        }))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      setDataAPI(sortedTodos)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }, [])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  useEffect(() => {
    if (isEdit) {
      form.reset((prev) => ({ ...prev }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit])

  return (
    <Form {...form}>
      <Card className={cn(className)} {...props}>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>You have {dataAPI.length} tasks</CardDescription>
        </CardHeader>
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <ScrollArea className="h-[70vh]">
                <CardContent className="grid gap-4">
                  {dataAPI.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between space-x-4 rounded-md border p-4"
                      >
                        <p className="font-medium leading-none">{item.note}</p>
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
                                  This action cannot be undone. This will
                                  permanently delete your todo task.
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
                    )
                  })}
                </CardContent>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

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
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
            <DialogFooter className="mt-4">
              <Button onClick={() => setOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button type="submit">{isEdit ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  )
}

export default Home
