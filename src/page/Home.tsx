import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash } from 'lucide-react'

import instance from '@/api/axiosConfig'
import { createTodo, deleteTodo, updateTodoStatus } from '@/api/toDoService'
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
import { Checkbox } from '@/components/ui/checkbox'
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
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { tabs } from '@/constants'
import { cn } from '@/lib/utils'
import { CardProps, TData, TFormInput } from '@/types'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  note: z.string().min(2, {
    message: 'Note must be at least 2 characters.'
  })
})

const Home = ({ className, ...props }: CardProps) => {
  const [isOpen, setOpen] = useState(false)
  const [dataAPI, setDataAPI] = useState<TData[]>([])
  const [tabValue, setTabValue] = useState('all')

  const form = useForm<TFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: '',
      status: 'completed'
    }
  })

  const onFilter = useMemo(() => {
    return dataAPI.filter((f) =>
      tabValue === 'all' ? true : f.status === tabValue
    )
  }, [tabValue, dataAPI])

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

  const onSubmit: SubmitHandler<TFormInput> = async (data) => {
    await createTodo({ note: data.note, createdAt: new Date() })
    fetchTodos()
    setOpen(false)
  }

  const onUpdateStatus = async (checked: CheckedState, obj: TData) => {
    const newStatus = checked ? 'male' : 'female'
    await updateTodoStatus(obj.id, newStatus)
    fetchTodos()
  }

  const onDelete = async (id: string) => {
    await deleteTodo(id)
    fetchTodos()
  }

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return (
    <Form {...form}>
      <Card className={cn(className)} {...props}>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>You have {onFilter.length} tasks</CardDescription>
        </CardHeader>
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setTabValue}
          value={tabValue}
        >
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
                  {onFilter.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between space-x-4 rounded-md border p-4"
                      >
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <div className="flex items-center space-x-4">
                              <FormItem>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value === item.status}
                                    onCheckedChange={(checked) =>
                                      onUpdateStatus(checked, item)
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="ml-2 font-medium leading-none">
                                  {item.note}
                                </FormLabel>
                              </FormItem>
                            </div>
                          )}
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
                              <AlertDialogAction
                                className="bg-destructive"
                                onClick={() => onDelete(item.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
              <DialogTitle>Create</DialogTitle>
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
              <Button
                type="button"
                onClick={() => {
                  setOpen(false)
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  )
}

export default Home
