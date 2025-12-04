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
        return ['database'];
    }

    public function toDatabase($notifiable)
    {

        $course = preg_replace('/\*/', '', $this->schedule->courseAssignment->course->name);

        return [
            'title' => 'Schedule Assigned',
            'message' => "A new schedule has been created for {$course}.",
            'schedule_id' => $this->schedule->id,
            'instructor_id' => $this->schedule->courseAssignment->instructor_id ?? null,
            'program_id' => $this->schedule->program_id,
            // 'url' => route('')
        ];
    }
}
