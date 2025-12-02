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

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {

        $start = Carbon::parse($this->event->start_datetime)->format('F j, Y g:i A');
        $end   = Carbon::parse($this->event->end_datetime)->format('F j, Y g:i A');

        return [
            'title' => 'New Event',
            'message' => "A new event titled **{$this->event->title}** will take place at **{$this->event->location}** from **{$start}** to **{$end}**.",
            // 'url' => route('')
        ];
    }
}
