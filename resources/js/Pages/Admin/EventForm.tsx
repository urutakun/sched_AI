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
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time";
import type { Room as RoomType} from '../Interfaces/Room';
import { toast } from "sonner";
import type { Department as DepartmentType } from "../Interfaces/Department";
import type { Instructor as InstructorType } from "../Interfaces/Instructor";
import type { Event as EventType } from "../Interfaces/Event";

interface EventFormProps {
  departments: DepartmentType[];
  event: EventType;
}

const EventForm = ({ event, departments }: EventFormProps) => {
    const [departmentList, setDepartmentList] = useState<DepartmentType[]>(departments);
    const { data, setData, errors, post, put, reset } = useForm({
      title: event?.title ?? "",
      description: event?.description ?? "",
      start_datetime: event?.start_datetime ?? "",
      end_datetime: event?.end_datetime ?? "",
      type: event?.type ?? "",
      dept_id: event?.dept_id ?? "",
      location: event?.location ?? "",
      status: event?.status ?? "",
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if(event){
          put(`/admin/events/update/${event.id}`, {
            onSuccess: () => toast.success('Event updated successfully'),
            onError: () => toast.error('Failed to update event')
          })
        }
        else{
          post("/admin/events/create", {
              onSuccess: () => {
                  toast.success("Event created successfully");
                  reset();
              },
              onError: () => {
                  toast.error("Failed to create event");
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
                        <FieldLegend>{ event ? 'Update Event' : 'Create Event'}</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Title</FieldLabel>
                                <Input
                                    id="name"
                                    autoComplete="off"
                                    placeholder="e.g., Foundation Week"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                                <FieldError>
                                    {errors.title ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="name">Description</FieldLabel>
                                <Textarea
                                    id="name"
                                    autoComplete="off"
                                    placeholder="e.g., Enjoy student life to the fullest"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                />
                                <FieldError>
                                    {errors.description ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="start_datetime">Start Date & Time</FieldLabel>
                                <DateTimePicker
                                  id="start_datetime"
                                  value={data.start_datetime}
                                  onChange={(value) => setData("start_datetime", value)}
                                />
                                <FieldError>
                                    {errors.start_datetime ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="end_datetime">End Date & Time</FieldLabel>
                                <DateTimePicker
                                  id="end_datetime"
                                  value={data.end_datetime}
                                  onChange={(value) => setData("end_datetime", value)}
                                />
                                <FieldError>
                                    {errors.end_datetime ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Type
                                </FieldLabel>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) =>
                                        setData("type", value as 'school' | 'department')
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select event type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="school"
                                            className="capitalize"
                                        >
                                            School
                                        </SelectItem>
                                        <SelectItem
                                            value="department"
                                            className="capitalize"
                                        >
                                            Department
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError>
                                    {errors.type ?? ""}
                                </FieldError>
                            </Field>
                            {data.type === 'department' && (
                              <Field>
                                  <FieldLabel>
                                      Department
                                  </FieldLabel>
                                  <Select
                                      value={data.dept_id}
                                      onValueChange={(value) =>
                                          setData("dept_id", value)
                                      }
                                  >
                                      <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="Select department" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {
                                          departmentList.map((department: DepartmentType, index: number) => {
                                            return(
                                              <SelectItem value={department.id} key={index} className='capitalize'>{department.name}</SelectItem>
                                            )
                                          })
                                        }
                                      </SelectContent>
                                  </Select>
                                  <FieldError>
                                      {errors.dept_id ?? ""}
                                  </FieldError>
                              </Field>
                            )}
                            <Field>
                                <FieldLabel htmlFor="location">Location</FieldLabel>
                                <Input
                                    id="location"
                                    autoComplete="off"
                                    placeholder="e.g., School"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                />
                                <FieldError>
                                    {errors.description ?? ""}
                                </FieldError>
                            </Field>
                            { event && (
                              <Field>
                                  <FieldLabel>
                                      Status
                                  </FieldLabel>
                                  <Select
                                      value={data.status}
                                      onValueChange={(value) =>
                                          setData("status", value as 'upcoming' | 'ongoing' | 'finished' | 'cancelled')
                                      }
                                  >
                                      <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="upcoming" className="capitalize">Upcoming</SelectItem>
                                          <SelectItem value="ongoing" className="capitalize">Ongoing</SelectItem>
                                          <SelectItem value="finished" className="capitalize">Finished</SelectItem>
                                          <SelectItem value="cancelled" className="capitalize">Cancelled</SelectItem>
                                      </SelectContent>
                                  </Select>
                                  <FieldError>
                                      {errors.status ?? ""}
                                  </FieldError>
                              </Field>
                            )}
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Link href={"/admin/events"}>
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

EventForm.layout = (page: React.ReactNode) => (
    <Layout title="Events">{page}</Layout>
);
export default EventForm;
