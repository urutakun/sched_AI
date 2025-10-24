<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trimester extends Model
{
    protected $fillable = [
        'id',
        'academic_years_id',
        'name',
        'start_date',
        'end_date',
        'status',
    ];

    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $keyType = 'string';

    protected static function boot(){
        parent::boot();

        static::creating(function ($request) {
            $request->id = self::generateUniqueId();
        });
    }

    private static function generateUniqueId()
    {
        do {
            $uniqueId = 'TRI_' . mt_rand(000000, 999999);
        } while (self::where('id', $uniqueId)->exists());

        return $uniqueId;
    }

    public function academic_year(){
      return $this->belongsTo(AcademicYear::class, 'academic_years_id', 'id');
    }
}
