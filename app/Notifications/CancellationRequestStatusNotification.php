<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CancellationRequestStatusNotification extends Notification
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
        $status = ucfirst($this->cancellationRequest->status);

        $instructor = preg_replace('/\*/', '', $this->cancellationRequest
            ->schedule_session
            ->schedule
            ->courseAssignment
            ->instructor
            ->user
            ->first_name);

        $course = preg_replace('/\*/', '', $this->cancellationRequest
            ->schedule_session
            ->schedule
            ->courseAssignment
            ->course
            ->name);

        // Base message for all users
        $message = "The cancellation request submitted by Instructor {$instructor} "
            . "for the course {$course} has been {$status}.";

        // Add denial reason if needed
        if ($this->cancellationRequest->status === 'denied' && $this->cancellationRequest->denial_reason) {
            $message .= " Reason: {$this->cancellationRequest->denial_reason}";
        }

        return [
            'title' => "Cancellation Request {$status}",
            'message' => $message,
            'url' => route('cancel.request.show', $this->cancellationRequest->id),
        ];
    }
}
