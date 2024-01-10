<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rule;
use App\Models\Genre;
use App\Models\Document;
use App\Models\VersionHistory;
use Inertia\Inertia;

class RuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {   
        // Ruleを取得
        $Rules = Rule::getAllOrderByUpdated_at();
        // Genere_nameを$Rulesに追加
        foreach ($Rules as $Rule) {
            $Rule->genre_name = $Rule->genre->name;    
            $Rule->latest_version_document_path = $Rule->document ? $Rule->document->path : null;
        }
        
        return Inertia::render('Rule/Index', [
            'Rules' => $Rules,         
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $Genres = Genre::getAllOrderByUpdated_at();
        
        return Inertia::render('Rule/Create', [
            'Genres' => $Genres,        
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        //ddd($request->all());
        $result = Rule::create($request->all());
        return redirect()->route('rule.index');
    }

    /**
     * Display the specified resource.
     */
    //　同じRuleのDocumentを表示
    public function show(string $id)
    {
        // <<<<<<< feat/file-upload
        //$Documents = Rule::query()->find($id)->ruleDocuments()->orderBy('created_at', 'asc')->get();
        //return response()->view('rule.show', compact('Documents', 'id'));
        
        // Ruleを取得
        $Rule = Rule::query()->find($id);
        
        // Genre_nameを$Ruleに追加
        $Rule->genre_name = $Rule->genre->name;

        // // Documentを取得
        // $Documents = Rule::query()->find($id)->ruleDocuments()->orderBy('created_at', 'asc')->get();

        // // user_nameを$Documentsに追加
        // $Documents->map(function ($Document) {
        //     $Document->user_name = $Document->user->name;
        //     return $Document;
        // });

        // versionをつける
        // VersionHistoryモデルのgetDocumentsWithVersionメソッド$idで呼び出す
        $Documents = VersionHistory::getDocumentsWithVersion($id);
        
        //Inertiaで画面遷移
        return Inertia::render('Rule/Show', [
            'Rule' => $Rule,
            'Documents' => $Documents,         
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function document_create(string $id)
    {
        // Ruleを取得
        $Rule = Rule::query()->find($id);
        // Genre_nameを$Ruleに追加
        $Rule->genre_name = $Rule->genre->name;
        
        // Documentを取得
        $Documents = Rule::query()->find($id)->ruleDocuments()->orderBy('created_at', 'asc')->get();

        // user_nameを$Documentsに追加
        $Documents->map(function ($Document) {
            $Document->user_name = $Document->user->name;
            return $Document;
        });

        return Inertia::render('Rule/Document_Create', [
            'Rule' => $Rule,
            'Documents' => $Documents,         
        ]);
    }
    
    public function search(string $search)
    {

        //$search = $request->input('search');
        $Rules = Rule::query()
            ->where('name', 'like', "%{$search}%")
            // genre_nameが検索ワードに含まれているか
            ->orWhereHas('genre', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            // user_nameが検索ワードに含まれているか
            ->orWhereHas('documents', function ($query) use ($search) {
                $query->whereHas('user', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                });
            })
            ->get();
        // Genere_nameを$Rulesに追加
        foreach ($Rules as $Rule) {
            $Rule->genre_name = $Rule->genre->name;
        }
        return Inertia::render('Rule/Index', [
            'Rules' => $Rules,         
        ]);
    }
}
