<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_date',
        'event_start_time',
        'event_end_time',
        'building_id',
        'room_id',
        'fullname',
        'phone_number',
        'email',
        'event_name',
        'event_description',
        'is_approved',
        'is_color'
    ];


    public function building()
    {
        return $this->belongsTo(Building::class);
    }
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

}
