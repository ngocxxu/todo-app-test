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
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type CardProps = React.ComponentProps<typeof Card>

const Home = ({ className, ...props }: CardProps) => {
  const [isOpen, setOpen] = useState(false)
  const [isEdit, setEdit] = useState(false)

  return (
    <>
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
                    <AlertDialogTitle>Do you want to delete?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your todo task.
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
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Home
