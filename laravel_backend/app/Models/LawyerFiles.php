<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\UserTb;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LawyerFiles extends Model
{
    use HasFactory;

    protected $table = 'lawyersfiles';
    public $timestamps = false;
    protected $primaryKey = 'lawyer_id';
    protected $guarded = [];
    protected $hidden = ['cardNumber', 'licenseNumber'];

    public function UserTb():BelongsTo{
        return $this->belongsTo(UserTb::class, 'lawyer_id');
    }

    public function reviews():HasMany{
        return $this->hasMany(\App\Models\Review::class, 'lawyer_id');
    }

}
