<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class InstructorSubmittedCancellationRequestNotification extends Notification
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
        $course = preg_replace('/\*/', '', $this->cancellationRequest->schedule_session->schedule->courseAssignment->course->name);

        return [
            'title' => 'Cancellation Request Submitted',
            'message' => "You have submitted a cancellation request for the course: {$course}.",
            // 'url' => route('cancel.request.show', $this->cancellationRequest->id),
        ];
    }
}
