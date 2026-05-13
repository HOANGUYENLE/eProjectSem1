<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UserTb;
use App\Models\LawyerFiles;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;
    protected $table = 'reviews';
    public $timestamps = true;
    protected $primaryKey = 'lawyer_id';
    protected $guarded = ['create_at', 'updated_at'];

    public function UserTb():BelongsTo{
        return $this->belongsTo(UserTb::class, 'user_id');
    }

    public function LawyersFiles():BelongsTo{
        return $this->belongsTo(LawyerFiles::class, 'lawyer_id');
    }
}
