import { toast } from '@/hooks/use-toast'
import instance from './axiosConfig'

export const updateTodoStatus = async (id: string, status: string) => {
  try {
    await instance.put(`/todos/${id}`, { status })
    toast({
      title: 'Success',
      description: 'Successfully updated todo'
    })
  } catch (error) {
    console.error('Error updating todo:', error)
    toast({
      title: 'Error',
      description: 'Something went wrong when updating todo'
    })
  }
}

export const deleteTodo = async (id: string) => {
  try {
    await instance.delete(`/todos/${id}`)
    toast({
      title: 'Success',
      description: 'Successfully deleted todo'
    })
  } catch (error) {
    console.error('Error deleting todo:', error)
    toast({
      title: 'Error',
      description: 'Something went wrong when deleting todo'
    })
  }
}

export const createTodo = async (data: { note: string; createdAt: Date }) => {
  try {
    await instance.post('/todos', data)
    toast({
      title: 'Success',
      description: 'Successfully created todo'
    })
  } catch (error) {
    console.error('Error creating todo:', error)
    toast({
      title: 'Error',
      description: 'Something went wrong when creating todo'
    })
  }
}
