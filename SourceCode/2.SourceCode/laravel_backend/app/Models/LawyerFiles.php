<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\UserTb;
use App\Models\City;
use App\Models\Specialization;
use App\Models\AvailabilitySlot;
use \App\Models\LawyerSpec;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LawyerFiles extends Model
{
    use HasFactory;

    protected $table = 'lawyersfiles';
    public $timestamps = false;
    protected $primaryKey = 'lawyer_id';
    protected $guarded = [];
    //protected $hidden = ['cardNumber', 'licenseNumber'];

    public function UserTb():BelongsTo{
        return $this->belongsTo(UserTb::class, 'lawyer_id', 'id');
    }

    public function reviews():HasMany{
        return $this->hasMany(\App\Models\Review::class, 'lawyer_id', 'lawyer_id');
    }

    public function city():BelongsTo{
        return $this->belongsTo(City::class, 'city', 'id');
    }

    public function cityRef(): BelongsTo
    {
        return $this->city();
    }

    public function specialization():BelongsToMany{
        return $this -> belongsToMany(
            Specialization::class,
            'lawyer_spec',
            'lawyer_id',
            'specialization_id')->using(LawyerSpec::class);
    }

    public function specializations(): BelongsToMany
    {
        return $this->specialization();
    }


     public function availability(): HasMany
    {
        return $this->hasMany(AvailabilitySlot::class, 'lawyer_id', 'lawyer_id');
    }

     public function availabilitySlots(): HasMany
    {
        return $this->availability();
    }

}
