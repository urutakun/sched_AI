<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InstructorCancellationRequestNotification extends Notification
{
    use Queueable;

    protected $cancellationRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct($cancellationRequest)
    {
        $this->cancellationRequest = $cancellationRequest;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toDatabase($notifiable)
    {
        $instructor = preg_replace('/\*/', '', $this->cancellationRequest->schedule_session->schedule->courseAssignment->instructor->user->first_name);
        $course = preg_replace('/\*/', '', $this->cancellationRequest->schedule_session->schedule->courseAssignment->course->name);


        return [
            'title' => "Schedule Cancellation Request by {$instructor}",
            'message' => "A cancellation request has been submitted for the course {$course}",
            'url' => route('cancel.request.show', $this->cancellationRequest->id),
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
