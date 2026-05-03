<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class LawyerSpec extends Pivot
{
    use HasFactory;
    protected $table = 'lawyer_spec';
    public $timestamps = false;

    protected $primaryKey = null;
    public $incrementing = false;
    protected $guarded = [];
}
