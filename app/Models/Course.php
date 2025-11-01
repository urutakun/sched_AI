<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    /** @use HasFactory<\Database\Factories\CourseFactory> */
    use HasFactory;

    protected $fillable = [
        'id',
        'academic_years_id',
        'trimester_id',
        'dept_id',
        'year_level',
        'code',
        'name',
        'units',
        'has_lab',
        'is_assigned'
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
            $uniqueId = 'CRS_' . mt_rand(000000, 999999);
        } while (self::where('id', $uniqueId)->exists());

        return $uniqueId;
    }

    public function academic_year(){
      return $this->belongsTo(AcademicYear::class, 'academic_years_id', 'id');
    }

    public function trimester(){
      return $this->belongsTo(Trimester::class, 'trimester_id', 'id');
    }

    public function department(){
      return $this->belongsTo(Department::class, 'dept_id', 'id');
    }
}
