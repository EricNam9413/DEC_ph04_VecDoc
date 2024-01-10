import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
//import { router } from '@inertiajs/react';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
function handleSearchSubmit(e) {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    window.location.href = route("rule.search", { keyword : keyword });
}

export default function Index({ auth, Rules }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Rule</h2>}
        >
            <Head title="Rule.Index" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            規約一覧
                        </div>
                    </div>
                    {auth.user.role == 2 && (
                        <div className="flex justify-end">
                            <a href={route('rule.create')} class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"><i class="bi bi-plus-square"></i> ルールの追加</a>
                        </div>
                    )}

                    <form className="mb-6 w-40 flex items-center" onSubmit={handleSearchSubmit}>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
                                ルール名カテゴリ名、作成者から検索できます
                            </label>
                            <input
                                id="keyword"
                                className="block mt-1 w-full"
                                type="text"
                                name="keyword"
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="">
                            <i class="bi bi-search"></i>
                        </button>
                    </form>

                    <table className="bg-white text-center w-full border-collaple">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 bg-gray-lightest dark:bg-gray-darkest font-bold uppercase text-lg text-gray-dark dark:text-gray-200 border-b border-grey-light dark:border-grey-dark">ルール名</th>
                                <th className="py-4 px-6 bg-gray-lightest dark:bg-gray-darkest font-bold uppercase text-lg text-gray-dark dark:text-gray-200 border-b border-grey-light dark:border-grey-dark">カテゴリ</th>
                                <th className="py-4 px-6 bg-gray-lightest dark:bg-gray-darkest font-bold uppercase text-lg text-gray-dark dark:text-gray-200 border-b border-grey-light dark:border-grey-dark">最終更新日</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Rules.map(rule => (
                                <tr className="py-5 h-16">
                                    <td><a href={route('rule.show', rule.id)}>{rule.name}</a></td>
                                    <td>{rule.genre_name}</td>
                                    <td>{new Date(rule.updated_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{(rule.latest_version_document_path)&&(<button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                                        onClick={() => loadPdf(rule.latest_version_document_path)}><i class="bi bi-filetype-pdf" style={{ fontSize: '1.5rem' }}></i></button>)}</td>
                                </tr>
                            ))}
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