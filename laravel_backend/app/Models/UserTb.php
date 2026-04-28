<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Sanctum\HasApiTokens;
use App\Models\role;
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
}

