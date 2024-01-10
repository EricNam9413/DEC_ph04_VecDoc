<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use App\Models\Rule;
use App\Models\Genre;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        //ddd($request->all());
        $genre_id = $request->Rule["genre_id"];
        $genre_name = Genre::find($genre_id)->name;
        $rule_id = $request->Rule["id"];
        $rule_name = Rule::find($rule_id)->name;
        $pdf_file = $request->values["files"][0];
        $note = $request->values["note"];

        // Azureにファイルをアップロード

        // フォルダ名を作成
        $folder_name = $genre_name . "/" . $rule_name;

        $path = Storage::disk('azure')->put($folder_name, $pdf_file);
        $path = env('AZURE_STORAGE_URL') . "/".$path;

        $result = Document::create([
            'rule_id' => $rule_id,
            'user_id' => auth()->user()->id,
            'enactment_date' => now(),
            'path' => $path,
            'note' => $note,
        ]);

        $document_id = $result->id;
        //version_histroyのstoreメソッドを呼び出す
        VersionHistoryController::store($rule_id, $document_id);

        // Inertiaで画面遷移することに注意してrule.show関数を呼ぶ
        // return redirect()->route('rule.show', ['id' => $rule_id]); では画面遷移できない
        // return $this->show($rule_id);　でも画面遷移できない
        // 画面遷移するにはInertia::location()を使う
        return Inertia::location(route('rule.show', $rule_id));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    
    /**
     * status_change
     */
    public function status_change(string $id){
        $document = Document::find($id);
        if ($document->status == "公開"){
            $document->status = "非公開";
        } else {
            $document->status = "公開";
        }
        $document->save();
        return Inertia::location(route('rule.show', $document->rule_id));
    }
}
