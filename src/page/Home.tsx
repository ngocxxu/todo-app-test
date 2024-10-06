import { Edit, Plus, Trash } from 'lucide-react'

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
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type CardProps = React.ComponentProps<typeof Card>

const Home = ({ className, ...props }: CardProps) => {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
          <p className="font-medium leading-none">Push Notifications</p>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger>
                <Edit />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Trash color="red" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Home
