<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\LawyerFiles;
use \App\Models\LawyerSpec;
class Specialization extends Model
{
    use HasFactory;
    protected $table = 'specializations';
    public $timestamps = false;
    protected $guarded = [];

    public function lawyers():BelongsToMany{
        return $this->belongsToMany(
            LawyerFiles::class, 
            'lawyer_spec',
            'specialization_id',
            'lawyer_id')->using(LawyerSpec::class);
    }
}
