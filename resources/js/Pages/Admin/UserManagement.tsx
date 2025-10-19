import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import type { User } from '../Interfaces/User';
import { DataTable } from '../Components/DataTable';
import { UserManagementColumns } from '../Components/UserManagementColumns';
import { router } from '@inertiajs/react';


interface UserManagementProps {
  users: User[];
}

const UserManagement = ({ users }: UserManagementProps) => {
  const [userList, setUserList] = useState<User[]>(users);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = userList?.find((item: User) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/admin/departments/edit/${id}`);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={UserManagementColumns(handleEdit, setIsOpen, setDeletingId)} data={userList} filterLabel={"last name"} filterColumn={"last_name"} createUrl={'/admin/user-management/create'}/>
    </div>
  )
}

UserManagement.layout = (page: React.ReactNode) => <Layout title={'User Management'}>{page}</Layout>
export default UserManagement
