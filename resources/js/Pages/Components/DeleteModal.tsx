import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface DeleteModalProps<T = any> {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  toDelete?: T;
  url: string;
  onDelete?: (id: string) => void;
  nameField: string;
  deletingId: string;
  errorMessage: string;
}

const DeleteModal = <T,>(
  {
    isOpen,
    setIsOpen,
    toDelete,
    url,
    onDelete,
    nameField,
    deletingId,
    errorMessage
  }: DeleteModalProps
  ) => {

  const handleDelete = (): void => {
    if (!deletingId) return;

    axios.delete(`${url}/${deletingId}`)
      .then((res) => {
        toast.success(res.data.message);
        if(onDelete){
          onDelete(deletingId);
        }
        setIsOpen(false);
      })
      .catch((error) => {
        toast.error(errorMessage);
        console.log(error);
      })
  }

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const getDisplayName = (obj: any, path: string): string => {
    if (!obj) return '';

    if (path.includes('+')) {
      const fields = path.split('+').map(f => f.trim());
      return fields
        .map(f => getNestedValue(obj, f))
        .filter(Boolean)
        .join(' ');
    }

    return getNestedValue(obj, path) ?? '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='text-center'>
        <DialogHeader className='flex items-center space-y-4'>
          <div className="icon bg-red-200 text-white p-4 rounded-full">
            <Trash className='text-red-600'/>
          </div>
          <DialogTitle className='text-xl'>Are you sure you want to delete</DialogTitle>
        </DialogHeader>
        <div>
          <span>{toDelete ? getDisplayName(toDelete, nameField) : ''}</span>
        </div>
        <DialogFooter className='flex flex-row justify-center mt-6 w-full'>
          <Button size={'lg'} type="submit"  onClick={handleDelete}>Submit</Button>
          <Button size={'lg'} variant="outline" type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter >
      </DialogContent>
    </Dialog>
  )
}

export default DeleteModal
