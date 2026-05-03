<?php

namespace App\Models;
use App\Models\UserTb;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;
    protected $table = 'roles';
    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $fillable = [];

    public function UserTb():HasMany{
        return $this->hasMany(UserTb::class);
    }
}
