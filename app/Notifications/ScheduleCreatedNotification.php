<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ScheduleCreatedNotification extends Notification
{
    use Queueable;

    protected $schedule;

    public function __construct($schedule)
    {
        $this->schedule = $schedule;
    }

    public function via($notifiable)
    {
        return ['database']; // Store in DB
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'New Schedule Created',
            'message' => "A new schedule has been created for {$this->schedule->courseAssignment->course->course_name}.",
            'schedule_id' => $this->schedule->id,
            'instructor_id' => $this->schedule->courseAssignment->instructor_id,
            'program_id' => $this->schedule->program_id,
        ];
    }
}
