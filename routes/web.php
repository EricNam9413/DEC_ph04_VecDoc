<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\PdfController;
use App\Http\Controllers\RuleController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\VersionHistoryController;
use App\Http\Controllers\FileUploadController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/show-pdf', [PdfController::class, 'showPdf'])->name('show.pdf');
});

Route::resource('rule', RuleController::class);
Route::resource('document', DocumentController::class);
Route::resource('genre', GenreController::class);
Route::post('/upload', [FileUploadController::class, 'upload']);

Route::get('rule/{id}/document_create', [RuleController::class, 'document_create'])->name('rule.document_create');
Route::get('rule/search/{keyword}', [RuleController::class, 'search'])->name('rule.search');
Route::get('rule/{id}/version_reverse', [VersionHistoryController::class, 'reverse'])->name('version_reverse');
Route::get('document/{id}/status_change', [DocumentController::class, 'status_change'])->name('document.status_change');

require __DIR__.'/auth.php';
