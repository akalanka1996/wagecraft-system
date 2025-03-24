
# Laravel Backend API for Payroll System

## Setup Instructions

1. Create a new Laravel project:
```bash
composer create-project laravel/laravel payroll-api
cd payroll-api
```

2. Set up your database connection in `.env` file.

3. Create migrations:

**Create employees table migration:**
```bash
php artisan make:migration create_employees_table
```

In the migration file (`database/migrations/xxxx_xx_xx_create_employees_table.php`):
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('position');
            $table->string('department');
            $table->decimal('salary_amount', 10, 2);
            $table->date('hire_date');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('bank_account')->nullable();
            $table->string('tax_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
```

**Create payrolls table migration:**
```bash
php artisan make:migration create_payrolls_table
```

In the migration file (`database/migrations/xxxx_xx_xx_create_payrolls_table.php`):
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->string('employee_name');
            $table->date('pay_period_start');
            $table->date('pay_period_end');
            $table->decimal('base_amount', 10, 2);
            $table->decimal('deductions', 10, 2);
            $table->decimal('taxes', 10, 2);
            $table->decimal('net_amount', 10, 2);
            $table->enum('status', ['pending', 'processed', 'cancelled'])->default('pending');
            $table->date('processed_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
```

4. Create Models:

**Employee Model:**
```bash
php artisan make:model Employee
```

In `app/Models/Employee.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'position',
        'department',
        'salary_amount',
        'hire_date',
        'status',
        'bank_account',
        'tax_id',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'salary_amount' => 'decimal:2',
    ];

    public function payrolls(): HasMany
    {
        return $this->hasMany(Payroll::class);
    }
}
```

**Payroll Model:**
```bash
php artisan make:model Payroll
```

In `app/Models/Payroll.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'employee_name',
        'pay_period_start',
        'pay_period_end',
        'base_amount',
        'deductions',
        'taxes',
        'net_amount',
        'status',
        'processed_date',
    ];

    protected $casts = [
        'pay_period_start' => 'date',
        'pay_period_end' => 'date',
        'processed_date' => 'date',
        'base_amount' => 'decimal:2',
        'deductions' => 'decimal:2',
        'taxes' => 'decimal:2',
        'net_amount' => 'decimal:2',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
```

5. Create API Controllers:

**Employee Controller:**
```bash
php artisan make:controller API/EmployeeController --api
```

In `app/Http/Controllers/API/EmployeeController.php`:
```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::all();
        return response()->json($employees);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'position' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'salary_amount' => 'required|numeric|min:0',
            'hire_date' => 'required|date',
            'status' => 'required|in:active,inactive',
            'bank_account' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $employee = Employee::create($request->all());
        return response()->json($employee, 201);
    }

    public function show(Employee $employee)
    {
        return response()->json($employee);
    }

    public function update(Request $request, Employee $employee)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:employees,email,' . $employee->id,
            'position' => 'sometimes|required|string|max:255',
            'department' => 'sometimes|required|string|max:255',
            'salary_amount' => 'sometimes|required|numeric|min:0',
            'hire_date' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:active,inactive',
            'bank_account' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $employee->update($request->all());
        return response()->json($employee);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return response()->json(null, 204);
    }
}
```

**Payroll Controller:**
```bash
php artisan make:controller API/PayrollController --api
```

In `app/Http/Controllers/API/PayrollController.php`:
```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PayrollController extends Controller
{
    public function index()
    {
        $payrolls = Payroll::all();
        return response()->json($payrolls);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'pay_period_start' => 'required|date',
            'pay_period_end' => 'required|date|after_or_equal:pay_period_start',
            'base_amount' => 'required|numeric|min:0',
            'deductions' => 'required|numeric|min:0',
            'taxes' => 'required|numeric|min:0',
            'net_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,processed,cancelled',
            'processed_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Get employee name
        $employee = Employee::findOrFail($request->employee_id);
        $employee_name = $employee->first_name . ' ' . $employee->last_name;

        // Create payroll with employee name
        $payrollData = $request->all();
        $payrollData['employee_name'] = $employee_name;
        
        $payroll = Payroll::create($payrollData);
        return response()->json($payroll, 201);
    }

    public function show(Payroll $payroll)
    {
        return response()->json($payroll);
    }

    public function update(Request $request, Payroll $payroll)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'sometimes|required|exists:employees,id',
            'pay_period_start' => 'sometimes|required|date',
            'pay_period_end' => 'sometimes|required|date|after_or_equal:pay_period_start',
            'base_amount' => 'sometimes|required|numeric|min:0',
            'deductions' => 'sometimes|required|numeric|min:0',
            'taxes' => 'sometimes|required|numeric|min:0',
            'net_amount' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:pending,processed,cancelled',
            'processed_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update employee name if employee_id is provided
        if ($request->has('employee_id') && $request->employee_id != $payroll->employee_id) {
            $employee = Employee::findOrFail($request->employee_id);
            $payroll->employee_name = $employee->first_name . ' ' . $employee->last_name;
        }

        $payroll->update($request->all());
        return response()->json($payroll);
    }

    public function destroy(Payroll $payroll)
    {
        $payroll->delete();
        return response()->json(null, 204);
    }

    public function getEmployeePayrolls(Employee $employee)
    {
        $payrolls = $employee->payrolls;
        return response()->json($payrolls);
    }

    public function processPayroll(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'pay_period_start' => 'required|date',
            'pay_period_end' => 'required|date|after_or_equal:pay_period_start',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $employee = Employee::findOrFail($request->employee_id);
        
        // Calculate payroll amounts (simplified calculation)
        $baseAmount = $employee->salary_amount / 12; // Monthly salary
        $taxRate = 0.2; // 20% tax rate
        $taxes = $baseAmount * $taxRate;
        $deductions = $baseAmount * 0.05; // 5% for benefits
        $netAmount = $baseAmount - $taxes - $deductions;
        
        $payroll = Payroll::create([
            'employee_id' => $employee->id,
            'employee_name' => $employee->first_name . ' ' . $employee->last_name,
            'pay_period_start' => $request->pay_period_start,
            'pay_period_end' => $request->pay_period_end,
            'base_amount' => $baseAmount,
            'deductions' => $deductions,
            'taxes' => $taxes,
            'net_amount' => $netAmount,
            'status' => 'processed',
            'processed_date' => now()->format('Y-m-d')
        ]);

        return response()->json($payroll, 201);
    }
}
```

**Dashboard Controller:**
```bash
php artisan make:controller API/DashboardController
```

In `app/Http/Controllers/API/DashboardController.php`:
```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getPayrollSummary()
    {
        // Get active employees count
        $activeEmployees = Employee::where('status', 'active')->count();
        
        // Get average salary
        $averageSalary = Employee::where('status', 'active')->avg('salary_amount') ?: 0;
        
        // Get pending payrolls count
        $pendingPayrolls = Payroll::where('status', 'pending')->count();
        
        // Get total payroll for current month
        $currentMonth = now()->month;
        $currentYear = now()->year;
        $processedPayrolls = Payroll::whereMonth('processed_date', $currentMonth)
            ->whereYear('processed_date', $currentYear)
            ->where('status', 'processed');
            
        $totalPayroll = $processedPayrolls->sum('net_amount');
        
        // Get department breakdown
        $departments = Employee::where('status', 'active')
            ->select('department', DB::raw('count(*) as count'))
            ->groupBy('department')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->department,
                    'count' => $item->count,
                ];
            });
            
        return response()->json([
            'totalEmployees' => $activeEmployees,
            'totalPayroll' => $totalPayroll,
            'averageSalary' => $averageSalary,
            'pendingPayrolls' => $pendingPayrolls,
            'departments' => $departments,
        ]);
    }
}
```

6. Set up API Routes:

In `routes/api.php`:
```php
<?php

use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\PayrollController;
use Illuminate\Support\Facades\Route;

// Employee routes
Route::apiResource('employees', EmployeeController::class);

// Payroll routes
Route::apiResource('payrolls', PayrollController::class);
Route::get('employees/{employee}/payrolls', [PayrollController::class, 'getEmployeePayrolls']);
Route::post('process-payroll', [PayrollController::class, 'processPayroll']);

// Dashboard routes
Route::get('payroll-summary', [DashboardController::class, 'getPayrollSummary']);
```

7. Enable CORS for API:

Edit `config/cors.php`:
```php
<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // In production, replace with your frontend domain
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

8. Run migrations:
```bash
php artisan migrate
```

9. Seed sample data (optional):
```bash
php artisan make:seeder EmployeeSeeder
```

In `database/seeders/EmployeeSeeder.php`:
```php
<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $employees = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@example.com',
                'position' => 'Software Engineer',
                'department' => 'Engineering',
                'salary_amount' => 85000,
                'hire_date' => '2021-05-15',
                'status' => 'active',
                'bank_account' => '123456789',
                'tax_id' => 'TX12345',
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane.smith@example.com',
                'position' => 'Product Manager',
                'department' => 'Product',
                'salary_amount' => 95000,
                'hire_date' => '2020-03-10',
                'status' => 'active',
                'bank_account' => '987654321',
                'tax_id' => 'TX54321',
            ],
            [
                'first_name' => 'Michael',
                'last_name' => 'Johnson',
                'email' => 'michael.j@example.com',
                'position' => 'UI Designer',
                'department' => 'Design',
                'salary_amount' => 78000,
                'hire_date' => '2022-01-20',
                'status' => 'active',
                'bank_account' => '567891234',
                'tax_id' => 'TX67890',
            ],
            [
                'first_name' => 'Emily',
                'last_name' => 'Wilson',
                'email' => 'emily.w@example.com',
                'position' => 'Marketing Specialist',
                'department' => 'Marketing',
                'salary_amount' => 72000,
                'hire_date' => '2021-11-05',
                'status' => 'active',
                'bank_account' => '456789123',
                'tax_id' => 'TX11223',
            ],
            [
                'first_name' => 'Robert',
                'last_name' => 'Brown',
                'email' => 'robert.b@example.com',
                'position' => 'Finance Analyst',
                'department' => 'Finance',
                'salary_amount' => 82000,
                'hire_date' => '2020-08-15',
                'status' => 'inactive',
                'bank_account' => '789123456',
                'tax_id' => 'TX99887',
            ],
        ];

        foreach ($employees as $employeeData) {
            Employee::create($employeeData);
        }
    }
}
```

Update the `DatabaseSeeder.php`:
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            EmployeeSeeder::class,
        ]);
    }
}
```

Run the seeder:
```bash
php artisan db:seed
```

10. Start the API server:
```bash
php artisan serve
```

11. Update Frontend API calls to use the Laravel API endpoints

The API will be accessible at http://localhost:8000/api/
