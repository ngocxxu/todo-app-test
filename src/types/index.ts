import { Card } from '@/components/ui/card'

export type CardProps = React.ComponentProps<typeof Card>

export type TFormInput = {
  note: string
  status: string
}

export type TData = {
  id: string
  note: string
  createdAt: string
  status: string
}
