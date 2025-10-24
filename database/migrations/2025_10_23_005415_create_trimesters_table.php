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
        Schema::create('trimesters', function (Blueprint $table) {
            $table->string('id', 20)->primary();
            $table->string('academic_years_id', 20);
            $table->string('name');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('inactive');
            $table->timestamps();

            $table->foreign('academic_years_id')->references('id')->on('academic_years')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trimesters');
    }
};
