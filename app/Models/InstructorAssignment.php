<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstructorAssignment extends Model
{
    /** @use HasFactory<\Database\Factories\InstructorAssignmentFactory> */
    use HasFactory;

    protected $fillable = [
        'id',
        'instr_id',
        'sub_id',
        'sect_id',
        'semester',
        'year',
    ];
}
