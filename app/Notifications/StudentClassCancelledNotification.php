<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class StudentClassCancelledNotification extends Notification
{
    use Queueable;

    protected $cancellationRequest;

    public function __construct($cancellationRequest)
    {
        $this->cancellationRequest = $cancellationRequest;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => "Class Cancelled",
            'message' => "A class {$this->cancellationRequest->schedule_session->schedule->courseAssignment->course->name} on your schedule has been cancelled.",
            // 'url' => route('cancel.request.show', $this->request->id),
        ];
    }
}
