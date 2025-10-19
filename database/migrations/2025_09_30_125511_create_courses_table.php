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
        Schema::create('courses', function (Blueprint $table) {
            $table->string('id', 20)->primary();
            $table->string('crs_code', 20)->unique();
            $table->string('crs_name');
            $table->integer('units')->default(3);
            $table->text('crs_description')->nullable();

            $table->string('instr_id');
            $table->foreign('instr_id')->references('id')->on('instructors')->onDelete('cascade');
            $table->string('dept_id');
            $table->foreign('dept_id')->references('id')->on('departments')->onDelete('cascade');

            $table->enum('semester', ['1st', '2nd', '3rd'])->nullable();
            $table->year('school_year')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
