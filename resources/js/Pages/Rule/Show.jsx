import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ auth, Rule, Documents }) {
    const styles = {
        body: {
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            textAlign: 'center',
            margin: 0,
            padding: 0,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        iframe: {
            flexGrow: 1,
            width: '80%',
            border: 'none',
            marginBottom: '20px',
        },
        button: {
            display: 'block',
            margin: '10px auto',
            fontSize: '16px',
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        tableCell: {
            border: '1px solid black',
            padding: '8px',
            textAlign: 'left',
        },
        tableHeader: {
            backgroundColor: '#f2f2f2',
        },
        dropArea: {
            border: '2px dashed #ccc',
            borderRadius: '5px',
            padding: '20px',
            textAlign: 'center',
        },
        highlight: {
            borderColor: 'purple',
        },
    };
        function loadPdf(url) {
            var iframe = document.getElementById('pdfIframe');
            iframe.src = url; // PDFをロードするためのURLをiframeに設定
        }

        function goBack() {
            var iframe = document.getElementById('pdfIframe');
            iframe.src = 'about:blank'; // PDFビューアを閉じる
        }

        // let dropArea = document.getElementById('drop-area');
        // let fileList = document.getElementById('file-list');

        // ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        //     dropArea.addEventListener(eventName, preventDefaults, false);
        // });

        // function preventDefaults(e) {
        //     e.preventDefault();
        //     e.stopPropagation();
        // }

        // ['dragenter', 'dragover'].forEach(eventName => {
        //     dropArea.addEventListener(eventName, highlight, false);
        // });

        // ['dragleave', 'drop'].forEach(eventName => {
        //     dropArea.addEventListener(eventName, unhighlight, false);
        // });

        // function highlight(e) {
        //     dropArea.classList.add('highlight'); // ドラッグ時のハイライト
        // }

        // function unhighlight(e) {
        //     dropArea.classList.remove('highlight'); // ハイライトを解除
        // }

        // dropArea.addEventListener('drop', handleDrop, false);

        // function handleDrop(e) {
        //     let dt = e.dataTransfer;
        //     let files = dt.files;
        //     handleFiles(files); // ファイル処理
        // }

        // function handleFiles(files) {
        //     fileList.innerHTML = ''; // リストをクリア
        //     for (let i = 0, numFiles = files.length; i < numFiles; i++) {
        //         const file = files[i];
        //         const listItem = document.createElement('li');
        //         listItem.textContent = file.name; // ファイル名をリストに表示
        //         fileList.appendChild(listItem);
        //     }
        // }
    return (
        // このコードは、resources/js/Pages/Rule/Index.jsxのコードとほぼ同じです。のちに、このコードを再利用するために、コンポーネント化しておく予定。
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Rule</h2>}
        >
            <Head title="Rule.Index" />

            <div class="py-12">
                <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 text-gray-900 dark:text-gray-100">
                            { Rule.genre_name} / { Rule.name }
                        </div>
                    </div>
                    {auth.user.role == 2 && (
                        <div class="flex justify-end">
                            <a href={route('rule.document_create', Rule.id)} class="bg-red-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"><i class="bi bi-plus-square"></i> 文書のアップロード</a>
                        </div>
                    )}

                    <table class="bg-white text-center w-full border-collaple">
                        <thead>
                            <tr>
                                <th class="py-4 px-6 bg-gray-lightest dark:bg-gray-darkest font-bold uppercase text-lg text-gray-dark dark:text-gray-200 border-b border-grey-light dark:border-grey-dark">状態</th>
                                <th class="py-4 px-6 bg-gray-lightest dark:bg-gray-darkest font-bold uppercase text-lg text-gray-dark dark:text-gray-200 border-b border-grey-light dark:border-grey-dark">メモ</th>
                                <th class="py-4 px-6 bg-gray-lightest dark:bg-gray-darkest font-bold uppercase text-lg text-gray-dark dark:text-gray-200 border-b border-grey-light dark:border-grey-dark">作成者</th>
                                <th class="py-4 px-6 bg-gray-lightest dark:bg-gray-darkest font-bold uppercase text-lg text-gray-dark dark:text-gray-200 border-b border-grey-light dark:border-grey-dark">更新日</th>
                                <th class="py-4 px-6 bg-gray-lightest dark:bg-gray-darkest font-bold uppercase text-lg text-gray-dark dark:text-gray-200 border-b border-grey-light dark:border-grey-dark">バージョン</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Documents.map(document => {
                                if (document.status == '公開' || auth.user.role == 2) {
                                    return (
                                        <tr>
                                            {auth.user.role == 2 && (
                                                <td><a href={route('document.status_change', document.id)}>{document.status}</a></td>
                                            )}
                                            {auth.user.role == 1 && (
                                                <td>{document.status}</td>
                                            )}
                                            <td>{document.note}</td>
                                            <td>{document.user_name}</td>
                                            <td>{new Date(document.updated_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                                            {/* document.versionを小数点以下2桁で表示 */}
                                            <td>{document.version.toFixed(2)}</td>
                                            {auth.user.role == 2 && (
                                                <div class="flex justify-end">
                                                    <a href={route('version_reverse', document.id)}>これを最新バージョンにする</a>
                                                </div>
                                            )}
                                            <td><button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                                                onClick={() => loadPdf(document.path)}><i class="bi bi-filetype-pdf" style={{ fontSize: '1.5rem' }}></i></button></td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                    <div style={styles.body}>
                        <iframe id="pdfIframe" src="about:blank" style={styles.iframe}></iframe>
                        <button
                            style={styles.button}
                            onMouseOver={() => (styles.button.backgroundColor = styles.buttonHover.backgroundColor)}
                            onMouseOut={() => (styles.button.backgroundColor = '#007bff')}
                            onClick={goBack}
                        >
                            PDF Viewer Close
                        </button>
                        <button style={styles.button} onClick={() => (window.location.href = '/dashboard')}>
                            Return to Dashboard
                        </button>
                        {/* Add other elements using the defined styles */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}