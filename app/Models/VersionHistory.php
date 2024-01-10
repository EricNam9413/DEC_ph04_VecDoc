<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VersionHistory extends Model
{
    use HasFactory;

    public static function getDocumentsWithVersion(string $rule_id){

        // rule_idをもとに、中間テーブルからdocument_idを取得
        // 本当は　select * from rule_document where rule_id = $rule_id;
        $document_ids = Rule::find($rule_id)->documents()->pluck('document_id');
        // document_idsが1,2,4,2の場合versionが1.0, 2.0, 3.0, 3.1となるように
        // 初めてのversionの場合は1増やし、過去にあるversionの場合は0.1増やす
        // versionを付与する

        $versions = [];
        $appeared_document_ids = [];
        $documents = [];
        foreach ($document_ids as $document_id) {
            if (empty($appeared_document_ids)) {
                array_push($versions, 1.0);
                $appeared_document_ids[$document_id] = TRUE;
            } else {
                if (isset($appeared_document_ids[$document_id])) {
                    array_push($versions, end($versions) + 0.1);
                } else {
                    array_push($versions, floor(end($versions)) + 1.0);
                    $appeared_document_ids[$document_id] = TRUE;
                }
            }
        }
        
        for ($i = 0; $i < count($document_ids); $i++) {
            $document = Document::find($document_ids[$i]);
            $document->version = $versions[$i];
            array_push($documents, $document);
        }
                
        foreach ($documents as $document) {
            $document->user_name = $document->user->name;
        }
        //versionを降順に並び替え
        usort($documents, function($a, $b) {
            return $b->version <=> $a->version;
        });

        return $documents;



    }
}
