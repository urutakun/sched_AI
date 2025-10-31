<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseAssignment extends Model
{
    protected $fillable = [
      'id',
      'course_id',
      'instructor_id',
      'room_id',
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
            $uniqueId = 'CA_' . mt_rand(000000, 999999);
        } while (self::where('id', $uniqueId)->exists());

        return $uniqueId;
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id', 'id');
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(Instructor::class, 'instructor_id', 'id');
    }
}
