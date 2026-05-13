<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UserTb;

class FAQ extends Model
{
    use HasFactory;
    protected $table = 'faq';
    protected $primaryKey = 'id';
    protected $guarded = ['created_at', 'updated_at'];

    public function UserTb(){
        return $this->belongsTo(UserTb::class, 'author_ID');
    }
}


