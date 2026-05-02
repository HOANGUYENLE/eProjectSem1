<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Appointment;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AvailabilitySlot extends Model
{
    use HasFactory;
    protected $table = 'availability_slots';
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = [
        'is_booked' => 'boolean',
    ];

    public function lawyer(): BelongsTo
    {
        return $this->belongsTo(LawyerFiles::class, 'lawyer_id', 'lawyer_id');
    }

    public function appointment():HasMany{
        return $this->hasMany(Appointment::class, 'slot_id', 'id');
    }

    public function UserTb():BelongsToMany{
        return $this->belongsToMany(
            \App\Models\UserTb::class,
            "appointments", "slot_id", "customer_id"
        )->withPivot("status", "request_text" ,"response_text"
        )->withTimestamps();
    }
}
