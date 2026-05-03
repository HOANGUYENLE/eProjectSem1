<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    use HasFactory;
    protected $table = 'cities';
    public $timestamps = false;
    protected $guarded = [];

    public function lawyers()
    {
        return $this->hasMany(LawyerFiles::class, 'city', 'id');
    }
}
