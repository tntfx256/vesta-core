export interface MimeItem {
    ext: string;
    mime: string;
}

export class MimeType {

    private static types: Array<MimeItem> = [
        {ext: 'avi', mime: 'application/x-troff-msvideo'},
        {ext: 'avi', mime: 'video/avi'},
        {ext: 'avi', mime: 'video/msvideo'},
        {ext: 'avi', mime: 'video/x-msvideo'},
        {ext: 'bmp', mime: 'image/bmp'},
        {ext: 'bmp', mime: 'image/x-windows-bmp'},
        {ext: 'doc', mime: 'application/msword'},
        {ext: 'doc', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'},
        {ext: 'gif', mime: 'image/gif'},
        {ext: 'jpg', mime: 'image/jpeg'},
        {ext: 'jpg', mime: 'image/pjpeg'},
        {ext: 'mp3', mime: 'audio/mpeg3'},
        {ext: 'mp3', mime: 'audio/x-mpeg-3'},
        {ext: 'mp3', mime: 'video/mpeg'},
        {ext: 'mp3', mime: 'video/x-mpeg'},
        {ext: 'mp4', mime: 'video/mp4'},
        {ext: 'mpg', mime: 'audio/mpeg'},
        {ext: 'mpg', mime: 'video/mpeg'},
        {ext: 'pdf', mime: 'application/pdf'},
        {ext: 'png', mime: 'image/png'},
        {ext: 'ppt', mime: 'application/mspowerpoint'},
        {ext: 'ppt', mime: 'application/powerpoint'},
        {ext: 'ppt', mime: 'application/vnd.ms-powerpoint'},
        {ext: 'ppt', mime: 'application/x-mspowerpoint'},
        {ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'},
        {ext: 'txt', mime: 'text/plain'},
        {ext: 'wav', mime: 'audio/wav'},
        {ext: 'wav', mime: 'audio/x-wav'},
        {ext: 'webm', mime: 'audio/webm'},
        {ext: 'webm', mime: 'video/webm'},
        {ext: 'webp', mime: 'image/webp'},
        {ext: 'xls', mime: 'application/excel'},
        {ext: 'xls', mime: 'application/vnd.ms-excel'},
        {ext: 'xls', mime: 'application/x-excel'},
        {ext: 'xls', mime: 'application/x-msexcel'},
        {ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
        {ext: 'zip', mime: 'application/x-compressed'},
        {ext: 'zip', mime: 'application/x-zip-compressed'},
        {ext: 'zip', mime: 'application/zip'},
        {ext: 'zip', mime: 'multipart/x-zip'},
    ];

    public static addMime(ext: string, mime) {
        MimeType.types.push({ext, mime});
    }

    public static getMime(extension: string): Array<string> {
        let types = [];
        if (extension.charAt(0) == '.') {
            extension = extension.substr(1);
        }
        extension = extension.toLowerCase();
        for (let i = MimeType.types.length; i--;) {
            let type = MimeType.types[i];
            if (type.ext == extension) {
                types.push(type.mime);
            }
        }
        return types;
    }

    public static isValid(mimeType: string): boolean {
        mimeType = mimeType.toLowerCase();
        for (let i = MimeType.types.length; i--;) {
            if (MimeType.types[i].mime == mimeType) return true;
        }
        return false;
    }
}