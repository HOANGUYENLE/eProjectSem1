<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Sanctum\HasApiTokens;
use App\Models\role;
use App\Models\SystemNotification;
use App\Models\PivotNotice;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
class UserTb extends Authenticatable
{
    use HasFactory, HasApiTokens;
    protected $table = 'userstb';
    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $fillable = ['name', 'email', 'password', 'role_id', 'phone'];
    protected $hidden = ['password', 'role_id'];

    public function role():BelongsTo{
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function reviews():HasMany{
        return $this->hasMany(\App\Models\Review::class, 'user_id');
    }

    public function lawyers():HasMany{
        return $this->hasMany(\App\Models\LawyerFiles::class, 'lawyer_id');
    }

    public function appointment():BelongsToMany{
        return $this->belongsToMany(
            \App\Models\AvailabilitySlot::class,
            'appointments', 'customer_id', 'slot_id'
        )->withPivot("status", "request_text" ,"response_text")
        ->withTimestamps();
    }

    public function SystemNotification():BelongsToMany{
        return $this->belongsToMany(
            SystemNotification::class,
            'pivot_notifications',
            'user_id',
            'notification_id'
        )->using(PivotNotice::class);
    }
}

