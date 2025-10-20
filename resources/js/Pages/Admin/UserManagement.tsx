import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import type { User } from '../Interfaces/User';
import DeleteModal from '../Components/DeleteModal';
import { DataTable } from '../Components/DataTable';
import { UserManagementColumns } from '../Components/UserManagementColumns';
import { router } from '@inertiajs/react';
import { Department } from '../Interfaces/Department';



interface UserManagementProps {
  users: User[];
  departments: Department[];
}

const UserManagement = ({ users, departments }: UserManagementProps) => {
  const [userList, setUserList] = useState<User[]>(users);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = userList?.find((item: User) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/admin/user-management/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_users = userList.filter((item: User) => item.id !== id);
    setUserList(filtered_users);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={UserManagementColumns(handleEdit, setIsOpen, setDeletingId)} data={userList} filterLabel={"last name"} filterColumn={"last_name"} createUrl={'/admin/user-management/create'}/>
      <DeleteModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      toDelete={toDelete}
      onDelete={onDelete}
      deletingId={deletingId}
      url={'/admin/user-management/delete'}
      nameField="last_name"
      errorMessage="Failed to create user"
      />
    </div>
  )
}

UserManagement.layout = (page: React.ReactNode) => <Layout title={'User Management'}>{page}</Layout>
export default UserManagement
