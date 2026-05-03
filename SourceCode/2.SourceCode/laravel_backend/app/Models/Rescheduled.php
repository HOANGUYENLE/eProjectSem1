<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AvailabilitySlot;
use App\Models\UserTb;
class Rescheduled extends Model
{
    use HasFactory;

    protected $table = 'rescheduled';
    public $timestamps = true;
    protected $fillable = [
        'appointment_id',
        'customer_id',
        'old_slot_id',
        'new_slot_id',
        'reason',
        'status',
    ];

    public function appointment(){
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }
    public function newSlot(){
        return $this->belongsTo(AvailabilitySlot::class, 'new_slot_id', 'id');
    }
    public function oldSlot(){
        return $this->belongsTo(AvailabilitySlot::class, 'old_slot_id', 'id');
    }
    public function UserTb(){
        return $this->belongsTo(UserTb::class, 'customer_id', 'id');
    }

}
