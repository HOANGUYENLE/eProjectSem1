<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SystemNotification;

class ExpireNotifications extends Command
{
    protected $signature = 'notifications:expire';

    protected $description = 'Automatically expire notifications';

    public function handle()
    {
        SystemNotification::where('status', 'published')
            ->where('type', 'system')
            ->where('expired_at', '<=', now())
            ->update([
                'status' => 'expired'
            ]);

        $this->info('Expired notifications updated successfully.');
    }
}