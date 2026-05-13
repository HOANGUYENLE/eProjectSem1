<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;
    protected $table = 'appointments';
    public $timestamps = true;
    protected $fillable = [
        'customer_id',
        'lawyer_id',
        'slot_id',
        'status',
        'request_text',
        'response_text',
    ];

    public function UserTb():BelongsTo{
        return $this->belongsTo(\App\Models\UserTb::class, 'customer_id');
    }

    public function reschedules()
    {
        return $this->hasMany(Rescheduled::class, 'appointment_id');
    }

    public function availability():BelongsTo{
        return $this->belongsTo(\App\Models\AvailabilitySlot::class, "slot_id");
    }
    public function lawyer():BelongsTo{
        return $this->belongsTo(\App\Models\LawyerFiles::class, 'lawyer_id', 'lawyer_id');
    }
    public function slot():BelongsTo{
        return $this->belongsTo(\App\Models\AvailabilitySlot::class, 'slot_id');
    }
}
