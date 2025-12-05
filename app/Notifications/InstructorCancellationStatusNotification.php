<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class InstructorCancellationStatusNotification extends Notification
{
    use Queueable;

    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        $status = ucfirst($this->request->status);
        $reason = $this->request->denial_reason ?? null;

        $message = "Your cancellation request has been {$status}.";
        if ($this->request->status === 'denied' && $reason) {
            $message .= " Reason: {$reason}.";
        }

        return [
            'title' => "Cancellation Request {$status}",
            'message' => $message,
            'url' => route('instructor.cancel.request.show', $this->request->id),
        ];
    }
}
