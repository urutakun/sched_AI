<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{

    protected $fillable = [
        'id',
        'course_assignment_id',
        'academic_year_id',
        'trimester_id',
        'department_id',
        'program_id',
        'section',
        'room_id',
        'days',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'days' => 'array',
    ];


    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($request) {
            $request->id = self::generateUniqueId();
        });
    }

    private static function generateUniqueId()
    {
        do {
            $uniqueId = 'SKD_' . mt_rand(000000, 999999);
        } while (self::where('id', $uniqueId)->exists());

        return $uniqueId;
    }

    public function courseAssignment()
    {
        return $this->belongsTo(CourseAssignment::class, 'course_assignment_id');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function trimester()
    {
        return $this->belongsTo(Trimester::class, 'trimester_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function sessions(){
      return $this->hasMany(ScheduleSession::class);
    }
}
