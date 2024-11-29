<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Room extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'number', 'building_id'];
    public function getFormattedCreatedAtAttribute(): string
    {
        return Carbon::parse($this->created_at)
            ->setTimezone('Asia/Tashkent')
            ->format('M d, Y H:i:s');
    }



    public function building()
    {
        return $this->belongsTo(Building::class);
    }

}
