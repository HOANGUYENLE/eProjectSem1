<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\SystemNotification;
use App\Models\Appointment;
use App\Models\UserTb;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PivotNotice extends Model
{
    use HasFactory;
    protected $table = 'pivot_notifications';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = null;
    protected $guarded = [];

    public function systemNotification():BelongsTo{
        return $this->belongsTo(SystemNotification::class, 'notification_id');
    }

    public function appointment():BelongsTo{
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }

    public function UserTb()
    {
        return $this->belongsTo(UserTb::class, 'user_id');
    }
}
