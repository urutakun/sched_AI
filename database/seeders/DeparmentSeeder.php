<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeparmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Department::insert([
          [
            'id' => 'DEP_000000',
            'code' => 'TVET',
            'name' => 'Technical-Vocational Education & Training',
            'head' => 'Gail E. Pacquiao'
          ],
          [
            'id' => 'DEP_111111',
            'code' => 'CCE',
            'name' => 'College of Computer Education',
            'head' => 'Genda C. Necio'
          ],
          [
            'id' => 'DEP_222222',
            'code' => 'CTE',
            'name' => 'College of Teacher Education',
            'head' => 'Rio Consigna'
          ],
        ]);
    }
}
