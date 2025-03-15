import React, { useId } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteImage } from '@/app/actions/image-actions'
import { cn } from '@/lib/utils'

interface DeleteImageProps{
    imageId: string,
    onDelete?: () => void,
    className?: string,
    imageName: string,
}

const DeleteImage = ({imageId, onDelete, className, imageName}:DeleteImageProps) => {

    const toastId = useId()

    const handleDelete = async ()=>{
        toast.loading('Deleting the image...', {id: toastId})

        const {error, success} = await deleteImage(imageId, imageName);

        if(error){
            toast.error(error, {id: toastId})
        }else if(success){
            toast.success('Image deleted successfully!', {id: toastId})
            onDelete?.()
        }else{
            toast.dismiss(toastId)
        }

    } 
  return (
    <AlertDialog>
  <AlertDialogTrigger asChild>
  <Button variant={"destructive"} className={cn("w-fit", className)}>
                <Trash2 className='w-4 h-4'></Trash2>
            </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete the image.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className='bg-destructive hover:bg-destructive/90' onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

  )
}

export default DeleteImage