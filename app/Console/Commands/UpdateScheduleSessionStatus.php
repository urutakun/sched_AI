<?php

namespace App\Console\Commands;

use App\Http\Controllers\SessionController;
use App\Models\ScheduleSession;
use Illuminate\Console\Command;

class UpdateScheduleSessionStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-schedule-session-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */

    public function handle()
    {
        SessionController::updateStatus();
        $this->info('Schedule session status updated successfully');
    }
}
