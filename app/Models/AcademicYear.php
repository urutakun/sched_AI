<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = [
        'id',
        'year_start',
        'year_end',
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
            $uniqueId = 'AY_' . mt_rand(000000, 999999);
        } while (self::where('id', $uniqueId)->exists());

        return $uniqueId;
    }
}
