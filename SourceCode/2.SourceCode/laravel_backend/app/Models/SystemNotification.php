<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use \App\Models\UserTb;
use \App\Models\PivotNotice;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SystemNotification extends Model
{
    use HasFactory;
        protected $table = 'system_notification';
        public $timestamps = false;
        protected $primaryKey = 'id';
        protected $guarded = ['id'];

    public function UserTb():BelongsTo{
        return $this->belongsTo(UserTb::class, "author_ID");
    }

    public function toUser():BelongsToMany{
        return $this->belongsToMany(
            UserTb::class,
            'pivot_notifications',
            'notification_id',
            'user_id'
        )->using(PivotNotice::class);
    }

    public function PivotNotice():HasMany{
        return $this->hasMany(PivotNotice::class, "notification_id", "id");
    }
    
}
