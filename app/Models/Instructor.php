<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    /** @use HasFactory<\Database\Factories\InstructorFactory> */
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'dept_id',
        'max_load'
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
            $uniqueId = 'INST_' . mt_rand(000000, 999999);
        } while (self::where('id', $uniqueId)->exists());

        return $uniqueId;
    }

    public function user(){
      return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function department(){
      return $this->belongsTo(Department::class, 'dept_id', 'id');
    }

    public function courseAssignments()
{
    return $this->hasMany(\App\Models\CourseAssignment::class, 'instructor_id');
}

}
