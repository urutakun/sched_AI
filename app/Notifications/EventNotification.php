<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class EventNotification extends Notification
{
    use Queueable;

    protected $event;

    public function __construct($event)
    {
        $this->event = $event;
    }

    public function via($notifiable)    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {

        $start = Carbon::parse($this->event->start_datetime)->format('F j, Y g:i A');
        $end   = Carbon::parse($this->event->end_datetime)->format('F j, Y g:i A');

        $title = preg_replace('/\*/', '', $this->event->title);
        $location = preg_replace('/\*/', '', $this->event->location);

        return [
            'id' => $this->event->id,
            'title' => 'New Event',
            'message' => "A new event titled {$title} will take place at {$location} from {$start} to {$end}.",
            'read_at' => $this->event->read_at
            // 'url' => route('')
        ];
    }
}
