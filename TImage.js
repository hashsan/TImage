// 必要なライブラリをインポート
import EXIF from 'exif.js';

/**
 * URLからBlobを取得する関数。
 *
 * @param {string} url - 画像のURL。
 * @returns {Promise<Blob>} - URLから取得した画像のBlobを含むPromise。
 */
async function urlToBlob(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}

/**
 * 画像のURLまたはBlobからタイトルを取得する関数。
 *
 * @param {string | Blob} urlOrBlob - 画像のURLまたはBlob。
 * @returns {Promise<string>} - 画像から読み取ったタイトルを含むPromise。
 */
async function get(urlOrBlob) {
    let imageFile;

    if (typeof urlOrBlob === 'string') {
        // URLの場合は、urlToBlob関数を使用してBlobに変換
        const blob = await urlToBlob(urlOrBlob);
        imageFile = new File([blob], 'image.jpg', { type: blob.type });
    } else {
        // Blobの場合は、そのまま使用
        imageFile = new File([urlOrBlob], 'image.jpg', { type: urlOrBlob.type });
    }

    return new Promise((resolve, reject) => {
        // EXIFデータを取得
        EXIF.getData(imageFile, function() {
            // タイトル（説明）を取得
            const title = EXIF.getTag(this, 'ImageDescription');
            
            // タイトルが存在する場合は返す
            resolve(title || '');
        });
    });
}

/**
 * 画像のURLまたはBlobにタイトルを設定する関数。
 *
 * @param {string} title - 画像に設定するタイトル。
 * @param {string | Blob} urlOrBlob - 画像のURLまたはBlob。
 * @returns {Promise<Blob>} - タイトルが設定された画像のBlobを含むPromise。
 */
async function set(title, urlOrBlob) {
    let imageFile;

    if (typeof urlOrBlob === 'string') {
        // URLの場合は、urlToBlob関数を使用してBlobに変換
        const blob = await urlToBlob(urlOrBlob);
        imageFile = new File([blob], 'image.jpg', { type: blob.type });
    } else {
        // Blobの場合は、そのまま使用
        imageFile = new File([urlOrBlob], 'image.jpg', { type: urlOrBlob.type });
    }

    return new Promise((resolve, reject) => {
        // EXIFデータを取得
        EXIF.getData(imageFile, function() {
            // タイトルを設定
            EXIF.setTag(this, 'ImageDescription', title);

            // EXIFデータを更新してBlobに変換
            const newImageData = EXIF.getDataURL(imageFile);

            // 新しいBlobオブジェクトを作成して返す
            const newBlob = new Blob([newImageData], { type: imageFile.type });
            resolve(newBlob);
        });
    });
}

// `TImage`オブジェクトの作成
const TImage = {
    get,
    set,
    urlToBlob
};

// `TImage`オブジェクトをエクスポート
export default TImage;
