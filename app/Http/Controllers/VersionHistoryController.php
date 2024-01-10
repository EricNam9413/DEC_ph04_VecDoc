<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rule;
use App\Models\Document;
use Inertia\Inertia;

class VersionHistoryController extends Controller
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
    public static function store(string $rule_id, string $document_id)
    {
        // rule_document_tableにrule_idとdocument_idをattachで追加
        // $rule = Rule::find($rule_id);
        // $rule->documents()->attach($document_id);
        // return redirect()->route('rule.show', $rule_id);
        // Ruleのdocument_idを更新
        Rule::find($rule_id)->update(['document_id' => $document_id]);

        // VersionHistoryControllerのcreate関数でrule_idとdocument_idを保存
        //$tweet->users()->attach(Auth::id());
        Rule::find($rule_id)->documents()->attach($document_id);
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
        // rule_document_tableにrule_idとdocument_idをdetachで削除
        $rule = Rule::find($rule_id);
        $rule->documents()->detach($document_id);
        return redirect()->route('rule.show', $rule_id);
    }

    public function reverse(string $id)
    {   
        $document_id = $id;
        $rule_id = Document::find($document_id)->rule_id;

        // rule_document_tableにrule_idとdocument_idをattachで追加
        // $rule = Rule::find($rule_id);
        // $rule->documents()->attach($document_id);
        // return redirect()->route('rule.show', $rule_id);
        // Ruleのdocument_idを更新
        Rule::find($rule_id)->update(['document_id' => $document_id]);

        // VersionHistoryControllerのcreate関数でrule_idとdocument_idを保存
        //$tweet->users()->attach(Auth::id());
        Rule::find($rule_id)->documents()->attach($document_id);
        
        //　ここまではstore関数と同じ
        return Inertia::location(route('rule.show', $rule_id));
    }
    
}
