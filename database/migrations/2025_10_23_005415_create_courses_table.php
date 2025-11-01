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
            $table->string('code', 20)->unique();
            $table->string('name');
            $table->integer('units')->default(3);
            $table->string('dept_id');
            $table->string('trimester_id')->nullable();
            $table->string('academic_years_id');
            $table->unsignedTinyInteger('year_level');
            $table->boolean('has_lab')->default(false);
            $table->enum('is_assigned', ['assigned', 'not_assigned'])->default('not_assigned');

            $table->foreign('dept_id')->references('id')->on('departments')->onDelete('cascade');
            $table->foreign('trimester_id')->references('id')->on('trimesters')->onDelete('cascade');
            $table->foreign('academic_years_id')->references('id')->on('academic_years')->onDelete('cascade');


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
