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
        // ✅ FIX: Add proper null checking
        $courseName = 'Unknown Course';
        
        if ($this->schedule->courseAssignment && 
            $this->schedule->courseAssignment->course) {
            $courseName = $this->schedule->courseAssignment->course->course_name ?? 'Unknown Course';
        }

        return [
            'title' => 'New Schedule Created',
            'message' => "A new schedule has been created for {$courseName}.",
            'schedule_id' => $this->schedule->id,
            'instructor_id' => $this->schedule->courseAssignment->instructor_id ?? null,
            'program_id' => $this->schedule->program_id,
        ];
    }
}