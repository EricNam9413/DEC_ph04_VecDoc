<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\Document;
use Illuminate\Support\Facades\Auth;

class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
        try {
            $file = $request->file('file');

            if (!$file || !$file->isValid()) {
                Log::error("Invalid file upload.");
                return back()->with('error', 'Invalid file upload');
            }

            $filename = $file->getClientOriginalName();
            $path = Storage::disk('azure')->putFileAs('', $file, $filename);

            if ($path === false) {
                throw new \Exception("File upload to Azure failed.");
            }

            $url = Storage::disk('azure')->url($path);

            $latestVersion = Document::where('rule_id', $request->rule_id)
                             ->max('version');

            // Documentモデルを作成して保存
            $document = new Document;
            $document->rule_id = $request->rule_id; // 関連するRuleのIDまたはnull
            $document->user_id = Auth::id(); // 現在のユーザーのID
            $document->enactment_date = '2023-01-01'; // 文書の制定日
            $document->note = $filename; // ファイル名
            $document->path = $url; // ファイルURLまたはパス
            $document->status = '1'; // 文書の状態
            $document->version = $latestVersion + 1;
            $document->save();

            return back()->with('success', 'Document uploaded successfully');
        } catch (\Exception $e) {
            Log::error("File upload or Document save error: " . $e->getMessage());
            Log::error("Error stack trace: " . $e->getTraceAsString());
            
            return back()->with('error', 'File upload or Document save failed');
        }
    }


    public function showDocuments()
    {
    // 文書を最新順に並べ替え
        $Documents = Document::orderBy('created_at', 'desc')->get();

        return view('your_view', compact('Documents'));
    }
}
