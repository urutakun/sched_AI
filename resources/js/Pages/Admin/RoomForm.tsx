import Layout from "@/Layouts/Layout";
import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Room as RoomType} from '../Interfaces/Room';
import { toast } from "sonner";
interface RoomFormProps {
  room?: RoomType;
}

const RoomForm = ({ room }: RoomFormProps) => {
    const { data, setData, errors, post, put, reset } = useForm({
        room_name: room?.room_name ?? "",
        room_type: room?.room_type ?? "",
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if(room){
          put(`/admin/rooms/update/${room.room_id}`, {
            onSuccess: () => toast('Room updated successfully'),
            onError: () => toast('Failed to update room')
          })
        }
        else{
          post("/admin/rooms/create", {
              onSuccess: () => {
                  toast("Room created successfully");
                  reset();
              },
              onError: () => {
                  toast("Failed to create room");
                  reset();
              },
          });
        }
    };
    
    return (
        <div className="h-full lg:min-h-[500px] w-full bg-white shadow-sm rounded-2xl p-6 flex justify-center items-center">
            <form
                onSubmit={handleFormSubmit}
                action=""
                className="w-full lg:w-[500px] font-dm lg:border border-custom-accent/50 lg:p-4 rounded-2xl"
            >
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>{ room ? 'Update Room' : 'Create Room'}</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    id="name"
                                    autoComplete="off"
                                    placeholder="e.g., COMLAB1, NB101"
                                    value={data.room_name}
                                    onChange={(e) =>
                                        setData("room_name", e.target.value)
                                    }
                                />
                                <FieldError>
                                    {errors.room_name ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Type
                                </FieldLabel>
                                <Select
                                    value={data.room_type}
                                    onValueChange={(value) =>
                                        setData("room_type", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select room type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="laboratory"
                                            className="capitalize"
                                        >
                                            Laboratory
                                        </SelectItem>
                                        <SelectItem
                                            value="classroom"
                                            className="capitalize"
                                        >
                                            Classroom
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError>
                                    {errors.room_name ?? ""}
                                </FieldError>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Link href={"/admin/rooms"}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
};

RoomForm.layout = (page: React.ReactNode) => (
    <Layout title="Rooms">{page}</Layout>
);
export default RoomForm;
