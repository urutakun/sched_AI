<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->string('id', 20)->primary();
            $table->string('academic_year_id', 20);
            $table->string('trimester_id', 20);
            $table->string('department_id', 20);
            $table->string('course_assignment_id', 20);
            $table->string('room_id', 20);
            $table->json('days');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('status', ['active', 'pending_cancel', 'cancelled', 'completed'])->default('active');

            $table->timestamps();

            // Foreign Keys
            $table->foreign('academic_year_id')->references('id')->on('academic_years')->onDelete('cascasde');
            $table->foreign('trimester_id')->references('id')->on('trimesters')->onDelete('cascasde');
            $table->foreign('department_id')->references('id')->on('deparments')->onDelete('cascasde');
            $table->foreign('course_assignment_id')->references('id')->on('course_assignments')->onDelete('cascasde');
            $table->foreign('room_id')->references('id')->on('rooms')->onDelete('cascasde');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
